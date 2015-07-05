// Generated by CoffeeScript 1.9.3
(function() {
  var HOME_PAGE, sequelize;

  HOME_PAGE = '/';

  sequelize = require('sequelize');

  exports.postList = function(req, res) {
    var Tag, User;
    Tag = global.db.models.tag;
    User = global.db.models.user;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var Inbox, base, base1;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      Inbox = global.db.models.inbox;
      if ((base = req.body).offset == null) {
        base.offset = 0;
      }
      if ((base1 = req.body).limit == null) {
        base1.limit = 20;
      }
      if (typeof req.body.tags === "string") {
        req.body.tags = JSON.parse(req.body.tags);
      }
      return Inbox.findAndCountAll({
        where: (function() {
          switch (user.privilege) {
            case 'admin':
              return void 0;
            case 'consumer':
              return {
                consumerId: user.id
              };
            case 'dispatcher':
              return {
                $or: [
                  {
                    status: 'received',
                    dispatcherId: user.id
                  }
                ]
              };
            case 'auditor':
              return {
                status: 'handled'
              };
          }
        })(),
        include: req.body.tags ? {
          model: Tag,
          where: {
            id: req.body.tags
          }
        } : void 0,
        offset: req.body.offset,
        limit: req.body.limit
      });
    }).then(function(result) {
      return res.json({
        status: 1,
        msg: "Success",
        mails: result.rows,
        count: result.count
      });
    })["catch"](global.myError.UnknownUser, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postDetail = function(req, res) {
    return global.db.Promise.resolve().then(function() {
      var User;
      if (!req.session.user) {
        throw new global.myError.UnknownUser();
      }
      User = global.db.models.user;
      return User.findById(req.session.user.id);
    }).then(function(user) {
      var Inbox, base;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      Inbox = global.db.models.inbox;
      if ((base = req.body).mail == null) {
        base.mail = null;
      }
      return Inbox.find({
        where: (function() {
          switch (user.privilege) {
            case 'admin':
              return {
                id: req.body.mail
              };
            case 'consumer':
              return {
                id: req.body.mail,
                status: 'assigned',
                consumerId: user.id
              };
            case 'dispatcher':
              return {
                id: req.body.mail,
                status: 'received'
              };
            case 'auditor':
              return {
                id: req.body.mail,
                status: 'handled'
              };
          }
        })()
      });
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      return res.json({
        status: 1,
        msg: "Success",
        mail: mail
      });
    })["catch"](global.myError.UnknownUser, global.myError.UnknownMail, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postDispatch = function(req, res) {
    var Inbox, User, currentConsumer, currentDispatcher;
    User = global.db.models.user;
    Inbox = global.db.models.inbox;
    currentConsumer = void 0;
    currentDispatcher = void 0;
    return global.db.Promise.resolve().then(function() {
      if (!req.session.user) {
        throw new global.myError.UnknownUser();
      }
      return User.findById(req.session.user.id);
    }).then(function(dispatcher) {
      var ref;
      if (!dispatcher) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = dispatcher.privilege) === 'dispatcher' || ref === 'admin')) {
        throw new global.myError.InvalidAccess();
      }
      currentDispatcher = dispatcher;
      return User.findById(req.body.consumer);
    }).then(function(consumer) {
      var ref;
      if (!consumer) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = consumer.privilege) === 'consumer' || ref === 'admin')) {
        throw new global.myError.InvalidAccess();
      }
      currentConsumer = consumer;
      return Inbox.findById(req.body.mail);
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      return mail.setConsumer(currentConsumer);
    }).then(function(mail) {
      return mail.setDispatcher(currentDispatcher);
    }).then(function(mail) {
      mail.status = 'assigned';
      return mail.save();
    }).then(function() {
      return res.json({
        status: 1,
        msg: "Success"
      });
    })["catch"](global.myError.InvalidAccess, global.myError.UnknownUser, global.myError.UnknownMail, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postHandle = function(req, res) {
    var Outbox, User, currentConsumer;
    User = global.db.models.user;
    Outbox = global.db.models.outbox;
    currentConsumer = void 0;
    return global.db.Promise.resolve().then(function() {
      if (!req.session.user) {
        throw new global.myError.UnknownUser();
      }
      return User.findById(req.session.user.id);
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = user.privilege) === 'admin' || ref === 'consumer')) {
        throw new global.myError.InvalidAccess();
      }
      return Outbox.build(req.body);
    }).then(function(mail) {
      if (req.body.urgent === '1') {
        mail.status = 'audited';
      } else {
        mail.status = 'handled';
      }
      return mail.save();
    }).then(function(mail) {
      mail.setConsumer(currentConsumer);
      return mail.getReplyTo();
    }).then(function(replyTo) {
      if (replyTo.status !== 'assigned') {
        throw new global.myError.InvalidAccess();
      }
      replyTo.status = 'handled';
      return replyTo.save();
    }).then(function() {
      return res.json({
        status: 1,
        msg: "Success"
      });
    })["catch"](global.myError.UnknownUser, global.myError.InvalidAccess, sequelize.ValidationError, sequelize.ForeignKeyConstraintError, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postUpdate = function(req, res) {
    var Inbox, User, currentMail;
    User = global.db.models.user;
    Inbox = global.db.models.inbox;
    currentMail = void 0;
    return global.db.Promise.resolve().then(function() {
      if (!req.session.user) {
        throw new global.myError.UnknownUser();
      }
      return User.findById(req.session.user.id);
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = user.privilege) === 'admin' || ref === 'dispatcher')) {
        throw new global.myError.InvalidAccess();
      }
      return Inbox.findById(req.body.mail);
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      if (req.body.deadline) {
        mail.deadline = new Date(req.body.deadline);
      }
      return mail.save();
    }).then(function(mail) {
      currentMail = mail;
      if (!req.body.tags) {
        return void 0;
      }
      if (req.body.tags) {
        return currentMail.setTags(req.body.tags);
      }
    }).then(function() {
      return res.json({
        status: 1,
        mail: currentMail,
        msg: "Success"
      });
    })["catch"](global.myError.UnknownUser, global.myError.UnknownMail, global.myError.InvalidAccess, sequelize.ValidationError, sequelize.ForeignKeyConstraintError, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postReturn = function(req, res) {
    var Inbox, User, currentUser;
    User = global.db.models.user;
    Inbox = global.db.models.inbox;
    currentUser = void 0;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if ((ref = user.privilege) !== 'admin' && ref !== 'consumer') {
        throw new global.myError.InvalidAccess();
      }
      currentUser = user;
      return Inbox.findById(req.body.mail);
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      if (mail.status !== 'assigned') {
        throw new global.myError.InvalidAccess();
      }
      if (mail.consumerId !== currentUser.id && currentUser.privilege === 'consumer') {
        throw new global.myError.InvalidAccess();
      }
      mail.status = 'received';
      mail.consumerId = null;
      return mail.save();
    }).then(function(mail) {
      return res.json({
        status: 1,
        msg: 'Success',
        mail: mail
      });
    })["catch"](global.myError.InvalidAccess, global.myError.UnknownMail, global.myError.UnknownUser, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postFinish = function(req, res) {
    var Inbox, User, currentUser;
    User = global.db.models.user;
    Inbox = global.db.models.inbox;
    currentUser = void 0;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if ((ref = user.privilege) !== 'admin' && ref !== 'consumer') {
        throw new global.myError.InvalidAccess();
      }
      currentUser = user;
      return Inbox.findById(req.body.mail);
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.UnknownMail();
      }
      if (mail.status !== 'assigned') {
        throw new global.myError.InvalidAccess();
      }
      if (mail.consumerId !== currentUser.id && currentUser.privilege === 'consumer') {
        throw new global.myError.InvalidAccess();
      }
      mail.status = 'finished';
      return mail.save();
    }).then(function(mail) {
      return res.json({
        status: 1,
        msg: 'Success',
        mail: mail
      });
    })["catch"](global.myError.InvalidAccess, global.myError.UnknownMail, global.myError.UnknownUser, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

}).call(this);

//# sourceMappingURL=controller.js.map

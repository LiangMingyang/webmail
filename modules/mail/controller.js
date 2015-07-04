// Generated by CoffeeScript 1.9.3
(function() {
  var HOME_PAGE;

  HOME_PAGE = '/';

  exports.postList = function(req, res) {
    return global.db.Promise.resolve().then(function() {
      var User;
      if (!req.session.user) {
        throw new global.myError.UnknownUser();
      }
      User = global.db.models.user;
      return User.findById(req.session.user.id);
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
      return Inbox.findAndCountAll({
        where: (function() {
          switch (user.privilege) {
            case 'admin':
              return void 0;
            case 'consumer':
              return {
                status: 'assigned',
                assignee: user.id
              };
            case 'dispatcher':
              return {
                status: 'received'
              };
            case 'auditor':
              return {
                status: 'handled'
              };
          }
        })(),
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
                assignee: user.id
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

}).call(this);

//# sourceMappingURL=controller.js.map

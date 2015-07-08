// Generated by CoffeeScript 1.9.3
(function() {
  var HOME_PAGE, Promise, sequelize;

  HOME_PAGE = '/';

  sequelize = require('sequelize');

  Promise = require('sequelize').Promise;

  exports.postSend = function(req, res) {
    var User;
    User = global.db.models.user;
    return Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var Util;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      Util = global.myUtil;
      if (typeof req.body.receivers === 'string') {
        req.body.receivers = JSON.parse(req.body.receivers);
      }
      return Util.message.send({
        title: req.body.title,
        html: req.body.html,
        text: req.body.text,
        sender: user.id,
        receivers: req.body.receivers
      });
    }).then(function(result) {
      console.log(result);
      return res.json({
        status: 1,
        msg: "Success"
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postReceive = function(req, res) {
    var Message, User;
    Message = global.db.models.message;
    User = global.db.models.user;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var base;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if ((base = req.body).lastMessage == null) {
        base.lastMessage = 0;
      }
      return Message.findAll({
        id: {
          $gt: req.body.lastMessage
        },
        include: [
          {
            model: User,
            as: 'receiver',
            where: {
              id: user.id
            }
          }
        ]
      });
    }).then(function(messages) {
      return res.json({
        status: 1,
        msg: "Success",
        messages: messages
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

  exports.postSent = function(req, res) {
    var Message, User;
    Message = global.db.models.message;
    User = global.db.models.user;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var base;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if ((base = req.body).lastMessage == null) {
        base.lastMessage = 0;
      }
      return Message.findAll({
        id: {
          $gt: req.body.lastMessage
        },
        include: [
          {
            model: User,
            as: 'sender',
            where: {
              id: user.id
            }
          }, {
            model: User,
            as: 'receiver'
          }
        ]
      });
    }).then(function(messages) {
      return res.json({
        status: 1,
        msg: "Success",
        messages: messages
      });
    })["catch"](function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    });
  };

}).call(this);

//# sourceMappingURL=controller.js.map

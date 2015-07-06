// Generated by CoffeeScript 1.9.3
(function() {
  var HOME_PAGE, sequelize;

  HOME_PAGE = '/';

  sequelize = require('sequelize');

  exports.getAll = function(req, res) {
    var Tag;
    Tag = global.db.models.tag;
    return Tag.findAll().then(function(tags) {
      return res.json({
        status: 1,
        msg: "Success",
        tags: tags
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postAdd = function(req, res) {
    var Tag, User;
    Tag = global.db.models.tag;
    User = global.db.models.user;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = user.privilege) === 'admin' || ref === 'dispatcher')) {
        throw new global.myError.InvalidAccess();
      }
      return Tag.create(req.body);
    }).then(function(tag) {
      return res.json({
        status: 1,
        msg: "Success",
        tag: tag
      });
    })["catch"](sequelize.ValidationError, function(err) {
      return res.json({
        status: 0,
        msg: err.message
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

  exports.postDel = function(req, res) {
    var Tag, User;
    Tag = global.db.models.tag;
    User = global.db.models.user;
    return global.db.Promise.resolve().then(function() {
      if (req.session.user) {
        return User.findById(req.session.user.id);
      }
    }).then(function(user) {
      var ref;
      if (!user) {
        throw new global.myError.UnknownUser();
      }
      if (!((ref = user.privilege) === 'admin' || ref === 'dispatcher')) {
        throw new global.myError.InvalidAccess();
      }
      if (typeof req.body.tags === "string") {
        req.body.tags = JSON.parse(req.body.tags);
      }
      return Tag.destroy({
        where: {
          id: req.body.tags
        }
      });
    }).then(function() {
      return res.json({
        status: 1,
        msg: "Success"
      });
    })["catch"](function(err) {
      console.log(err);
      return res.redirect(HOME_PAGE);
    });
  };

}).call(this);

//# sourceMappingURL=controller.js.map

// Generated by CoffeeScript 1.9.3
(function() {
  var Promise;

  Promise = require('sequelize').Promise;

  exports.send = function(data) {
    var Message, form;
    Message = global.db.models.message;
    form = {
      title: data.title,
      html: data.html,
      text: data.text
    };
    return Message.create(form).then(function(message) {
      return global.db.Promise.all([message.setSender(data.senderId), message.setReceivers(data.receivers)]);
    });
  };

}).call(this);

//# sourceMappingURL=index.js.map

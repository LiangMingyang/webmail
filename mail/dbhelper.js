// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(title, from, text, html) {
    var Inbox;
    Inbox = global.db.models.inbox;
    return Inbox.create({
      title: title,
      from: from,
      text: text,
      html: html
    })["catch"](function(err) {
      return console.log(err);
    });
  };

}).call(this);

//# sourceMappingURL=dbhelper.js.map

module.exports = (title, from, text, html)->
  Inbox = global.db.models.inbox
  Inbox
    .create {
      title : title
      from : from
      text : text
      html : html
    }
    .catch (err)->
      console.log err

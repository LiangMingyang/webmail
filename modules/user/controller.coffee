HOME_PAGE = '/'
passwordHash = require('password-hash')
exports.postLogin = (req, res) ->
  form = {
    username: req.body.username
    password: req.body.password
  }

  #precheckForLogin(form)
  User = global.db.models.user

  User.find {
    where:
      username: form.username
  }
  .then (user)->
    throw new global.Error.LoginError() if not user #û���ҵ����û�
    throw new global.Error.LoginError() if not passwordHash.verify(form.password, user.password) #�ж������Ƿ���ȷ

    res.json {
      status : 1
      msg : "Success"
    }
  .catch myUtils.Error.LoginError, (err)->
    res.json {
      status : 0
      msg : err.message
    }
  .catch (err)->
    console.log err
    res.redirect HOME_PAGE
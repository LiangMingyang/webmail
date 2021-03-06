// Generated by CoffeeScript 1.9.3
(function() {
  var Promise, TAG_ASSIGNED, TAG_AUDITED, TAG_FINISHED, TAG_HANDLED, TAG_RECEIVED, config, isStopped, mailer, promiseWhile, work;

  Promise = require('sequelize').Promise;

  mailer = require('nodemailer');

  config = require('../config');

  isStopped = false;

  TAG_RECEIVED = 1;

  TAG_ASSIGNED = 2;

  TAG_HANDLED = 3;

  TAG_AUDITED = 4;

  TAG_FINISHED = 5;

  promiseWhile = function(action) {
    var my_loop, resolver;
    resolver = Promise.defer();
    my_loop = function() {
      if (isStopped) {
        return resolver.resolve();
      }
      return Promise.cast(action()).then(my_loop)["catch"](resolver.reject);
    };
    process.nextTick(my_loop);
    return resolver.promise;
  };

  work = function() {
    var currentMail;
    currentMail = void 0;
    return global.db.models.outbox.find({
      where: {
        status: 'audited'
      }
    }).then(function(mail) {
      if (!mail) {
        throw new global.myError.NoTask();
      }
      currentMail = mail;
      return global.transporter.sendMailPromised({
        to: mail.to,
        from: config.mail.auth.username + "<" + config.mail.auth.mailaddr + ">",
        subject: mail.title,
        html: require('./sender').replace(mail.html)
      });
    }).then(function() {
      currentMail.status = 'finished';
      return currentMail.save();
    }).then(function(mail) {
      return mail.getReplyTo();
    }).then(function(mail) {
      var message;
      if (!mail) {
        return;
      }
      mail.status = "finished";
      message = {
        title: "任务完成",
        html: "<p>任务" + mail.title + "已经完成了</p>",
        text: "任务" + mail.tile + "已经完成了",
        receivers: [mail.dispatcherId, mail.consumerId, mail.auditorId]
      };
      return Promise.all([mail.save(), mail.addTags([TAG_FINISHED]), mail.removeTags([TAG_HANDLED]), global.myUtil.message.send(message)]);
    })["catch"](global.myError.NoTask, function() {
      return Promise.delay(2000);
    })["catch"](function(err) {
      var message;
      console.log(err);
      if (currentMail) {
        currentMail.status = "failed";
        currentMail.reason += (new Date()) + "\n" + err.message + "\n";
        currentMail.save();
        message = {
          title: "任务失败",
          html: "<p>你发送的标题为" + mail.tile + "的邮件失败了</p>",
          text: "你发送的标题为" + mail.tile + "的邮件失败了",
          receivers: [currentMail.consumerId]
        };
        return global.myUtil.message.send(message);
      }
    });
  };

  module.exports = function(config) {
    var transporter;
    transporter = mailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: true,
      auth: {
        user: config.auth.mailaddr,
        pass: config.auth.password
      }
    });
    global.transporter = Promise.promisifyAll(transporter, {
      suffix: 'Promised'
    });
    return promiseWhile(work);
  };

}).call(this);

//# sourceMappingURL=sendmaild.js.map

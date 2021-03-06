var path = require('path');

var nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');
//var emailTemplates = require('email-templates');

var templatesDir =  path.resolve(sails.config.appPath, "views/emailTemplates");

module.exports = {
    sendEmail: function (options, data, callback) {
        //emailTemplates(templatesDir, function (err, template) {
        //    if (err || !options.template) {
        //        callback(true, err);
        //    } else {
                // create transporter object using SMTP transport
                var transporter = nodemailer.createTransport();

                // fill and send template from options with data parameter
                //template(options.template, data, function (err, html, text) {
                //    if (err) {
                //        callback(true, err);
                //    } else {
                        transporter.sendMail({
                            from: options.from || 'DonnaApp <donna@gmail.com>',
                            to: options.to || 'nebojsa.stojanovic0@gmail.com', // comma separated if multiple...  todo change default to
                            subject: options.subject || "DonnaApp backend message",
                            html: '<p>' + data.link + '</p>',
                            //generateTextFromHTML: true,
                            attachments: options.attachments || null
                        }, function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(false, "email sent!");
                            }
                        });
                //    }
                //});
            }
    //    });
    //}
};
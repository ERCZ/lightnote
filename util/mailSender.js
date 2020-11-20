let mailer = require('nodemailer');
let systemConfig = require('../config');

let transport = mailer.createTransport(systemConfig.mailSender);

module.exports = async function (options) {
    let obj = {
        from: systemConfig.mailSender.auth.user
    };
    options = Object.assign(options, obj);
    try {
        let msg = await transport.sendMail(options);
        return {
            code: 0,
            msg
        }
    } catch (error) {
        return {
            code: -1
        }
    }
}

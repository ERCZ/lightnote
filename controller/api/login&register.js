const jwt = require('jsonwebtoken');
let crypto = require('crypto');
const systemConfig = require('../../config');
const mailSender = require('../../util/mailSender');

module.exports = {
    basePath: 'api',
    controllers: [
        {
            path: 'login/',
            method: 'post',
            middleWare: [async ctx => {
                let { email, password } = ctx.request.body;
                let hash = crypto.createHash('sha256');
                hash.update(password);
                password = hash.digest('hex');
                let user = await ctx.DB.findUserByEmail(email);
                if (!user) {
                    ctx.body = {
                        code: -1,
                        message: '该用户不存在'
                    };
                    return;
                } else if (user.password !== password) {
                    ctx.body = {
                        code: -1,
                        message: '密码不正确'
                    };
                    return;
                } else {
                    let token = jwt.sign({ userid: user.userid }, systemConfig.auth.secret, { expiresIn: systemConfig.auth.expires });
                    ctx.cookies.set('token', token, { expires: new Date(Date.now() + systemConfig.auth.cookieExpires) });
                    ctx.body = {
                        code: 0,
                        message: '登录成功',
                        token
                    };
                };
            }]
        },
        {
            path: 'register/',
            method: 'post',
            middleWare: [async ctx => {
                let { username, email, password, authcode } = ctx.request.body;
                let hash = crypto.createHash('sha256');
                hash.update(password);
                password = hash.digest('hex');
                let user = await ctx.DB.findUserByEmail(email);
                if (user) {
                    ctx.body = {
                        code: -1,
                        message: '该邮箱已被注册'
                    };
                } else {
                    let _authcode = await ctx.CacheDB.hgetall(`ac-${email}`);
                    _authcode && (_authcode = _authcode.authcode);
                    if (parseInt(authcode) !== parseInt(_authcode)) {
                        ctx.body = {
                            code: -1,
                            message: '验证码错误'
                        };
                        return;
                    } else {
                        await ctx.CacheDB.del(`ac-${email}`);
                        user = await ctx.DB.insertUser({
                            username,
                            password,
                            email
                        });
                        let token = jwt.sign({ userid: user.userid }, systemConfig.auth.secret, { expiresIn: systemConfig.auth.expires });
                        ctx.cookies.set('token', token, { expires: new Date(Date.now() + systemConfig.auth.cookieExpires) });
                        ctx.body = {
                            code: 0,
                            message: '注册成功',
                            token
                        };
                    };
                };
            }]
        },
        {
            path: 'authcode/',
            method: 'post',
            middleWare: [async ctx => {
                let email = ctx.request.body.email;
                let authcode = Math.floor(100000 + Math.random() * 900000);
                await ctx.CacheDB.hmset(`ac-${email}`, 'authcode', authcode, 'exp', Date.now() + 15 * 60 * 1000);
                let options = {
                    to: email,
                    subject: '验证码',
                    html: `<h1>您好，您本次的验证码为${authcode}，有效期15分钟，请妥善保管，勿告诉他人。</h1>`,
                };
                let i = 3;
                for (; i > 0; i--) {
                    let result = await mailSender(options);
                    if (result.code === 0) { break };
                };
                if (i <= 0) {
                    ctx.body = { code: -1, message: '验证码发送失败，请检查邮箱地址是否正确。' };
                } else {
                    ctx.body = { code: 0, message: '验证码发送成功，请在邮件中查收。' };
                };
            }]
        },
        {
            path: 'forget/',
            method: 'post',
            middleWare: [async ctx => {
                let { email, authcode, newpassword } = ctx.request.body;
                let hash = crypto.createHash('sha256');
                hash.update(newpassword);
                newpassword = hash.digest('hex');
                let user = await ctx.DB.findUserByEmail(email);
                if (!user) {
                    ctx.body = {
                        code: -1,
                        message: '该邮箱尚未注册'
                    };
                    return;
                };
                let _authcode = await ctx.CacheDB.hgetall(`ac-${email}`);
                _authcode && (_authcode = _authcode.authcode);
                if (parseInt(authcode) !== parseInt(_authcode)) {
                    ctx.body = {
                        code: -1,
                        message: '验证码错误'
                    };
                    return;
                };
                await ctx.CacheDB.del(`ac-${email}`);
                user = await ctx.DB.updateUser(user.userid, { password: newpassword });
                ctx.body = {
                    code: 0,
                    message: '密码修改成功'
                };
            }]
        }
    ]
}
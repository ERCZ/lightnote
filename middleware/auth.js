const jwt = require('jsonwebtoken');
const systemConfig = require('../config');

function tokenParser(token) {
    var logined = false;
    let { userid, exp } = jwt.verify(token, systemConfig.auth.secret);
    if (Math.ceil(Date.now() / 1000) < exp) {
        logined = true;
    };
    return {
        userid,
        logined
    };
}

module.exports = async function (ctx, next) {
    let authInfo = {};
    let token = ctx.request.get('Authorization');
    if (token) {
        authInfo = tokenParser(token);
        if (authInfo.logined) {
            let user = await ctx.DB.findUserById(authInfo.userid);
            authInfo.safe = true;
            authInfo.user = user;
        };
    } else {
        token = ctx.cookies.get('token');
        if (token) {
            authInfo = tokenParser(token);
            if (authInfo.logined) {
                let user = await ctx.DB.findUserById(authInfo.userid);
                authInfo.safe = false;
                authInfo.user = user;
            };
        } else {
            authInfo = { logined: false };
        };
    };
    if ((authInfo.logined === false || authInfo.safe === false || authInfo.user.level !== 0) && ctx.path.startsWith('/api/')) {
        let disallow = ['/api/note/', '/api/user/', '/api/archive/', '/api/tag/'];
        for (const item of disallow) {
            if (ctx.path.startsWith(item)) {
                ctx.body = { code: 403, message: '403,Forbidden!' };
                return;
            };
        };
    };
    if ((authInfo.logined === false || authInfo.safe === false || ctx.method === 'get') && ctx.path.startsWith('/api/comment/')) {
        ctx.body = { code: 403, message: '403,Forbidden!' };
        return;
    };
    if ((authInfo.logined === false || authInfo.user.level !== 0) && ctx.path.startsWith('/background/')) {
        ctx.dataTemplate.data = { code: 403, message: 'Forbidden' };
        await ctx.render('error', ctx.dataTemplate);
    };
    ctx.authInfo = authInfo;
    ctx.dataTemplate.authInfo = authInfo;
    await next();
}
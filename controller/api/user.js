const crypto = require('crypto');

module.exports = {
    basePath: 'api/user',
    controllers: [
        {
            path: '/',
            method: 'get',
            middleWare: [async ctx => {
                let params = ctx.util.getParamsFromQuery();
                let users = await ctx.DB.findUsers(params);
                ctx.body = users;
            }]
        },
        {
            path: ':id',
            method: 'get',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let user = await ctx.DB.findUserById(id);
                ctx.body = user;
            }]
        },
        {
            path: '',
            method: 'post',
            middleWare: [async ctx => {
                let hash = crypto.createHash('sha256');
                hash.update(ctx.request.body.password);
                let user = await ctx.DB.insertUser({
                    username: ctx.request.body.username,
                    password: hash.digest('hex'),
                    email: ctx.request.body.email
                });
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: user
                };
            }]
        },
        {
            path: ':id',
            method: 'put',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let hash = crypto.createHash('sha256');
                hash.update(ctx.request.body.password);
                ctx.request.body.password = hash.digest('hex');
                let user = await ctx.DB.updateUser(id, ctx.request.body);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: user
                };
            }]
        },
        {
            path: ':id',
            method: 'delete',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let user = await ctx.DB.deleteUser(id);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: user
                };
            }]
        }
    ]
}
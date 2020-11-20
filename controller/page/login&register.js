// 登录及注册页面路由及中间件
module.exports = {
    basePath: '/',
    controllers: [
        {
            path: 'login/',
            method: 'get',
            middleWare: async ctx => {
                await ctx.render('login', ctx.dataTemplate);
            }
        },
        {
            path: 'register/',
            method: 'get',
            middleWare: async ctx => {
                await ctx.render('register', ctx.dataTemplate);
            }
        },
        {
            path: 'forget/',
            method: 'get',
            middleWare: async ctx => {
                await ctx.render('forget', ctx.dataTemplate);
            }
        }
    ]
}
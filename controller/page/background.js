// 主页路由及中间件
module.exports = {
    basePath: 'background',
    controllers: [
        {
            path: '',
            method: 'get',
            middleWare: async ctx => {
                await ctx.render('background', ctx.dataTemplate);
            }
        }
    ]
}
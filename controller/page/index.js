// 主页路由及中间件
module.exports = {
    basePath: '/',
    controllers: [
        {
            path: '/',
            method: 'get',
            middleWare: async ctx => {
                let page = (ctx.query.page && parseInt(ctx.query.page)) || 1;
                let notes = await ctx.DB.findNotes({
                    offset: (page-1)*10,
                    limit: 10,
                    orderBy: 'updatedAt',
                    desc: true,
                    public: true
                });
                let noteCount = await ctx.DB.getCountOfNote(true);
                let pageCount = Math.ceil(noteCount / 10);
                notes = await ctx.util.getAllInfoOfNotes(notes);
                ctx.dataTemplate.data.notes = notes;
                ctx.dataTemplate.ext.type = 'index';
                ctx.dataTemplate.ext.pageCount = pageCount;
                ctx.dataTemplate.ext.curPage = page;
                await ctx.render('index', ctx.dataTemplate);
            }
        }
    ]
}
// 文章标签页路由及中间件
module.exports = {
    basePath: 'tag',
    controllers: [
        {
            path: '',
            method: 'get',
            middleWare: async ctx => {
                ctx.dataTemplate.data.tags = await ctx.DB.findTags();
                await ctx.render('tag', ctx.dataTemplate);
            }
        },
        {
            path: ':name',
            method: 'get',
            middleWare: async ctx => {
                let page = (ctx.query.page && parseInt(ctx.query.page)) || 1;
                let tag = await ctx.DB.findTagByName(ctx.params.name);
                let result = await ctx.util.getAllInfoOfTags([tag], {
                    offset: (page-1)*10,
                    limit: 10,
                    orderBy: 'updatedAt',
                    desc: true,
                    public: true
                });
                let noteCount = await ctx.DB.getCountOfNoteByTag(tag.tagid, true);
                let pageCount = Math.ceil(noteCount / 10);
                ctx.dataTemplate.data = result[0];
                ctx.dataTemplate.ext.type = 'tag';
                ctx.dataTemplate.ext.pageCount = pageCount;
                ctx.dataTemplate.ext.curPage = page;
                await ctx.render('index', ctx.dataTemplate);
            }
        }
    ]
}
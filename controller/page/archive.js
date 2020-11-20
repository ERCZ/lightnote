// 文章详情页路由及中间件
module.exports = {
    basePath: 'archive',
    controllers: [
        {
            path: '',
            method: 'get',
            middleWare: async ctx => {
                let page = (ctx.query.page && parseInt(ctx.query.page)) || 1;
                ctx.dataTemplate.archives = await ctx.DB.findArchives({
                    offset: (page-1)*10,
                    limit: 10
                });
                let archiveCount = await ctx.DB.getCountOfArchive();
                let pageCount = Math.ceil(archiveCount / 10);
                ctx.dataTemplate.ext.pageCount = pageCount;
                ctx.dataTemplate.ext.curPage = page;
                await ctx.render('archive', ctx.dataTemplate);
            }
        },
        {
            path: ':name',
            method: 'get',
            middleWare: async ctx => {
                let page = (ctx.query.page && parseInt(ctx.query.page)) || 1;
                let archive = await ctx.DB.findArchiveByName(ctx.params.name);
                let result = await ctx.util.getAllInfoOfArchives([archive], {
                    offset: (page-1)*10,
                    limit: 10,
                    orderBy: 'updatedAt',
                    desc: true,
                    public: true
                });
                let noteCount = await ctx.DB.getCountOfNoteByArchive(archive.archiveid, true);
                let pageCount = Math.ceil(noteCount / 10);
                ctx.dataTemplate.data = result[0];
                ctx.dataTemplate.ext.type = 'archive';
                ctx.dataTemplate.ext.pageCount = pageCount;
                ctx.dataTemplate.ext.curPage = page;
                await ctx.render('index', ctx.dataTemplate);
            }
        }
    ]
}
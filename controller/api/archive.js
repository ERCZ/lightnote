module.exports = {
    basePath: 'api/archive',
    controllers: [
        {
            path: '/',
            method: 'get',
            middleWare: [async ctx => {
                let params = ctx.util.getParamsFromQuery();
                let archives = await ctx.DB.findArchives(params);
                archives = await ctx.util.getAllInfoOfArchives(archives);
                ctx.body = archives;
            }]
        },
        {
            path: ':id',
            method: 'get',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let archive = await ctx.DB.findArchiveById(id);
                archive = await ctx.util.getAllInfoOfArchives([archive]);
                ctx.body = archive[0];
            }]
        },
        {
            path: '',
            method: 'post',
            middleWare: [async ctx => {
                let archive = await ctx.DB.insertArchive({
                    name: ctx.request.body.name,
                    desc: ctx.request.body.desc
                });
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: archive
                };
            }]
        },
        {
            path: ':id',
            method: 'put',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let archive = await ctx.DB.updateArchive(id, ctx.request.body);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: archive
                };
            }]
        },
        {
            path: ':id',
            method: 'delete',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let archive = await ctx.DB.deleteArchive(id);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: archive
                };
            }]
        }
    ]
}
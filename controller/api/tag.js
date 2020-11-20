module.exports = {
    basePath: 'api/tag',
    controllers: [
        {
            path: '/',
            method: 'get',
            middleWare: [async ctx => {
                let params = ctx.util.getParamsFromQuery();
                let tags = await ctx.DB.findTags(params);
                tags = await ctx.util.getAllInfoOfTags(tags);
                ctx.body = tags;
            }]
        },
        {
            path: ':id',
            method: 'get',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let tag = await ctx.DB.findTagById(id);
                tag = await ctx.util.getAllInfoOfTags([tag]);
                ctx.body = tag[0];
            }]
        },
        {
            path: '',
            method: 'post',
            middleWare: [async ctx => {
                let tag = await ctx.DB.insertTag({
                    name: ctx.request.body.name
                });
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: tag
                };
            }]
        },
        {
            path: ':id',
            method: 'put',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let tag = await ctx.DB.updateTag(id, ctx.request.body);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: tag
                };
            }]
        },
        {
            path: ':id',
            method: 'delete',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let tag = await ctx.DB.deleteTag(id);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: tag
                };
            }]
        }
    ]
}
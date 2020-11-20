module.exports = {
    basePath: 'api/comment',
    controllers: [
        {
            path: '/',
            method: 'get',
            middleWare: [async ctx => {
                let params = ctx.util.getParamsFromQuery();
                let comments = await ctx.DB.findComments(params);
                comments = await ctx.util.getAllInfoOfComments(comments);
                ctx.body = comments;
            }]
        },
        {
            path: ':id',
            method: 'get',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let comment = await ctx.DB.findCommentById(id);
                comment = await ctx.util.getAllInfoOfComments([comment]);
                ctx.body = comment[0];
            }]
        },
        {
            path: '',
            method: 'post',
            middleWare: [async ctx => {
                let body = ctx.request.body;
                let comment = await ctx.DB.insertComment({
                    from: ctx.authInfo.user.userid,
                    to: (body.to!=='' && parseInt(body.to)) || null,
                    note: parseInt(body.noteid),
                    content: body.content,
                    createdAt: new Date()
                });
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: comment
                };
            }]
        },
        {
            path: ':id',
            method: 'put',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let comment = await ctx.DB.updateComment(id, ctx.request.body);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: comment
                };
            }]
        },
        {
            path: ':id',
            method: 'delete',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let comment = await ctx.DB.deleteComment(id);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: comment
                };
            }]
        }
    ]
}
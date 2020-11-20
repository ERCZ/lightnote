const fs = require('fs');

module.exports = {
    basePath: 'api/note',
    controllers: [
        {
            path: '/',
            method: 'get',
            middleWare: [async ctx => {
                let params = ctx.util.getParamsFromQuery();
                let notes = await ctx.DB.findNotes(params);
                notes = await ctx.util.getAllInfoOfNotes(notes);
                ctx.body = notes;
            }]
        },
        {
            path: ':id',
            method: 'get',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let note = await ctx.DB.findNoteById(id, true);
                note = await ctx.util.getAllInfoOfNotes([note]);
                ctx.body = note[0];
            }]
        },
        {
            path: '',
            method: 'post',
            middleWare: [async ctx => {
                let body = ctx.request.body;
                let file = ctx.request.files.markdown;
                let date = new Date();
                let note = await ctx.DB.insertNote({
                    title: body.title,
                    friendlyName: body.friendlyName,
                    desc: body.desc,
                    public: parseInt(body.public),
                    createdAt: date,
                    updatedAt: date
                });
                if (body.archive) {
                    if (!body.archive instanceof Array) body.archive = [body.archive];
                    for await (const archive of body.archive) {
                        await ctx.DB.insertNA(note.noteid, parseInt(archive));
                    };
                };
                if (body.tag) {
                    if (!body.tag instanceof Array) body.tag = [body.tag];
                    for await (const tag of body.tag) {
                        await ctx.DB.insertNT(note.noteid, parseInt(tag));
                    };
                };
                let rs = fs.createReadStream(file.path);
                let ws = fs.createWriteStream(`./note/${note.friendlyName}.md`);
                rs.pipe(ws);
                fs.unlinkSync(file.path);
                note = await ctx.util.getAllInfoOfNotes([note]);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: note[0]
                };
            }]
        },
        {
            path: ':id',
            method: 'put',
            middleWare: [async ctx => {
                let body = ctx.request.body;
                let file = ctx.request.files.markdown;
                let date = new Date();
                let preNote = await ctx.DB.findNoteById(parseInt(body.noteid));
                await ctx.CacheDB.del(`note-${preNote.friendlyName}`);
                let note = await ctx.DB.updateNote(parseInt(body.noteid), {
                    title: body.title,
                    friendlyName: body.friendlyName,
                    desc: body.desc,
                    public: parseInt(body.public),
                    updatedAt: date
                });
                await ctx.DB.deleteNA(parseInt(body.noteid));
                if (body.archive) {
                    if (!body.archive instanceof Array) body.archive = [body.archive];
                    for await (const archive of body.archive) {
                        await ctx.DB.insertNA(note.noteid, parseInt(archive));
                    };
                };
                await ctx.DB.deleteNT(parseInt(body.noteid));
                if (body.tag) {
                    if (!body.tag instanceof Array) body.tag = [body.tag];
                    for await (const tag of body.tag) {
                        await ctx.DB.insertNT(note.noteid, parseInt(tag));
                    };
                };
                if (file.name !== '') {
                    fs.unlinkSync(`./note/${preNote.friendlyName}.md`)
                    let rs = fs.createReadStream(file.path);
                    let ws = fs.createWriteStream(`./note/${note.friendlyName}.md`);
                    rs.pipe(ws);
                };
                fs.unlinkSync(file.path);
                note = await ctx.util.getAllInfoOfNotes([note]);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: note[0]
                };
            }]
        },
        {
            path: ':id',
            method: 'delete',
            middleWare: [async ctx => {
                let id = parseInt(ctx.params.id);
                let note = await ctx.DB.deleteNote(id);
                fs.unlinkSync(`./note/${note.friendlyName}.md`);
                await ctx.CacheDB.del(`note-${note.friendlyName}`);
                ctx.body = {
                    code: 0,
                    message: 'success',
                    data: note
                };
            }]
        }
    ]
}
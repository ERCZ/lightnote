const fs = require('fs');
const MarkdownIt = require('markdown-it');

// 文章详情页路由及中间件
module.exports = {
    basePath: 'note',
    controllers: [
        {
            path: ':friendlyName',
            method: 'get',
            middleWare: async ctx => {
                let note = await ctx.DB.findNoteByFriendlyName(ctx.params.friendlyName, true);
                note = await ctx.DB.updateNote(note.noteid, { viewCount: ++note.viewCount });
                note = await ctx.util.getAllInfoOfNotes([note]);
                note = note[0];
                function toStringOfTag() {
                    return this.name;
                };
                note.tags.forEach(tag => {
                    tag.toString = toStringOfTag;
                });
                let content = await ctx.CacheDB.get(`note-${note.friendlyName}`);
                if (content === null) {
                    let md = new MarkdownIt();
                    content = fs.readFileSync(`./note/${note.friendlyName}.md`, { encoding: 'utf8' });
                    content = md.render(content);
                    await ctx.CacheDB.set(`note-${note.friendlyName}`, content);
                };
                note.content = content;
                ctx.dataTemplate.data.note = note;
                await ctx.render('note', ctx.dataTemplate);
            }
        }
    ]
}
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const { theme } = require('../../config');
const { about } = require(`../../theme/${theme}/config`);

// 文章详情页路由及中间件
module.exports = {
    basePath: 'about',
    controllers: [
        {
            path: '',
            method: 'get',
            middleWare: async ctx => {
                let md = new MarkdownIt();
                let content = fs.readFileSync(`./note/${about.aboutContent}.md`, { encoding: 'utf8' });
                ctx.dataTemplate.aboutContent = md.render(content);
                await ctx.render('about', ctx.dataTemplate);
            }
        }
    ]
}
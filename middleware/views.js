const path = require('path');
const promisify = require('util').promisify;
const cons = require('consolidate');

module.exports = function (dist, options) {
    let engine = options.engine;
    let extension = options.extension || 'html';
    let render = promisify(cons[engine]).bind(cons);
    return async (ctx, next) => {
        ctx.render2 = async (template, data) => {
            let html = await render(path.resolve(dist, `${template}.${extension}`), data);
            ctx.CacheDB.set(ctx.url, html);
            ctx.body = html;
        };
        await next();
    };
}
const Koa = require('koa');
const path = require('path');
const views = require('koa-views');
const static = require('koa-static');
const compress = require('koa-compress');
const router = require('./router');
const body = require('koa-body');
const htmlMinifier = require('koa-html-minifier');
const log4js = require('log4js');
const DB = require('./database/db');
const CacheDB = require('./database/cache');
const auth = require('./middleware/auth');
const systemConfig = require('./config');
const mount = require('./middleware/mount');

const app = new Koa();
app.context.DB = DB;
app.context.CacheDB = CacheDB;

// 日志配置
log4js.configure({
    appenders: {
        errorlog: { type: 'file', filename: './log/errors.log', maxLogSize: 1024*1024*2, backups: 5, compress: true }
    },
    categories: {
        default: { appenders: ['errorlog'], level: 'error' }
    }
});
const logger = log4js.getLogger("errorlog");

// 响应压缩
app.use(compress({
    filter(content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    gzip: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    deflate: {
        flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    br: false
}));
app.use(htmlMinifier({
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    minifyCSS: true,
    minifyJS: true
}));
// 请求体解析
app.use(body(systemConfig.bodyParser));
// 向ctx上挂载模板引擎数据模板及util方法
app.use(mount);
// 用户认证
app.use(auth);
// 模板引擎配置
app.use(views(path.resolve(__dirname, `theme/${systemConfig.theme}/`), systemConfig.view));
// 路由配置
app.use(router.routes()).use(router.allowedMethods());
// 静态资源目录配置
app.use(static(path.resolve(__dirname, 'static'), systemConfig.static));
app.use(static(path.resolve(__dirname, `theme/${systemConfig.theme}/static`), systemConfig.static));
// 404 Not Found
app.use(async ctx => {
    ctx.dataTemplate.data = { code: 404, message: 'Not Found!' };
    await ctx.render('error.njk', ctx.dataTemplate);
});
// 错误处理
app.on('error', async (err, ctx) => {
    let error = {
        message: err.message,
        url: ctx.url || '',
        method: ctx.method || '',
        body: ctx.request.body || {},
        files: ctx.request.files || {}
    };
    logger.error(JSON.stringify(error));
    ctx.dataTemplate.data = { code: 500, message: 'Internal server error' };
    await ctx.render('error', ctx.dataTemplate);
});
// 过期验证码清理
setInterval(async () => {
    let keys = await CacheDB.keys('ac-*');
    for await (const key of keys) {
        let authcode = await CacheDB.hgetall(key);
        if (parseInt(authcode.exp) < Date.now()) {
            await CacheDB.del(key);
        };
    };
}, 7 * 60 * 1000);

app.listen(systemConfig.serverPort, () => {
    console.log(`lightnote is running at http://localhost:${systemConfig.serverPort}`);
});
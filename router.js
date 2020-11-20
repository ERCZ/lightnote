const _path = require('path');
const Router = require('koa-router');
const walkFolder = require('./util/walkFolder');

const router = new Router({
    prefix: '/'
});

// 读取controller目录中的js文件构造router
walkFolder('./controller', filePath => {
    if (filePath.endsWith('.js') && !_path.basename(filePath).startsWith('_')) {
        let { basePath, controllers } = require(filePath);
        controllers.forEach(controller => {
            let path = mergePath(basePath || '', controller.path || '');
            let method = controller.method.toLowerCase();
            if (controller.middleWare instanceof Function) {
                controller.middleWare = [controller.middleWare];
            };
            router[method](path, ...controller.middleWare);
        })
    }
});

// 合并路径
function mergePath() {
    let path = '';
    for (let i = 0; i < arguments.length; i++) {
        path += `/${arguments[i]}`;
    }
    path = path.replace(/\/+/g, '/');
    return path.substring(1);
}

module.exports = router;
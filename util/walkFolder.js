const fs = require('fs');
const path = require('path');

module.exports = function walkFolder(folder, cb) {
    let files = fs.readdirSync(folder);
    files.forEach(file => {
        let filePath = path.resolve(folder, file);
        if (fs.statSync(filePath).isDirectory()) {
            arguments.callee(filePath, cb);
        } else {
            cb(filePath);
        }
    });
}
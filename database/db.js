const mysql = require('mysql2');
const walkFolder = require('../util/walkFolder');
const SystemConfig = require('../config');

class Database{
    constructor(config) {
        this._pool = mysql.createPool(config);
        this.pool = this._pool.promise();
    }

    async query(sql, values) {
        let [result, field] = await this.pool.query(sql, values || []);
        return result;
    }

    async end() {
        await this.pool.end();
    }

    escape(str) {
        return this._pool.escape(str);
    }

    escapeId(str) {
        return this._pool.escapeId(str);
    }

    async findMixin(sql, params) {
        params.orderBy && (sql += ` order by ${this.escapeId(params.orderBy)}`);
        params.orderBy && (sql += params.desc ? ' desc' : ' asc');
        params.limit && (sql += ` limit ${this.escape(params.limit)}`);
        params.offset && (sql += ` offset ${this.escape(params.offset)}`);
        return await this.query(sql);
    }

    genSetStr(obj) {
        let array = [];
        Object.keys(obj).forEach(key => {
            if (obj.hasOwnProperty(key)) {
                array.push(`${this.escapeId(key)}=${this.escape(obj[key])}`);
            }
        });
        return array.join(',');
    }
}

walkFolder('./database/queryFunc', (filePath) => {
    if (filePath.endsWith('.js')) {
        let obj = require(filePath);
        Object.keys(obj).forEach(name => {
            if (obj.hasOwnProperty(name)) {
                Database.prototype[name] = obj[name];
            }
        })
    }
});

module.exports = new Database(SystemConfig.mysql);
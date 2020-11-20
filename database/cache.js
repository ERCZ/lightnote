const redis = require('redis');
const promisify = require('util').promisify;
const systemConfig = require('../config');

class CacheDB {
    constructor(config) {
        this._redis = redis.createClient(config);
        this.set = promisify(this._redis.set).bind(this._redis);
        this.get = promisify(this._redis.get).bind(this._redis);
        this.hmset = promisify(this._redis.hmset).bind(this._redis);
        this.hgetall = promisify(this._redis.hgetall).bind(this._redis);
        this.quit = promisify(this._redis.quit).bind(this._redis);
        this.del = promisify(this._redis.del).bind(this._redis);
        this.keys = promisify(this._redis.keys).bind(this._redis);
        this.exists = (this._redis.exists).bind(this._redis);
    }
}

module.exports = new CacheDB(systemConfig.redis);
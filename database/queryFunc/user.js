module.exports = {
    async findUserById(id) {
        let sql = 'select * from user where userid = ?';
        let result = await this.query(sql, id);
        return result[0];
    },

    async findUserByEmail(email) {
        let sql = 'select * from user where email = ?';
        let result = await this.query(sql, email);
        return result[0];
    },

    async findUserInfoById(id) {
        let sql = 'select * from userinfo where userid = ?';
        let result = await this.query(sql, id);
        return result[0];
    },

    async findUsers(params) {
        let sql = 'select * from user';
        return await this.findMixin(sql, params || {});
    },

    async getCountOfUser() {
        let sql = 'select count(1) as userCount from user';
        let result = await this.query(sql);
        return result[0].userCount;
    },

    async insertUser(values) {
        let sql = 'insert into user(username,password,email) values (?,?,?)';
        let result = await this.query(sql, [values.username, values.password, values.email]);
        return await this.findUserById(result.insertId);
    },

    async deleteUser(id) {
        let sql = 'delete from user where userid = ?';
        let result = await this.findUserById(id);
        await this.query(sql, id);
        return result;
    },

    async updateUser(id, values) {
        let sql = `update user set ${this.genSetStr(values)} where userid = ?`;
        await this.query(sql, id);
        return await this.findUserById(id);
    }
}
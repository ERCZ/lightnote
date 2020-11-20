module.exports = {
    async findComments(params) {
        let sql = 'select * from comment';
        return await this.findMixin(sql, params || {});
    },

    async findCommentById(id){
        let sql = 'select * from comment where commentid = ?';
        let result = await this.query(sql, id);
        return result[0];
    },

    async findCommentsByNoteId(id, params) {
        let sql = `select * from comment where comment.note = ${this.escape(id)}`;
        return await this.findMixin(sql, params || {});
    },

    async getCountOfComment() {
        let sql = 'select count(1) as commentCount from comment';
        let result = await this.query(sql);
        return result[0].commentCount;
    },

    async insertComment(values) {
        let sql = 'insert into comment(`from`,`to`,`note`,`content`,`createdAt`) values (?,?,?,?,?)';
        let result = await this.query(sql, [values.from, values.to, values.note, values.content, values.createdAt]);
        return await this.findCommentById(result.insertId);
    },

    async deleteComment(id) {
        let sql = 'delete from comment where commentid = ?';
        let result = await this.findCommentById(id);
        await this.query(sql, id);
        return result;
    },

    async updateComment(id, values) {
        let sql = `update comment set ${this.genSetStr(values)} where commentid = ?`;
        await this.query(sql, id);
        return await this.findCommentById(id);
    }
}
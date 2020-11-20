module.exports = {
    async findTagById(id) {
        let sql = 'select * from tag where `tagid` = ?';
        let result = await this.query(sql, id);
        return result[0];
    },

    async findTagByName(name) {
        let sql = 'select * from tag where `name` = ?';
        let result = await this.query(sql, name);
        return result[0];
    },

    async findTags(params) {
        let sql = 'select * from tag';
        return await this.findMixin(sql, params || {});
    },

    async findTagsByNoteId(id, params) {
        let sql = `select * from note_tag inner join tag where tag.tagid = note_tag.tagid and note_tag.noteid = ${this.escape(id)}`;
        return await this.findMixin(sql, params || {});
    },

    async getCountOfTag() {
        let sql = 'select count(1) as tagCount from tag';
        let result = await this.query(sql);
        return result[0].tagCount;
    },

    async insertTag(values) {
        let sql = 'insert into tag(name) values (?)';
        let result = await this.query(sql, [values.name]);
        return await this.findTagById(result.insertId);
    },

    async deleteTag(id) {
        let sql = 'delete from tag where tagid = ?';
        let result = await this.findTagById(id);
        await this.query(sql, id);
        return result;
    },

    async updateTag(id, values) {
        let sql = `update tag set ${this.genSetStr(values)} where tagid = ?`;
        await this.query(sql, id);
        return await this.findTagById(id);
    }
}
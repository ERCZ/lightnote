module.exports = {
    async findArchiveById(id) {
        let sql = 'select * from archive where `archiveid` = ?';
        let result = await this.query(sql, id);
        return result[0];
    },

    async findArchiveByName(name) {
        let sql = 'select * from archive where `name` = ?';
        let result = await this.query(sql, name);
        return result[0];
    },

    async findArchives(params) {
        let sql = 'select * from archive';
        return await this.findMixin(sql, params || {});
    },

    async findArchivesByNoteId(id, params) {
        let sql = `select * from note_archive inner join archive where archive.archiveid = note_archive.archiveid and note_archive.noteid = ${this.escape(id)}`;
        return await this.findMixin(sql, params || {});
    },

    async getCountOfArchive() {
        let sql = 'select count(1) as archiveCount from archive';
        let result = await this.query(sql);
        return result[0].archiveCount;
    },

    async insertArchive(values) {
        let sql = 'insert into archive(`name`, `desc`) values (?,?)';
        let result = await this.query(sql, [values.name, values.desc]);
        return await this.findArchiveById(result.insertId);
    },

    async deleteArchive(id) {
        let sql = 'delete from archive where archiveid = ?';
        let result = await this.findArchiveById(id);
        await this.query(sql, id);
        return result;
    },

    async updateArchive(id, values) {
        let sql = `update archive set ${this.genSetStr(values)} where archiveid = ?`;
        await this.query(sql, id);
        return await this.findArchiveById(id);
    }
}
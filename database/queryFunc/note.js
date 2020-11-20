module.exports = {
    async findNoteById(id, public) {
        let sql = 'select * from note where noteid = ?';
        public && (sql += ' and public = 1');
        let result = await this.query(sql, id);
        return result[0];
    },

    async findNoteByFriendlyName(name, public) {
        let sql = 'select * from note where friendlyName = ?';
        public && (sql += ' and public = 1');
        let result = await this.query(sql, name);
        return result[0];
    },

    async findNotes(params) {
        let sql = 'select * from note';
        params.public && (sql += ' where public = 1');
        return await this.findMixin(sql, params || {});
    },
    
    async findNotesByArchiveId(id, params) {
        let sql = `select * from note_archive inner join note where note.noteid = note_archive.noteid and note_archive.archiveid = ${this.escape(id)}`;
        params.public && (sql += ' and note.public = 1');
        return await this.findMixin(sql, params || {});
    },

    async findNotesByTagId(id, params) {
        let sql = `select * from note_tag inner join note where note.noteid = note_tag.noteid and note_tag.tagid = ${this.escape(id)}`;
        params.public && (sql += ' and note.public = 1');
        return await this.findMixin(sql, params || {});
    },

    async getCountOfNote(public) {
        let sql = 'select count(1) as noteCount from note';
        public && (sql += ' where public = 1');
        let result = await this.query(sql);
        return result[0].noteCount;
    },

    async getCountOfNoteByTag(tagid, public) {
        let sql = 'select count(1) as noteCount from note inner join note_tag where note.noteid = note_tag.noteid and note_tag.tagid = ?';
        public && (sql += ' and note.public = 1');
        let result = await this.query(sql, tagid);
        return result[0].noteCount;
    },

    async getCountOfNoteByArchive(archiveid, public) {
        let sql = 'select count(1) as noteCount from note inner join note_archive where note.noteid = note_archive.noteid and note_archive.archiveid = ?';
        public && (sql += ' and note.public = 1');
        let result = await this.query(sql, archiveid);
        return result[0].noteCount;
    },

    async insertNote(values) {
        let sql = 'insert into note(title,`desc`,public,friendlyName,createdAt,updatedAt) values (?,?,?,?,?,?)';
        let result = await this.query(sql, [values.title, values.desc, values.public, values.friendlyName, values.createdAt, values.updatedAt]);
        return await this.findNoteById(result.insertId, false);
    },

    async deleteNote(id) {
        let sql = 'delete from note where noteid = ?';
        let result = await this.findNoteById(id);
        await this.query(sql, id);
        return result;
    },

    async updateNote(id, values) {
        let sql = `update note set ${this.genSetStr(values)} where noteid = ?`;
        await this.query(sql, id);
        return await this.findNoteById(id);
    },

    async findTopOfNote(orderBy, desc, limit, public) {
        return await this.findNotes({
            orderBy,
            desc,
            limit,
            public
        });
    }
}
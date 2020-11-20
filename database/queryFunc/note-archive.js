module.exports = {
    async insertNA(noteid, archiveid) {
        let sql = 'insert into note_archive(noteid,archiveid) values (?,?)';
        let result = await this.query(sql, [noteid, archiveid]);
        return result;
    },

    async deleteNA(noteid) {
        let sql = 'delete from note_archive where noteid = ?';
        let result = await this.query(sql, noteid);
        return result;
    }
}
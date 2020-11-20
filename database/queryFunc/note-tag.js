const { getCountOfNote } = require("./note");

module.exports = {
    async insertNT(noteid, tagid) {
        let sql = 'insert into note_tag(noteid,tagid) values (?,?)';
        let result = await this.query(sql, [noteid, tagid]);
        return result;
    },

    async deleteNT(noteid) {
        let sql = 'delete from note_tag where noteid = ?';
        let result = await this.query(sql, noteid);
        return result;
    }
}
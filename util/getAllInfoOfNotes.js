module.exports = async function getAllInfoOfNotes(notes) {
    for await (let note of notes) {
        let tags = await this.DB.findTagsByNoteId(note.noteid);
        let archives = await this.DB.findArchivesByNoteId(note.noteid);
        let comments = await this.DB.findCommentsByNoteId(note.noteid);
        comments = await this.util.getAllInfoOfComments(comments);
        note.tags = tags;
        note.archives = archives;
        note.comments = comments;
    };
    return notes;
}
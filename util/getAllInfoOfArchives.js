module.exports = async function getAllInfoOfArchives(archives, params) {
    for await (let archive of archives) {
        let notes = await this.DB.findNotesByArchiveId(archive.archiveid, params || {});
        notes = await this.util.getAllInfoOfNotes(notes);
        archive.notes = notes;
    };
    return archives;
}
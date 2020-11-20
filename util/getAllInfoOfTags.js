module.exports = async function getAllInfoOfTags(tags, params) {
    for await (let tag of tags) {
        let notes = await this.DB.findNotesByTagId(tag.tagid, params || {});
        notes = await this.util.getAllInfoOfNotes(notes);
        tag.notes = notes;
    };
    return tags;
}
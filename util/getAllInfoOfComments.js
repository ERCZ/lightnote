module.exports = async function (comments) {
    for await (let comment of comments) {
        comment.from ? (comment.from = await this.DB.findUserInfoById(comment.from)) : (comment.from = {});
        comment.to ? (comment.to = await this.DB.findUserInfoById(comment.to)) : (comment.to = {});
        comment.note = await this.DB.findNoteById(comment.note);
    };
    return comments;
}
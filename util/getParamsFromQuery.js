module.exports = function () {
    let params = {};
    this.query.offset && (params.offset = parseInt(this.query.offset));
    this.query.limit && (params.limit = parseInt(this.query.limit));
    this.query.orderby && (params.orderBy = this.query.orderby);
    this.query.desc === 'true' && (params.desc = true);
    return params;
}
const systemConfig = require('../config');
const themeConfig = require(`../theme/${systemConfig.theme}/config`);
const getAllInfoOfTags = require('../util/getAllInfoOfTags');
const getAllInfoOfNotes = require('../util/getAllInfoOfNotes');
const getAllInfoOfArchives = require('../util/getAllInfoOfArchives');
const getParamsFromQuery = require('../util/getParamsFromQuery');
const getAllInfoOfComments = require('../util/getAllInfoOfComments');

module.exports = async (ctx, next) => {
    if (!ctx.path.startsWith('/api/')) {
        let tags = await ctx.DB.findTags({
            limit: 20
        });
        let newNotes = await ctx.DB.findTopOfNote('updatedAt', true, 5, true);
        let hotNotes = await ctx.DB.findTopOfNote('viewCount', true, 5, true);
        ctx.dataTemplate = {
            website: systemConfig.website,
            aside: {
                tags,
                newNotes,
                hotNotes,
            },
            themeConfig,
            data: {},
            ext: {}
        };
    } else {
        ctx.dataTemplate = {
            website: systemConfig.website,
            themeConfig,
            data: {},
            ext: {}
        };
    };
    let util = {
        getAllInfoOfTags: getAllInfoOfTags.bind(ctx),
        getAllInfoOfNotes: getAllInfoOfNotes.bind(ctx),
        getAllInfoOfArchives: getAllInfoOfArchives.bind(ctx),
        getAllInfoOfComments: getAllInfoOfComments.bind(ctx),
        getParamsFromQuery: getParamsFromQuery.bind(ctx)
    };
    ctx.util = util;
    await next();
}
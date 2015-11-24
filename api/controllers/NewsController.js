/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

    /**
     * Create news && upload file
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        News.create(params).then(function (news) {

            return Helper.uploadFile(req, 'news', news);

        }).then(function(item) {
            return res.json(item);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update news && upload file
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();

        News.update(req.params.id, params).then(function (news) {

            return Helper.uploadFile(req, 'news', news[0]);

        }).then(function(item) {
            return res.json(item);
        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * Destroy News
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        News.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * Add comment for News
     * @param req
     * @param res
     */
    addComment: function (req, res) {
        var params = req.params.all();
        params.user = req.token.userId;

        if (!params.news) return res.customBadRequest('Missing parameters.');

        News.findOne(params.news).then(function (news) {
            if (!news) return res.notFound('News with that ID not found');

            CommentNews.create(params).then(function (comment) {
                return res.json(comment);
            })

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};


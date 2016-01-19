/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Like/unlike comment
     * @param req
     * @param res
     */
    like: function (req, res) {
        Social.likeUnlike(req, 'comment').then(function (comment) {
            res.ok(LikeHelper.checkLike(req, comment));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Report/unreport Comment
     * @param req
     * @param res
     */
    report: function (req, res) {
        Social.reportUnreport(req, 'comment').then(function (comment) {
            res.ok(LikeHelper.checkLike(req, comment));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy single comment
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Comment.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};


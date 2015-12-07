/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
module.exports = {

    /**
     * Get dashboard data
     * @param req
     * @param res
     */
    getDashboardData: function (req, res) {
        News.count().then(function (news) {
            var query = [];
            query.push(User.count());
            query.push(Event.count());
            query.push(Media.count());
            query.push(news);

            return query;

        }).spread(function (userNum, eventNum, mediaNum, newsNum) {
            var data = {userNum: userNum, eventNum: eventNum, mediaNum: mediaNum, newsNum: newsNum};
            return res.json(data);

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }
};

module.exports = {

    checkLike: function (req, data) {
        if (data.length) {
            _.each(data, function (item) {
                if (item.likes && item.likes.indexOf(req.token.userId) === -1) {
                    item.liked = false;
                } else {
                    item.liked = true;
                }

                if (item.reports && item.reports.indexOf(req.token.userId) === -1) {
                    item.reported = false;
                } else {
                    item.reported = true;
                }
            });
        } else {
            if (data.likes && data.likes.indexOf(req.token.userId) === -1) {
                data.liked = false;
            } else {
                data.liked = true;
            }

            if (item.reports && item.reports.indexOf(req.token.userId) === -1) {
                item.reported = false;
            } else {
                item.reported = true;
            }
        }

        return data;
    }

};
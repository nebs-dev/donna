/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    '/docs/*': {
        'static': '/docs/*'
    },


    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

    ////////////
    /// AUTH ///
    ////////////

    /**
     * @api {post} /api/auth/login Login
     * @apiGroup Auth
     *
     * @apiParam {string} email User email (required)
     * @apiParam {string} password User password (required)
     */
    'POST /api/auth/login': 'Auth.login',

    /**
     * @api {post} /api/auth/register Register
     * @apiGroup Auth
     *
     * @apiParam {string} email User email (required)
     * @apiParam {string} password User password (required)
     * @apiParam {string} confirmPassword Repeated password (required)
     */
    'POST /api/auth/register': 'Auth.register',

    /**
     * @api {post} /api/auth/facebook Facebook
     * @apiGroup Auth
     *
     * @apiParam {string} facebookId Facebook ID (required)
     * @apiParam {string} email User email
     * @apiParam {string} name User name
     * @apiParam {string} surname User last name
     */
    'POST /api/auth/facebook': 'Auth.facebook',

    /**
     * @api {post} /api/auth/google Google+
     * @apiGroup Auth
     *
     * @apiParam {string} googleId google+ ID (required)
     * @apiParam {string} email User email
     * @apiParam {string} firstName User first name
     * @apiParam {string} lastName User last name
     */
    'POST /api/auth/google': 'Auth.google',


    ////////////
    /// NEWS ///
    ////////////

    /**
     * @api {post} /api/news/create create
     * @apiGroup News
     *
     * @apiParam {string} title News title (required)
     * @apiParam {text} text News text (required)
     * @apiParam {file} file News file
     */
    'POST /api/news/create': 'News.create',

    /**
     * @api {post} /api/news/update/:id update
     * @apiGroup News
     *
     * @apiParam {string} title News title
     * @apiParam {text} text News text
     * @apiParam {file} file News file
     */
    'POST /api/news/update/:id': 'News.update',

    /**
     * @api {post} /api/news/destroy/:id destroy
     * @apiGroup News
     */
    'POST /api/news/destroy/:id': 'News.destroy',

    /**
     * @api {get} /api/news/show/:id show
     * @apiGroup News
     */
    'GET /api/news/show/:id': 'News.show',

    /**
     * @api {post} /api/news/like/:id like/unlike News
     * @apiGroup News
     */
    'POST /api/news/like/:id': 'News.like',

    /**
     * @api {post} /api/news/addComment/:id addComment
     * @apiGroup News
     *
     * @apiParam {integer} news News ID
     * @apiParam {text} text Comment text
     */
    'POST /api/news/addComment/:id': 'News.addComment',


    ///////////////
    /// COMMENT ///
    ///////////////

    /**
     * @api {post} /api/comment/like/:id like/unlike Comment
     * @apiGroup Comment
     */
    'POST /api/comment/like/:id': 'Comment.like',

    /**
     * @api {post} /api/comment/report/:id report/unreport Comment
     * @apiGroup Comment
     */
    'POST /api/comment/report/:id': 'Comment.report',


    ////////////
    /// FILE ///
    ////////////

    /**
     * @api {get} /api/file/:id get one File
     * @apiGroup File
     */
    'GET /api/file/:id': 'File.getOne',

    /**
     * @api {post} /api/file/destroy/:id destroy
     * @apiGroup File
     */
    'POST /api/file/destroy/:id': 'File.destroy',

    /**
     * @api {post} /api/file/addComment/:id addComment
     * @apiGroup File
     *
     * @apiParam {integer} news File ID
     * @apiParam {text} text Comment text
     */
    'POST /api/file/addComment/:id': 'File.addComment',

    /**
     * @api {post} /api/file/like/:id like/unlike File
     * @apiGroup File
     */
    'POST /api/file/like/:id': 'File.like',


    ///////////////
    /// GALLERY ///
    ///////////////

    /**
     * @api {post} /api/gallery/create create
     * @apiGroup Gallery
     *
     * @apiParam {string} title Gallery title (required)
     * @apiParam {file} file Gallery file
     */
    'POST /api/gallery/create': 'Gallery.create',

    /**
     * @api {post} /api/gallery/addFile/:id addFile
     * @apiGroup Gallery
     */
    'POST /api/gallery/addFile/:id': 'Gallery.addFile',

    /**
     * @api {post} /api/gallery/destroy/:id destroy
     * @apiGroup Gallery
     */
    'POST /api/gallery/destroy/:id': 'Gallery.destroy',

    /**
     * @api {get} /api/gallery/show/:id show
     * @apiGroup Gallery
     */
    'GET /api/gallery/show/:id': 'Gallery.show',

    /**
     * @api {post} /api/gallery/addComment/:id addComment
     * @apiGroup Gallery
     *
     * @apiParam {integer} news Gallery ID
     * @apiParam {text} text Comment text
     */
    'POST /api/gallery/addComment/:id': 'Gallery.addComment',

    /**
     * @api {post} /api/file/like/:id like/unlike Gallery
     * @apiGroup Gallery
     */
    'POST /api/gallery/like/:id': 'Gallery.like',

    /////////////
    /// EVENT ///
    /////////////

    /**
     * @api {post} /api/event/create create
     * @apiGroup Event
     *
     * @apiParam {string} title event title (required)
     * @apiParam {text} text event text (required)
     * @apiParam {date} date event date (required)
     * @apiParam {text} string event location
     * @apiParam {file} file event file
     */
    'POST /api/event/create': 'Event.create',

    /**
     * @api {post} /api/event/update/:id update
     * @apiGroup Event
     *
     * @apiParam {string} title event title
     * @apiParam {text} text event text
     * @apiParam {date} date event date
     * @apiParam {text} string event location
     * @apiParam {file} file event file
     */
    'POST /api/event/update/:id': 'Event.update',

    /**
     * @api {post} /api/event/destroy/:id destroy
     * @apiGroup Event
     */
    'POST /api/event/destroy/:id': 'Event.destroy',

    /**
     * @api {get} /api/event/show/:id show
     * @apiGroup Event
     */
    'GET /api/event/show/:id': 'Event.show',

    /**
     * @api {post} /api/event/like/:id like/unlike Event
     * @apiGroup Event
     */
    'POST /api/event/like/:id': 'Event.like',

    /**
     * @api {post} /api/event/addComment/:id addComment
     * @apiGroup Event
     *
     * @apiParam {integer} event event ID
     * @apiParam {text} text Comment text
     */
    'POST /api/event/addComment/:id': 'Event.addComment',

    /**
     * @api {get} /api/events list of events
     * @apiGroup Event
     */
    'GET /api/events': 'Event.list'

};

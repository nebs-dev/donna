/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function forbidden(msg) {

    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(403);

    // Set summary msg
    if (msg === undefined) msg = 'Forbidden';

    sails.log.verbose('Sending 403 ("Forbidden") response');

    var response = {
        error: 'Forbidden',
        status: 403,
        summary: msg
    };

    return res.jsonx(response);

};


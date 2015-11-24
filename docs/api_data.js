define({ "api": [
  {
    "type": "post",
    "url": "/api/auth/facebook",
    "title": "Facebook",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "facebookId",
            "description": "<p>Facebook ID (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "firstName",
            "description": "<p>User first name</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "lastName",
            "description": "<p>User last name</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Auth",
    "name": "PostApiAuthFacebook"
  },
  {
    "type": "post",
    "url": "/api/auth/google",
    "title": "Google+",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "googleId",
            "description": "<p>google+ ID (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "firstName",
            "description": "<p>User first name</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "lastName",
            "description": "<p>User last name</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Auth",
    "name": "PostApiAuthGoogle"
  },
  {
    "type": "post",
    "url": "/api/auth/login",
    "title": "Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>User password (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Auth",
    "name": "PostApiAuthLogin"
  },
  {
    "type": "post",
    "url": "/api/auth/register",
    "title": "Register",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>User password (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "confirmPassword",
            "description": "<p>Repeated password (required)</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Auth",
    "name": "PostApiAuthRegister"
  },
  {
    "type": "post",
    "url": "/api/news/create",
    "title": "create",
    "group": "News",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>News title (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>News text (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>file</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>News file URL</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "News",
    "name": "PostApiNewsCreate"
  },
  {
    "type": "post",
    "url": "/api/news/destroy/:id",
    "title": "destroy",
    "group": "News",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "News",
    "name": "PostApiNewsDestroyId"
  },
  {
    "type": "post",
    "url": "/api/news/update/:id",
    "title": "update",
    "group": "News",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>News title</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>News text</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>file</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>News file URL</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "News",
    "name": "PostApiNewsUpdateId"
  }
] });
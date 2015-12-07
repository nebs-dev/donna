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
            "type": "<p>email</p> ",
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
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "firstName",
            "description": "<p>User first name (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "lastName",
            "description": "<p>User last name (required)</p> "
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
    "url": "/api/comment/like/:id",
    "title": "like/unlike Comment",
    "group": "Comment",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Comment",
    "name": "PostApiCommentLikeId"
  },
  {
    "type": "post",
    "url": "/api/comment/report/:id",
    "title": "report/unreport Comment",
    "group": "Comment",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Comment",
    "name": "PostApiCommentReportId"
  },
  {
    "type": "get",
    "url": "/api/event/show/:id",
    "title": "show",
    "group": "Event",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Event",
    "name": "GetApiEventShowId"
  },
  {
    "type": "get",
    "url": "/api/events",
    "title": "list of events",
    "group": "Event",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Event",
    "name": "GetApiEvents"
  },
  {
    "type": "post",
    "url": "/api/event/addComment/:id",
    "title": "addComment",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "event",
            "description": "<p>event ID</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>Comment text</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Event",
    "name": "PostApiEventAddcommentId"
  },
  {
    "type": "post",
    "url": "/api/event/create",
    "title": "create",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>event title (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>event text (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>date</p> ",
            "optional": false,
            "field": "date",
            "description": "<p>event date (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "string",
            "description": "<p>event location</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>file</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>event file</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Event",
    "name": "PostApiEventCreate"
  },
  {
    "type": "post",
    "url": "/api/event/destroy/:id",
    "title": "destroy",
    "group": "Event",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Event",
    "name": "PostApiEventDestroyId"
  },
  {
    "type": "post",
    "url": "/api/event/like/:id",
    "title": "like/unlike Event",
    "group": "Event",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Event",
    "name": "PostApiEventLikeId"
  },
  {
    "type": "post",
    "url": "/api/event/update/:id",
    "title": "update",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>event title</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>event text</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>date</p> ",
            "optional": false,
            "field": "date",
            "description": "<p>event date</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "string",
            "description": "<p>event location</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>file</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>event file</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Event",
    "name": "PostApiEventUpdateId"
  },
  {
    "type": "get",
    "url": "/api/file/:id",
    "title": "get one File",
    "group": "File",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "GetApiFileId"
  },
  {
    "type": "post",
    "url": "/api/file/addComment/:id",
    "title": "addComment",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "news",
            "description": "<p>File ID</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>Comment text</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "PostApiFileAddcommentId"
  },
  {
    "type": "post",
    "url": "/api/file/destroy/:id",
    "title": "destroy",
    "group": "File",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "PostApiFileDestroyId"
  },
  {
    "type": "post",
    "url": "/api/file/like/:id",
    "title": "like/unlike File",
    "group": "File",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "File",
    "name": "PostApiFileLikeId"
  },
  {
    "type": "get",
    "url": "/api/gallery/show/:id",
    "title": "show",
    "group": "Gallery",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Gallery",
    "name": "GetApiGalleryShowId"
  },
  {
    "type": "post",
    "url": "/api/file/like/:id",
    "title": "like/unlike Gallery",
    "group": "Gallery",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Gallery",
    "name": "PostApiFileLikeId"
  },
  {
    "type": "post",
    "url": "/api/gallery/addComment/:id",
    "title": "addComment",
    "group": "Gallery",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "news",
            "description": "<p>Gallery ID</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>Comment text</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Gallery",
    "name": "PostApiGalleryAddcommentId"
  },
  {
    "type": "post",
    "url": "/api/gallery/addFile/:id",
    "title": "addFile",
    "group": "Gallery",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Gallery",
    "name": "PostApiGalleryAddfileId"
  },
  {
    "type": "post",
    "url": "/api/gallery/create",
    "title": "create",
    "group": "Gallery",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>Gallery title (required)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>file</p> ",
            "optional": false,
            "field": "file",
            "description": "<p>Gallery file</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Gallery",
    "name": "PostApiGalleryCreate"
  },
  {
    "type": "post",
    "url": "/api/gallery/destroy/:id",
    "title": "destroy",
    "group": "Gallery",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Gallery",
    "name": "PostApiGalleryDestroyId"
  },
  {
    "type": "get",
    "url": "/api/messages/connect",
    "title": "list of messages + subscribe to model",
    "group": "Messages",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Messages",
    "name": "GetApiMessagesConnect"
  },
  {
    "type": "post",
    "url": "/api/messages/create",
    "title": "Create new message",
    "group": "Messages",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>message text</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "Messages",
    "name": "PostApiMessagesCreate"
  },
  {
    "type": "get",
    "url": "/api/news/show/:id",
    "title": "show",
    "group": "News",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "News",
    "name": "GetApiNewsShowId"
  },
  {
    "type": "post",
    "url": "/api/news",
    "title": "list of news",
    "group": "News",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "News",
    "name": "PostApiNews"
  },
  {
    "type": "post",
    "url": "/api/news/addComment/:id",
    "title": "addComment",
    "group": "News",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>integer</p> ",
            "optional": false,
            "field": "news",
            "description": "<p>News ID</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>text</p> ",
            "optional": false,
            "field": "text",
            "description": "<p>Comment text</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "News",
    "name": "PostApiNewsAddcommentId"
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
            "description": "<p>News file</p> "
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
    "url": "/api/news/like/:id",
    "title": "like/unlike News",
    "group": "News",
    "version": "0.0.0",
    "filename": "config/routes.js",
    "groupTitle": "News",
    "name": "PostApiNewsLikeId"
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
            "description": "<p>News file</p> "
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
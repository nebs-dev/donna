!function(){"use strict";angular.module("donna",["ngAnimate","ui.router","oitozero.ngSweetAlert"]).run(["$rootScope","$state","Auth",function(a,l,s){a.$on("$stateChangeStart",function(a,e){s.authorize(e.data.access)||(a.preventDefault(),l.go("anon.login"))})}])}(),function(){"use strict";function a(){var a={restrict:"E",templateUrl:"app/components/navbar/navbar.html",controller:"NavbarController",controllerAs:"vm",bindToController:!0};return a}angular.module("donna").directive("navbar",a)}(),function(){"use strict";function a(a){var l=this;l.logout=function(){a.logout()}}angular.module("donna").controller("NavbarController",a),a.$inject=["Auth"]}(),function(){"use strict";function a(){return{get:function(a){return localStorage.getItem(a)},set:function(a,l){return localStorage.setItem(a,l)},unset:function(a){return localStorage.removeItem(a)}}}function l(a,l,s,e){return{authorize:function(a){return a===s.user?this.isAuthenticated():!0},isAuthenticated:function(){return l.get("auth_token")},login:function(s){var o=a.post(e.URL+"/api/auth/login",s);return o.success(function(a){l.set("auth_token",angular.toJson(a))}),o},logout:function(){l.unset("auth_token"),$state.go("anon.login")}}}function s(a,l){var s=l.get("LocalService");return{request:function(a){var l;return s.get("auth_token")&&(l=angular.fromJson(s.get("auth_token")).token),l&&(a.headers.Authorization="Bearer "+l),a},responseError:function(e){return(401===e.status||403===e.status)&&(s.unset("auth_token"),l.get("$state").go("anon.login")),a.reject(e)}}}angular.module("donna").factory("LocalService",a).factory("Auth",l).factory("AuthInterceptor",s),l.$inject=["$http","LocalService","AccessLevels","API"],s.$inject=["$q","$injector"]}(),function(){"use strict";function a(a,l,s){var e=this;e.login=function(e){console.log(e),l.login(e).success(function(){a.go("user.dashboard")}).error(function(a){s.swal(a.error,a.summary)})}}angular.module("donna").controller("LoginController",a),a.$inject=["$state","Auth","SweetAlert"]}(),function(){"use strict";function a(){}angular.module("donna").controller("DashboardController",a)}(),function(){"use strict";function a(){}angular.module("donna").controller("MainController",a)}(),function(){"use strict";function a(a){a.debug("runBlock end")}angular.module("donna").run(a),a.$inject=["$log"]}(),function(){"use strict";function a(a,l,s){a.state("anon",{"abstract":!0,template:"<ui-view/>",data:{access:s.anon}}).state("anon.login",{url:"/login",templateUrl:"app/components/login/login.html"}),a.state("user",{"abstract":!0,templateUrl:"app/main/main.html",data:{access:s.user}}).state("user.dashboard",{url:"/",templateUrl:"app/components/dashboard/dashboard.html"}),l.otherwise("/")}angular.module("donna").config(a),a.$inject=["$stateProvider","$urlRouterProvider","AccessLevels"]}(),function(){"use strict";angular.module("donna").constant("API",{URL:"http://localhost:1337"}).constant("AccessLevels",{anon:0,user:1})}(),function(){"use strict";function a(a){a.debugEnabled(!0)}angular.module("donna").config(a),a.$inject=["$logProvider"]}(),angular.module("web").run(["$templateCache",function(a){a.put("app/main/main.html","<navbar></navbar><sidebar></sidebar><ui-view></ui-view>"),a.put("app/components/dashboard/dashboard.html","<h1>TEST</h1>"),a.put("app/components/login/login.html",'<div class="col-lg-6"><section class="panel"><header class="panel-heading">Login Form</header><div class="panel-body"><form class="form-horizontal" role="form" ng-submit="loginCtrl.login(user)"><div class="form-group"><label for="inputEmail1" class="col-lg-2 col-sm-2 control-label">Email</label><div class="col-lg-10"><input ng-model="user.email" type="email" class="form-control" id="inputEmail1" placeholder="Email"><p class="help-block">Example block-level help text here.</p></div></div><div class="form-group"><label for="inputPassword1" class="col-lg-2 col-sm-2 control-label">Password</label><div class="col-lg-10"><input ng-model="user.password" type="password" class="form-control" id="inputPassword1" placeholder="Password"></div></div><div class="form-group"><div class="col-lg-offset-2 col-lg-10"><div class="checkbox"><label><input type="checkbox"> Remember me</label></div></div></div><div class="form-group"><div class="col-lg-offset-2 col-lg-10"><input type="submit" class="btn btn-info" ng-disabled="userForm.$invalid" value="Login"></div></div></form></div></section></div>'),a.put("app/components/navbar/navbar.html",'<header class="header"><a href="index.html" class="logo">Director</a><nav class="navbar navbar-static-top" role="navigation"><a href="#" class="navbar-btn sidebar-toggle" data-toggle="offcanvas" role="button"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></a><div class="navbar-right"><ul class="nav navbar-nav"><li><a href="#" ng-click="vm.logout()">Logout</a></li><li class="dropdown messages-menu"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-envelope"></i> <span class="label label-success">4</span></a><ul class="dropdown-menu"><li class="header">You have 4 messages</li><li><div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto; height: 200px;"><ul class="menu" style="overflow: hidden; width: 100%; height: 200px;"><li><a href="#"><div class="pull-left"><img src="img/26115.jpg" class="img-circle" alt="User Image"></div><h4>Support Team</h4><p>Why not buy a new awesome theme?</p><small class="pull-right"><i class="fa fa-clock-o"></i> 5 mins</small></a></li><li><a href="#"><div class="pull-left"><img src="img/26115.jpg" class="img-circle" alt="user image"></div><h4>Director Design Team</h4><p>Why not buy a new awesome theme?</p><small class="pull-right"><i class="fa fa-clock-o"></i> 2 hours</small></a></li><li><a href="#"><div class="pull-left"><img src="img/avatar.png" class="img-circle" alt="user image"></div><h4>Developers</h4><p>Why not buy a new awesome theme?</p><small class="pull-right"><i class="fa fa-clock-o"></i> Today</small></a></li><li><a href="#"><div class="pull-left"><img src="img/26115.jpg" class="img-circle" alt="user image"></div><h4>Sales Department</h4><p>Why not buy a new awesome theme?</p><small class="pull-right"><i class="fa fa-clock-o"></i> Yesterday</small></a></li><li><a href="#"><div class="pull-left"><img src="img/avatar.png" class="img-circle" alt="user image"></div><h4>Reviewers</h4><p>Why not buy a new awesome theme?</p><small class="pull-right"><i class="fa fa-clock-o"></i> 2 days</small></a></li></ul><div class="slimScrollBar" style="width: 3px; position: absolute; top: 0px; opacity: 0.4; display: block; border-radius: 5px; z-index: 99; right: 1px; background: rgb(0, 0, 0);"></div><div class="slimScrollRail" style="width: 3px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 5px; opacity: 0.2; z-index: 90; right: 1px; background: rgb(51, 51, 51);"></div></div></li><li class="footer"><a href="#">See All Messages</a></li></ul></li><li class="dropdown tasks-menu"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-tasks"></i> <span class="label label-danger">9</span></a><ul class="dropdown-menu"><li class="header">You have 9 tasks</li><li><div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto; height: 200px;"><ul class="menu" style="overflow: hidden; width: 100%; height: 200px;"><li><a href="#"><h3>Design some buttons <small class="pull-right">20%</small></h3><div class="progress progress-striped xs"><div class="progress-bar progress-bar-success" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">20% Complete</span></div></div></a></li><li><a href="#"><h3>Create a nice theme <small class="pull-right">40%</small></h3><div class="progress progress-striped xs"><div class="progress-bar progress-bar-danger" style="width: 40%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">40% Complete</span></div></div></a></li><li><a href="#"><h3>Some task I need to do <small class="pull-right">60%</small></h3><div class="progress progress-striped xs"><div class="progress-bar progress-bar-info" style="width: 60%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">60% Complete</span></div></div></a></li><li><a href="#"><h3>Make beautiful transitions <small class="pull-right">80%</small></h3><div class="progress progress-striped xs"><div class="progress-bar progress-bar-warning" style="width: 80%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">80% Complete</span></div></div></a></li></ul><div class="slimScrollBar" style="width: 3px; position: absolute; top: 0px; opacity: 0.4; display: block; border-radius: 5px; z-index: 99; right: 1px; background: rgb(0, 0, 0);"></div><div class="slimScrollRail" style="width: 3px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 5px; opacity: 0.2; z-index: 90; right: 1px; background: rgb(51, 51, 51);"></div></div></li><li class="footer"><a href="#">View all tasks</a></li></ul></li><li class="dropdown user user-menu"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-user"></i> <span>Jane Doe <i class="caret"></i></span></a><ul class="dropdown-menu dropdown-custom dropdown-menu-right"><li class="dropdown-header text-center">Account</li><li><a href="#"><i class="fa fa-clock-o fa-fw pull-right"></i> <span class="badge badge-success pull-right">10</span> Updates</a> <a href="#"><i class="fa fa-envelope-o fa-fw pull-right"></i> <span class="badge badge-danger pull-right">5</span> Messages</a> <a href="#"><i class="fa fa-magnet fa-fw pull-right"></i> <span class="badge badge-info pull-right">3</span> Subscriptions</a> <a href="#"><i class="fa fa-question fa-fw pull-right"></i> <span class="badge pull-right">11</span> FAQ</a></li><li class="divider"></li><li><a href="#"><i class="fa fa-user fa-fw pull-right"></i> Profile</a> <a data-toggle="modal" href="#modal-user-settings"><i class="fa fa-cog fa-fw pull-right"></i> Settings</a></li><li class="divider"></li><li><a href="#"><i class="fa fa-ban fa-fw pull-right"></i> Logout</a></li></ul></li></ul></div></nav></header>')}]);
//# sourceMappingURL=../maps/scripts/app-1e61e6065e.js.map

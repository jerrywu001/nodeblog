/*
	* directives angularJs的标签指令
*/
var directives = angular.module( 'directives', [] );

//对应页面中的my-name标签
/**
directives.directive( 'homeIndexBar', function( $rootScope ) {	//function可以接收参数$document/$scope
	if( !!$rootScope.user ) {
		return {
			template:	'<li>Welcome <b ng-bind="user"></b></li>' +
						'<li><a href="/index.html#/blogSend">发布博客</a></li>' +
						'<li><a href="/index.html#/user">修改资料</a></li>' +
						'<li><a href="/logout">退出</a></li>'
		};
	} else {
		return {
			template:	'<li>Welcome!</li>' +
						'<li><a href="/index.html#/login">登录</a></li>' +
						'<li><a href="/index.html#/reg">注册</a></li>'
		};
	}
});
**/
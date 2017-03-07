/*
	* app angularJs的入口
*/
var app = angular.module( 'myapp', [		//对应index.html ng-app的值
	/** 注入并初始化依赖模块 **/
	'ngRoute',
	'ngAnimate',
	'controllers',
	'directives',
	'filters',
	'services'
]);

//设置路由
app.config( function( $routeProvider, $locationProvider ) {
	$locationProvider.html5Mode(true);
	$routeProvider.when( '/u_demo', {
		templateUrl: './templates/demo.html',
		controller: 'demoCtrl'
	}).when( '/u_home', {
		templateUrl: './templates/home.html',
		controller: 'homeCtrl'
	}).when( '/u_login', {
		templateUrl: './templates/login.html',
		controller: 'loginCtrl'
	}).when( '/u_logout', {
		templateUrl: './templates/logout.html',
		controller: 'logoutCtrl'
	}).when( '/u_reg', {
		templateUrl: './templates/reg.html',
		controller: 'regCtrl'
	}).when( '/u_user', {
		templateUrl: './templates/user.html',
		controller: 'userCtrl'
	}).when( '/u_blogSend', {
		templateUrl: './templates/blogSend.html',
		controller: 'blogSendCtrl'
	}).when( '/u_blogInfo/:id.html', {
		templateUrl: '../templates/blogInfo.html',
		controller: 'blogInfoCtrl'
	}).otherwise({
		redirectTo: '/u_home'
	});
});
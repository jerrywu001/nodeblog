var express = require('express');
var db = require('../db');
var qiniu = require('qiniu');
var app = express();
var conn = null;

/* 页面模块导入 */
var home = require('./action/home');
var login = require('./action/login');
var reg = require('./action/reg');
var user = require('./action/user');
var blogList = require('./action/blogList');
var blogSend = require('./action/blogSend');
var blogInfo = require('./action/blogInfo');
var review = require('./action/review');

/* 页面配置 */

//获取上传token处理
app.all('/uptoken', function(req, res) {
	qiniu.conf.ACCESS_KEY = 'OzeBqlS0Gy3mD-c2EBjr-aiMWFg4gAp0UwNl2gQD';
	qiniu.conf.SECRET_KEY = 'DRJVRKuTZsiyzVcZPT0W_gSfM5HPtzjL5NpUfkxU';	
	var uptoken = new qiniu.rs.PutPolicy('progress');
	var token = uptoken.token();
	res.header("Cache-Control", "max-age=0, private, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	if (token) {
		res.json({ uptoken: token });
	} else {
		res.json({ uptoken: '' });
	}
});

home.initHome( app );

login.initLogin( db, app, conn );

reg.initReg( db, app, conn );

user.initUser( db, app, conn );

blogList.initBlogList( db, app, conn );

blogSend.initBlogSend( db, app, conn );

blogInfo.initBlogInfo( db, app, conn );

review.initBlogReview( db, app, conn );
/* 页面配置 end */

module.exports = app;
/** 
	先在项目中 安装 mysql模块
	npm install mysql;
**/
var express = require('express');
var client = require('mysql');
var app = express();

/** 数据库配置 **/
var settings = {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database:'test',
    port: 3306
};

/** 取得数据库连接对象 **/
function getConnection( client, settings ){
	return client.createConnection( settings );
}

/** 连接数据库 **/
function connectFun( conn ){
	conn.connect(function(error, results) {
	  if(error) {
		console.log('Connection Error: ' + error.message);
		return;
	  }
	  console.log('Connected to MySQL');
	});
}

/** 数据库操作 **/
function execQuery( sql, conn, successFun, errFun ){
	conn.query( sql, function(err, rows, fields) {
		if (err) throw err;
		if( rows.constructor === Array ) {	//查询操作
			if( !!rows.length ) {
				successFun(rows);
			} else {
				errFun();
			}
		} else {	//增删改 操作
			if( rows.affectedRows >= 1 ) {
				successFun();
			} else {
				errFun();
			}
		}
	});
}

var exports = {
	client: client,
	settings: settings,
	getConnection: getConnection,
	connectDB: connectFun,
	execQuery: execQuery
};

module.exports = exports;

/**
DROP TABLE IF EXISTS NodeSample;
CREATE TABLE NodeSample (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  firstname VARCHAR(20) NOT NULL ,
  lastname VARCHAR(20) NOT NULL ,
  head VARCHAR(800),
  message TEXT NOT NULL
);

DROP TABLE IF EXISTS NodeBlog;
CREATE TABLE NodeBlog (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  blogId VARCHAR(20) NOT NULL,
  nick VARCHAR(20) NOT NULL ,
  title VARCHAR(200) NOT NULL ,
  content TEXT NOT NULL
);

DROP TABLE IF EXISTS NodeBlogReview;
CREATE TABLE NodeBlogReview (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  blogId VARCHAR(20) NOT NULL,
  time VARCHAR(20) NOT NULL ,
  nick VARCHAR(20) NOT NULL ,
  head VARCHAR(800),
  content TEXT NOT NULL,
  replyTo VARCHAR(20) NOT NULL,
  quoteCntent TEXT NOT NULL
);

insert into NodeSample (id, firstname, lastname, message) values(null, 'Tom', 'Wang', 'This is a Node Test By Wang!');

insert into NodeBlog (id, blogId, nick, title, content) values(null, '1410423299980288', 'Linda', 'iphone6-Oh-Ha-Ha!', 'iphone6-Oh-Ha-Ha!');
**/

/**
update NodeSample set firstname = 'Toms' where id = 2;

delete from NodeSample where id = 2;

show variables like 'character%';	//查看编码

**/
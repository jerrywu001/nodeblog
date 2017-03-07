var formidable = require('formidable');
var fs = require('fs');
var utils = require('../utils/utils');

function initUser(db, app, conn) {
	app.all('/userInfo', function(req, res) {
		var username = req.session.user;
		var sql = 'SELECT * from NodeSample where firstname = "' + username + '"';
		if( !!conn && !!conn._socket.readable ) {
			conn = conn;
			console.log('==========');
		} else {
			conn = db.getConnection( db.client, db.settings  );
			db.connectDB( conn );
			console.log('+++++++');
		}
		
		db.execQuery( sql, conn, function( rows ) {
			res.json({ 
				status: 'OK',
				user: true,
				data: rows[0]
			});
		}, function(){
			res.json({ 
				status: 'OK',
				user: false
			});
		});
	});

	app.all('/userEdit', function(req, res) {
		if( !!req.session.user ) {
			var data = req.body;
			var username = req.session.user;
			var pass = data.password;
			var rPass = data.passwordRepeat;
			var desc = data.desc;
			var head = data.avatar.replace('./','/');
			var sql = 'update NodeSample set lastname = "' + pass + '", head = "' + head + '", message = "' + desc + '" where firstname = "' + username + '";';
			var sqlA = 'update NodeBlogReview set head = "' + head + '" where nick = "' + username + '";'
			if( !!conn && !!conn._socket.readable ) {
				conn = conn;
				console.log('==========');
			} else {
				conn = db.getConnection( db.client, db.settings  );
				db.connectDB( conn );
				console.log('+++++++');
			}
			
			db.execQuery( sql, conn, function(){	//success
				db.execQuery( sqlA, conn, function(){	//更新评论里面的头像
					conn.end();
				}, function(){	//error
					conn.end();
					console.log('error====');
				});
				//用户信息修改成功
				console.log('保存成功！');
				req.session.user = username;
				req.session.head = head;
				req.flash('success', '用户信息修改成功！欢迎再次回来：' + username + '!');
				res.json({
					status: 'OK',
					userEdit: true
				});
			}, function(){	//error
				res.json({
					status: 'OK',
					userEdit: false,
					code: 'error'
				});
				console.log('保存失败！');
			});
		} else { 
			res.json({
				status: 'OK',
				userEdit: false,
				code: 'login'
			}); 
		}
	});
}

var exports = {
	initUser: initUser
};

module.exports = exports;
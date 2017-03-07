function initLogin(db, app, conn) {
	app.all('/isLogin', function(req, res) {
		if( !!req.session.user ) {
			res.json({ 
				status: 'OK',
				login: true,
				user: req.session.user
			});
		} else {
			res.json({ 
				status: 'OK',
				login: false
			});
		}
	});

	app.all('/logout', function(req, res) {
		console.log('退出成功！');
		req.session.user = null;
		req.session.head = null;
		res.json({ 
			status: 'OK',
			logout: true
		});
	});

	app.all('/loginHandle', function(req, res) {	//登录处理,如果采用ajax处理，就不需要res.redirect跳转
		var data = req.body;
		if( data.username !== undefined ) {		//表示点击了登录按钮
			var username = data.username;
			var pass = data.password;
			var sql = 'SELECT * from NodeSample where firstname = "' + username + '" and lastname = "' + pass + '"';
			if( !!conn && !!conn._socket.readable ) {
				conn = conn;
				console.log('==========');
			} else {
				conn = db.getConnection( db.client, db.settings  );
				db.connectDB( conn );
				console.log('+++++++');
			}
			
			db.execQuery( sql, conn, function(rows){	//success
				console.log('登录成功！');
				conn.end();
				req.session.user = username;
				req.session.head = rows[0].head;
				req.flash('success', '欢迎' + username + '，登录成功!');
				res.json({ 
					status: 'OK',
					login: true,
					user: {
						name: req.session.user
					}
				});
			}, function(){	//error
				req.session.user = null;
				res.json({ 
					status: 'OK',
					login: false,
					code: 'error'
				});
				console.log('登录失败！');
			});
		}
	});
}

var exports = {
	initLogin: initLogin
};

module.exports = exports;
function initReg(db, app, conn) {
	app.all('/regHandle', function(req, res) {	//注册处理
		var data = req.body;
		if( data.username !== undefined ) {		//表示点击了注册按钮
			var username = data.username;
			var pass = data.password;
			var rPass = data.passwordRepeat;
			var desc = data.desc;
			var head = 'http://7xkvpt.com1.z0.glb.clouddn.com/default.png';
			var csql = 'SELECT * from NodeSample where firstname = "' + username + '"';
			var sql = 'insert into NodeSample (id, firstname, lastname, head, message) values(null, "' + username + '", "' + pass + '", "'+ head +'", "' + desc + '")';
			if( !!conn && !!conn._socket.readable ) {
				conn = conn;
				console.log('==========');
			} else {
				conn = db.getConnection( db.client, db.settings  );
				db.connectDB( conn );
				console.log('+++++++');
			}
			
			db.execQuery( csql, conn, function(rows){	//user Exist!
				console.log('注册失败,用户已存在！');
				res.json({ 
					status: 'OK',
					register: false,
					code: 'userExist'
				});
			}, function(){	//user not Exist
				db.execQuery( sql, conn, function(){	//success
					console.log('注册成功！');
					conn.end();
					req.session.user = username;
					req.session.head = head;
					req.flash('success', '注册成功！欢迎' + username + '!');
					res.json({
						status: 'OK',
						register: true,
						user: {
							name: req.session.user
						}
					});
				}, function(){	//error
					res.json({
						status: 'OK',
						register: false,
						code: 'error'
					});
					console.log('注册失败！');
				});
			});
		}
	});
}

var exports = {
	initReg: initReg
};

module.exports = exports;
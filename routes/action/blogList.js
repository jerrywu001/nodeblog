function initBlogList(db, app, conn) {
	app.all('/getBlogList', function(req, res) {
		var sql = 'SELECT * from NodeBlog limit 0,10';	//取前10条
		if( !!conn && !!conn._socket.readable ) {
			conn = conn;
			console.log('==========');
		} else {
			conn = db.getConnection( db.client, db.settings  );
			db.connectDB( conn );
			console.log('+++++++');
		}
		
		db.execQuery( sql, conn, function(rows){	//success
			console.log('获取列表成功！');
			conn.end();
			res.json({
				status: 'OK',
				code: '1000',
				list: rows
			});
		}, function(){	//error
			console.log('获取列表失败！');
			res.json({ 
				status: 'OK',
				code: '1004'
			});
		});
	});
}

var exports = {
	initBlogList: initBlogList
};

module.exports = exports;
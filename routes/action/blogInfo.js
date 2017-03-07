function initBlogInfo(db, app, conn) {
	app.all('/blogInfo/:id', function(req, res){
		var sql = 'SELECT * from NodeBlog where blogId ="' + req.params.id + '"';
		if( !!conn && !!conn._socket.readable ) {
			conn = conn;
			console.log('==========');
		} else {
			conn = db.getConnection( db.client, db.settings  );
			db.connectDB( conn );
			console.log('+++++++');
		}
		
		db.execQuery( sql, conn, function(rows){	//success
			console.log('获取文章成功！');
			conn.end();
			res.json({ 
				status: 'OK',
				code: '1000',
				data: {
					title: '我的博客【' + rows[0].title + '】' ,
					blogTitle: rows[0].title,
					blogAuthor: rows[0].nick,
					blogTime: rows[0].blogId,
					blogText: rows[0].content
				}
			});
		}, function(){	//error
			console.log('获取文章失败！');
			res.json({ 
				status: 'OK',
				code: '1004'
			});
		});
	});
}

var exports = {
	initBlogInfo: initBlogInfo
};

module.exports = exports;
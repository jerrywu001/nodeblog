function initBlogReview(db, app, conn) {
	app.all('/reviewList', function(req, res) {
		var data = req.body;
		var blogId = data.blogId;
		var sql = 'select * from NodeBlogReview where blogId = "' + blogId + '" order by time desc limit 0,10;';

		if( !!conn && !!conn._socket.readable ) {
			conn = conn;
			console.log('==========');
		} else {
			conn = db.getConnection( db.client, db.settings  );
			db.connectDB( conn );
			console.log('+++++++');
		}

		db.execQuery( sql, conn, function(rows){	//success
			console.log('获取评论列表成功！');
			conn.end();
			res.json({ 
				status: 'OK',
				review: true,
				data: rows
			});
		}, function(){	//error
			console.log('获取评论列表失败！');
			res.json({ 
				status: 'OK',
				review: false,
				code: 'error'
			});
		});

	});
	
	//查看更多
	app.all('/reviewMore', function(req, res) {
		var data = req.body;
		var blogId = data.blogId;
		var length = data.length;
		if( !!getPage( length ) ) {
			var start = getPage( length ).start;
			var end = getPage( length ).end;
			var sql = 'select * from NodeBlogReview where blogId = "' + blogId + '" order by time desc limit ' + start + ',' + end + ';';

			if( !!conn && !!conn._socket.readable ) {
				conn = conn;
				console.log('==========');
			} else {
				conn = db.getConnection( db.client, db.settings  );
				db.connectDB( conn );
				console.log('+++++++');
			}

			db.execQuery( sql, conn, function(rows){	//success
				console.log('获取评论列表成功！');
				conn.end();
				res.json({ 
					status: 'OK',
					review: true,
					data: rows
				});
			}, function(){	//error
				console.log('获取评论列表失败！');
				res.json({ 
					status: 'OK',
					review: false,
					code: 'error'
				});
			});
		} else {	//没有更多数据了
			res.json({
				status: 'OK',
				review: false,
				code: 'null'
			});
		}
	});

	app.all('/review', function(req, res) {	//评论处理
		if( !!req.session.user ) {
			var data = req.body;
			if( data.review !== undefined ) {		//表示点击了评论按钮
				var review = data.review;
				var time = new Date().getTime().toString();
				var nick = req.session.user;
				var head = req.session.head;
				var blogId = data.blogId;
				var author = data.author;
				
				if( author !== nick ) {
					var sql = 'insert into NodeBlogReview (id, blogId, time, nick, head, content, replyTo, quoteCntent) ' + 
								'values(null, "' + blogId + '", "' + time + '", "' + nick + '", "' + head + '", "' + review + '", "", "");';

					if( !!conn && !!conn._socket.readable ) {
						conn = conn;
						console.log('==========');
					} else {
						conn = db.getConnection( db.client, db.settings  );
						db.connectDB( conn );
						console.log('+++++++');
					}
					
					db.execQuery( sql, conn, function(){	//success
						console.log('评论成功！');
						conn.end();
						res.json({ 
							status: 'OK',
							review: true,
							data: {
								blogId: blogId,
								head: head,
								nick: nick,
								time: time,
								content: review,
								quoteCntent: '',
								replyTo: ''
							}
						});
					}, function(){	//error
						console.log('评论失败！');
						res.json({ 
							status: 'OK',
							review: false,
							code: 'error'
						});
					});
				} else {
					res.json({ 
						status: 'OK',
						review: false,
						code: 'self'
					});
				}
			}
		} else {
			console.log('评论失败！login');
			res.json({ 
				status: 'OK',
				review: false,
				code: 'login'
			});
		}
	});

	app.all('/reply', function(req, res) {	//评论回复处理
		if( !!req.session.user ) {
			var data = req.body;
			if( data.review !== undefined ) {		//表示点击了回复按钮
				var review = data.review;
				var time = new Date().getTime().toString();
				var nick = req.session.user;
				var head = req.session.head;
				var blogId = data.blogId;
				var replyToNick = data.replyToNick;
				var quote = data.quoteText;
				
				if( replyToNick !== nick ) {
					var sql = 'insert into NodeBlogReview (id, blogId, time, nick, head, content, replyTo, quoteCntent) ' + 
								'values(null, "' + blogId + '", "' + time + '", "' + nick + '", "' + head + '", "' + review + '", "' + replyToNick + '", "' + quote + '");';

					if( !!conn && !!conn._socket.readable ) {
						conn = conn;
						console.log('==========');
					} else {
						conn = db.getConnection( db.client, db.settings  );
						db.connectDB( conn );
						console.log('+++++++');
					}
					
					db.execQuery( sql, conn, function(){	//success
						console.log('回复成功！');
						conn.end();
						res.json({ 
							status: 'OK',
							reply: true,
							data: {
								blogId: blogId,
								head: head,
								nick: nick,
								time: time,
								content: review,
								replyTo: replyToNick,
								quoteCntent: quote
							}
						});
					}, function(){	//error
						console.log('回复失败！');
						res.json({ 
							status: 'OK',
							reply: false,
							code: 'error'
						});
					});
				} else {
					res.json({ 
						status: 'OK',
						reply: false,
						code: 'self'
					});
				}
			}
		} else {
			console.log('回复失败！login');
			res.json({ 
				status: 'OK',
				reply: false,
				code: 'login'
			});
		}
	});
}

function getPage( length ) {
	var pageLen = 10;	//每次加载10条
	var pages = length % pageLen;
	if( pages !== 0 ) {
		return null;
	} else {
		pages = length / pageLen;
		return {
			start: pages * 10,
			end: ( pages + 1 ) * 10
		};
	}
}

var exports = {
	initBlogReview: initBlogReview
};

module.exports = exports;
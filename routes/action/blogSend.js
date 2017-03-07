var formidable = require('formidable');
var fs = require('fs');
var qiniu = require('qiniu');
var download = require('url-download');
var utils = require('../utils/utils');
var qiniuUrl = 'http://7xkvpt.com1.z0.glb.clouddn.com/';

function updateImgUrlByQiniu(db, conn, desc, rplwithArr, qiniuPathArr, blogId) {
	if(qiniuPathArr.length == rplwithArr.length){
		for(var i = 0, len = qiniuPathArr.length; i < len; i++) {
			desc = desc.replace(new RegExp(rplwithArr[i].replace('public/article/','/article/'),'gi'),qiniuPathArr[i]);
		}
		var sql = 'update NodeBlog set content = "'+ desc +'" where blogId = "'+ blogId + '";';
		if( !!conn && !!conn._socket.readable ) {
			conn = conn;
			console.log('==========');
		} else {
			conn = db.getConnection( db.client, db.settings  );
			db.connectDB( conn );
			console.log('+++++++');
		}

		db.execQuery( sql, conn, function(){
			conn.end();
			deleteLocalFiles('./public/article/' + blogId,true);
			console.log('update qiniu imgs ok!!');
		}, function(){	//error
			conn.end();
			console.log('update qiniu imgs failed====');
		});
	}
}

function initBlogSend(db, app, conn) {
	app.all('/blogSendHandle', function(req, res) {	//博客发布处理
		if( !!req.session.user ) {
			var sql = '',
				data = req.body,
				blogId = new Date().getTime().toString() + parseInt( Math.random()*1000 ).toString(),
				nick = !!req.session.user? req.session.user: 'noName';
			if( data.title !== undefined ) {		//表示点击了发布按钮
				var title = data.title;
				var desc = data.desc;
				if( data.iSavePic === '1' ) {	//表示采集外网图片到服务器
					var randDir = blogId,
						upath = '/article/' + randDir + '/',
						baseDir = './public/article/',
						replaceArr = data.imgArr,
						rplwithArr = [],
						token = getQiniuToken();
					fs.mkdirSync( baseDir + randDir );
					for(var i = 0, len = replaceArr.length; i < len; i++) {
						var replaceWith = upath + replaceArr[i].substring(replaceArr[i].lastIndexOf('/')+1);
						desc = desc.replace(new RegExp(replaceArr[i],'gi'),replaceWith);
						rplwithArr.push('public' + replaceWith);
					}

					download(replaceArr, baseDir + randDir).on('close', function (err, url) {
						var fileName = url.substring(url.lastIndexOf('/')+1);
					}).on('done', function () {
						var qiniuPathArr =[];
						for(var i = 0, len = rplwithArr.length; i < len; i++) {
							var path = rplwithArr[i];
							uploadQiniuFromSite(token,path,function(ret){
								var url = qiniuUrl+ret.key;
								qiniuPathArr.push(url);
								updateImgUrlByQiniu(db, conn, desc, rplwithArr, qiniuPathArr, blogId);
							});
						}
					});
				}

				desc = utils.strSqlChange( desc );	//sql字符串处理
				desc = utils.htmlTagEscape( desc );	//标签处理
				sql = 'insert into NodeBlog (id, blogId, nick, title, content) values(null, "' + blogId + '", "' + nick + '", "' + title + '", "' + desc + '")';
				if( !!conn && !!conn._socket.readable ) {
					conn = conn;
					console.log('==========');
				} else {
					conn = db.getConnection( db.client, db.settings  );
					db.connectDB( conn );
					console.log('+++++++');
				}
				
				db.execQuery( sql, conn, function(){	//success
					console.log('发布成功！');
					conn.end();
					req.flash('success', '发布成功！');
					res.json({
						status: 'OK',
						send: true
					});
				}, function(){	//error
					res.json({
						status: 'OK',
						send: false,
						code: 'error'
					});
					console.log('发布失败！');
				});
			}
		} else {
			res.json({
				status: 'OK',
				send: false,
				code: 'login'
			});
		}
	});

	//上传处理
	app.all('/fileUpload', function(req, res) {
		var form = null;
		form = new formidable.IncomingForm();
		form.keepExtensions = false;		//隐藏后缀
		form.multiples = true;				//多文件上传
		form.uploadDir = './public/upload/';
		uploadFileFun(form, req, res);
	});
}

function deleteLocalFiles(path,deleteFolder){
	var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteLocalFiles(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
		if(deleteFolder) fs.rmdirSync(path);
	}
}

//上传
function uploadFileFun(form, req, res){
	var token = getQiniuToken();
	form.parse(req, function(error, fields, files) {
		var gUpload = './public/upload/',
			fList = files.file,
			fileS = null,
			resultPath = [];
		if( fList.constructor === Array ) {
			for( var i = 0; i < fList.length; i++ ) {
				fileS = fList[i];
				uploadQiniu(token,'',fileS,res);
			}
			
		} else {	//单文件上传
			//res.setHeader('Content-Type', 'text/html');		//很重要，不然ie会弹出保存对话框
			fileS = fList;
			uploadQiniu(token,'',fileS,res);
		}
	});
}

function uploadQiniu(token, key, file, res) {
	qiniu.io.putFile(token, key, file.path, null, function(err, ret) {
		deleteLocalFiles('./public/upload/',false);
		//返回结果
		if(!err) {
			res.json({
				status: 1000,
				data: {
					key: ret.key,
					hash: ret.hash
				}
			});
		} else {					
			res.json({
				status: -1,
				data: null
			});
		}
	});
}

function uploadQiniuFromSite(token, url, callback) {
	qiniu.io.putFile(token, '', url, null, function(err, ret) {
		if(!err) {
			if(callback) callback(ret);
		} else {
			console.log('upload fail!');
		}
	});
}

function getQiniuToken() {
	qiniu.conf.ACCESS_KEY = 'OzeBqlS0Gy3mD-c2EBjr-aiMWFg4gAp0UwNl2gQD';
	qiniu.conf.SECRET_KEY = 'DRJVRKuTZsiyzVcZPT0W_gSfM5HPtzjL5NpUfkxU';	
	var uptoken = new qiniu.rs.PutPolicy('progress');
	return uptoken.token();
}

var exports = {
	initBlogSend: initBlogSend
};

module.exports = exports;
var getRootPath = function (){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
	if( pos === 5 ) localhostPaht = curWwwPath;
    if (localhostPaht.indexOf("file") != -1) {
        return ".";
    }
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return (localhostPaht+projectName);
};

var requestUrl = getRootPath();

String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.isEmpty=function(){
	var length = this.replace(/(^\s*)|(\s*$)/g, "").length;
	if(length==1&&this.charCodeAt(0)=='8203'){//处理 换行控制符
		length = 0;
	}
	return length == 0;
};

//时间格式化
Date.prototype.format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

var addStyleLink = function( path, id ) {
	if( !!document.getElementById( id ) ) {
		return;
	}
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = path;
    link.id = id;
    document.getElementsByTagName("head")[0].appendChild(link);
};

var addScriptLink = function( path, id ) {
	if( !!document.getElementById( id ) ) {
		return;
	}
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    script.id = id;
    document.getElementsByTagName("head")[0].appendChild(script);
};

var isParent = function (obj,parentObj){
	if(!parentObj)
		return false;
	while (obj != undefined && obj != null && !!obj.tagName && obj.tagName.toUpperCase() != 'BODY'){
		if (obj == parentObj){
			return true;
		}
		obj = obj.parentNode;
	}
	return false;
};

var enterSumbit =  function(dom,callback){	//dom 表示 js document对象
   $(dom).on('keydown',function(event){
	   var keycode = event.which;  
	   if (keycode == 13) {  // enter 键
            callback();
       }
   });
};

//"yyyy-MM-dd hh:mm:ss" 转化为 DateTime
var dateStrSplitLineToDate = function (dateStr){
	if(!!dateStr){
		return new Date(dateStr.replace(/-/g, '/'));
	}
};

var decodeHTML = function (s){  
	return s.replace(/&amp;/g,'\&')
	.replace(/&lt;/g, '\<')
	.replace(/&gt;/g,'\>')
	.replace(/&#039;/g, "\'")
	.replace(/&quot;/g, '\"');
}

//将字符串转化为用于显示的字符串
var htmlTagEscape = function (s) {
	if(!!s){
		return s.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#039;')
		.replace(/"/g, '&quot;');
	} else {
		return '';
	}
};

//生成loading效果
var golbalLoding = function(){
	$("body").append("<div class='gloading'></div>");
}

var removeLoding = function(){
	$("body").find(".gloading").remove();
}

var autoError = function( obj, msg ) {
	var dialog = "<span class='alert alert-error'>"+msg+"</span>";
	obj.html(dialog);
	obj.show();
	setTimeout(function(){obj.fadeOut("slow");},1000);
};

var autoInfo = function( obj, msg ) {
	var dialog = "<span class='info'>"+msg+"</span>";
	obj.html(dialog);
	$("#global-loading").hide();
	obj.show();
	setTimeout(function(){obj.fadeOut("slow");},1000);
};

//文件上传配置
var uploaderFile = function( token, id, name, key, $scope, callback ) {
	setTimeout(function(){
		if( $(id).find('.webuploader-pick').length === 0 ) {
			var uploader = WebUploader.create({
				    auto: true,
				    swf: '//cdn.bootcss.com/webuploader/0.1.1/Uploader.swf',
				    server: 'http://upload.qiniu.com?token='+token,
				    pick: id,
				    accept: {
				        title: 'Images',
				        extensions: 'gif,jpg,jpeg,bmp,png',
				        mimeTypes: 'image/*'
				    },
				    compress: {
				        width: 640,
				        quality: 80,
				        allowMagnify: false,
				        crop: false,
				        preserveHeaders: true,
				        noCompressIfLarger: false,
				        compressSize: 100*1024
				    }
				});
			uploader.on( 'fileQueued', function( file ) {
				golbalLoding();
			});
			
			uploader.on( 'uploadProgress', function( file, percentage ) {
			});
			
			uploader.on( 'uploadSuccess', function( file, res ) {
				if( !!callback ) callback( res,$scope,name,key );
			});
	
			uploader.on( 'uploadError', function( file ) {
				removeLoding();
				autoError( $("#tips"), "上传失败！" );
			});
	
			uploader.on( 'uploadComplete', function( file ) {
				removeLoding();
			});
		}
	}, 370);
};

//消息提示的关闭功能
$(document).off( "click", ".alert .close" );
$(document).on( "click", ".alert .close", function(){
	$(this).parent(".alert").addClass("hide");
});

//回车提交
enterSumbit( document, function(){
	if( window.location.href.indexOf('/blogSend') == -1 && !!$(".form-horizontal").length ) {
		$(".btn-primary").trigger("click");
	}
	if( !!$('.reply').not('.ng-hide').length ) {
		$(".replyBtn").filter(':visible').trigger("click");
	} else {
		$("#reviewBtn").trigger("click");
	}
});

/** config lab **/
var _labJs = {
	webuploader: '//cdn.bootcss.com/webuploader/0.1.1/webuploader.min.js',
	bootstrap: '//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js',
	umeditor: {
		edit: 'javascripts/umeditor/umeditor.min.js',
		config: 'javascripts/umeditor/umeditor.config.js',
		cn: 'javascripts/umeditor/lang/zh-cn/zh-cn.js'
	}
};

var _labCss = {
	umeditor: 'javascripts/umeditor/themes/default/css/umeditor.css'
};

var imgUrl = 'http://7xkvpt.com1.z0.glb.clouddn.com/';
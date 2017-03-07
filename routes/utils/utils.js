/* 工具函数 */
function format(obj,fmt) { //时间格式化
	var o = {
		"M+": obj.getMonth() + 1, //月份 
		"d+": obj.getDate(), //日 
		"h+": obj.getHours(), //小时 
		"m+": obj.getMinutes(), //分 
		"s+": obj.getSeconds(), //秒 
		"q+": Math.floor((obj.getMonth() + 3) / 3), //季度 
		"S": obj.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function htmlTagEscape(s) {
	return s.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/'/g, '&#039;')
	.replace(/"/g, '&quot;');
}

function strSqlChange(s) {
	return s.replace(/&lt;/g, '#')
	.replace(/&gt;/g,'#')
	.replace(/drop/gi,'drop#')
	.replace(/use/gi,'use#')
	.replace(/exec/gi,'exec#')
	.replace(/backup/gi,'backup#')
	.replace(/alert/gi,'alert#')
	.replace(/truncate/gi,'truncate#')
	.replace(/select/gi,'select#')
	.replace(/insert/gi,'insert#')
	.replace(/update/gi,'update#')
	.replace(/delete/gi,'delete#')
	.replace(/create/gi,'create#');
}
/* 工具函数 end */

var exports = {
	htmlTagEscape: htmlTagEscape,
	strSqlChange: strSqlChange,
	format: format
};

module.exports = exports;
/*
	* filters angularJs的过滤器
*/
var filters = angular.module( 'filters', [] ),iurl = 'http://7xkvpt.com1.z0.glb.clouddn.com/';

filters.filter( 'headType', function() {
	return function( name ) {	//对应页面标签的值(ng-bind或者{{name}})
		return !!name? name: iurl + 'default.png';
	}
});

filters.filter( 'dateType', function() {	//文章的时间
	return function( time ) {
		if( !!time ) {
			time = time.substring( 0, time.length - 3 );
			time = new Date( parseInt( time ) ).format('yyyy-MM-dd hh:mm');
			return time;
		} else {
			return '';
		}
	}
});

filters.filter( 'timeType', function() {
	return function( time ) {
		if( !!time ) {
			time = new Date( parseInt( time ) ).format('yyyy-MM-dd hh:mm');
			return time;
		} else {
			return '';
		}
	}
});
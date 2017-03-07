/*
	* services angularJs的API
*/
var services = angular.module('services', []);
services.factory( 'indexService', function( $http ) {	//调用 直接写到controller的function参数里
	return {
		uptoken: function( callback ){
			//services 处理过程
			$http({
				method: 'post',
				url: '/uptoken'
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		isLogin: function( callback ){
			//services 处理过程
			$http({
				method: 'post',
				url: '/isLogin'
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		login: function( data, callback ) {
			$http({
				method: 'post',
				url: '/loginHandle',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		logout: function( callback ) {
			$http({
				method: 'post',
				url: '/logout',
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		reg: function( data, callback ) {
			$http({
				method: 'post',
				url: '/regHandle',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		getBlogList: function( callback ) {
			$http({
				method: 'post',
				url: '/getBlogList'
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		}
	};
});

services.factory( 'userService', function( $http ) {
	return {
		edit: function( data, callback ) {
			$http({
				method: 'post',
				url: '/userEdit',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		info: function( callback ) {
			$http({
				method: 'post',
				url: '/userInfo'
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		avatar: function( data, callback ) {
			$http({
				method: 'post',
				url: '/avatar',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		}
	};
});

services.factory( 'blogService', function( $http ) {
	return {
		info: function( id, callback ) {
			var url = '/blogInfo/' + id;
			$http({
				method: 'post',
				url: url
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		send: function( data, callback ) {
			$http({
				method: 'post',
				url: '/blogSendHandle',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		review: function( data, callback ) {
			$http({
				method: 'post',
				url: '/review',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		reply: function( data, callback ) {
			$http({
				method: 'post',
				url: '/reply',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		reviewMore: function( data, callback ) {
			$http({
				method: 'post',
				url: '/reviewMore',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		getReview: function( id, callback ) {
			var data = { blogId: id };
			$http({
				method: 'post',
				url: '/reviewList',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		},
		fileUpload: function( data, callback ) {
			$http({
				method: 'post',
				url: '/fileUpload',
				data: data
			}).success( function( data, status, headers, config ) {
				callback( data );
			}).error( function( data, status, headers, config ) {
			});
		}
	};
});
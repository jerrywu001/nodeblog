/*
	* controllers angularJs的控制器
*/
var controllers = angular.module( 'controllers', [] );

//run 表示立即执行，一般用于初始化一些数据
controllers.run( ['$rootScope', 'indexService', function( $rootScope, indexService ) {
	indexService.getBlogList( function(d) {
		if( d.status === 'OK' && !!d.list ) {
			$rootScope.list = d.list;
		} else {
			$rootScope.list = [];
		}
		reflushScope( $rootScope );	//变量刷新
	});
}]);

controllers.run( ['$rootScope', 'indexService', function( $rootScope, indexService ) {
	$rootScope.title = '我的博客';
	$rootScope.user = null;
	indexService.isLogin( function(d) {
		if( d.status === 'OK' && !!d.login ) {
			$rootScope.user = d.user;
			reflushScope( $rootScope );
		}
	});
}]);

controllers.run( ['$rootScope', 'indexService', function( $rootScope, indexService ) {
	indexService.uptoken( function(d) {
		$rootScope.token = d.uptoken;
		reflushScope( $rootScope );
	});
}])

//页面控制器
controllers.controller( 'demoCtrl', [ '$rootScope', '$scope', '$location',
	function( $rootScope, $scope, $location ) {
		$rootScope.title = '我的博客_demo';
		$scope.init = function() {
			$LAB
				.script( _labJs.bootstrap )
				.wait(function(){
					/** for demo **/
					$scope.dialog = {
						title: '我是一个对话框',
						content: '我是一个对话框，怎么样？？'
					};
					
					var vm = $scope.vm = {};
					vm.cities = [
						{
						  province: '北京',
						  code: 'bj',
						  label: '北京市'
						},
						{
						  province: '上海',
						  code: 'sh',
						  label: '上海市'
						},
						{
						  province: '广东',
						  code: 'gz',
						  label: '广州'
						},
						{
						  province: '广东',
						  code: 'sz',
						  label: '深圳'
						}
					];
					/** for demo **/
					reflushScope( $scope );
			});
		};
		$scope.init();
	}
]);

controllers.controller( 'homeCtrl', [ '$rootScope', '$scope', '$location', 'indexService',
	function( $rootScope, $scope, $location, indexService ) {
		$rootScope.title = '我的博客';
		reflushScope( $rootScope );
	}
]);

controllers.controller( 'blogInfoCtrl', [ '$rootScope', '$scope', '$location', '$routeParams', 'blogService',
	function( $rootScope, $scope, $location, $routeParams, blogService ) {
		$rootScope.title = '我的博客';
		$scope.init = function() {
			$scope.reviewEmpty = true;
			$scope.showReply = false;
			$location;
			blogService.info( $routeParams.id, function(d) {
				if( d.status === 'OK' && d.code === '1000' ) {
					$('.blogDetail').html( decodeHTML( d.data.blogText ) );
					$scope.info = d.data;
					$scope.info.reviewText = '';
					$rootScope.title = d.data.title;
					reflushScope( $scope, $rootScope );
				}
			});
			
			blogService.getReview( $routeParams.id, function(d) {
				if( d.status === 'OK' && !!d.review ) {
					if( !!d.data.length ) {
						$scope.reviews = d.data;
						$scope.reviewEmpty = false;
					} else {
						$scope.reviews = [];
						$scope.reviewEmpty = true;
					}
					reflushScope( $scope );
				}
			});

		};
		$scope.init();

		//评论
		$scope.review = function() {
			var msg = '',
				flag = true,
				data = {
					review: htmlTagEscape( $scope.info.reviewText.trim() ),
					blogId: $routeParams.id,
					author: $scope.info.blogAuthor
				};

			if( data.review.trim().isEmpty() ) {
				msg = "请输入评论内容！";
				flag = false;
			}

			if( data.review.trim().length > 300 ) {
				msg = "输入的字符长度为0-300！";
				flag = false;
			}

			if( !flag ) {
				autoError( $('#tips'), msg );
			} else {
				blogService.review( data, function(d){
					if( !!d && d.status === 'OK' ) {
						if( !!d.review ) {
							$scope.reviewEmpty = false;
							$scope.addOne( d.data );
							$scope.info.reviewText = '';
							reflushScope( $scope, $rootScope );
							autoInfo( $('#tips'), '评论成功!' );
						} else {
							if( d.code === 'error' ) {
								msg = "操作失败，请稍后再试！";
							}

							if( d.code === 'login' ) {
								msg = "您还未登录！";
							}

							if( d.code === 'self' ) {
								msg = "不能给自己评论！";
							}
							autoError( $('#tips'), msg );
						}
					}
				});
			}
		};
		
		//回复
		$scope.reply = function( list ) {
			var msg = '',
				flag = true,
				data = {
					review: htmlTagEscape( list.replyText.trim() ),
					blogId: $routeParams.id,
					replyToNick: list.nick,
					quoteText: list.content
				};

			if( data.review.trim().isEmpty() ) {
				msg = "请输入回复内容！";
				flag = false;
			}

			if( data.review.trim().length > 300 ) {
				msg = "输入的字符长度为0-300！";
				flag = false;
			}

			if( !flag ) {
				autoError( $('#tips'), msg );
			} else {
				blogService.reply( data, function(d){
					if( !!d && d.status === 'OK' ) {
						if( !!d.reply ) {
							list.replyText = '';
							$scope.addOne( d.data );
							$scope.info.reviewText = '';
							reflushScope( $scope, $rootScope );
							autoInfo( $('#tips'), '回复成功!' );
						} else {
							if( d.code === 'error' ) {
								msg = "操作失败，请稍后再试！";
							}

							if( d.code === 'login' ) {
								msg = "您还未登录！";
							}

							if( d.code === 'self' ) {
								msg = "不能给自己回复！";
							}
							autoError( $('#tips'), msg );
						}
					}
				});
			}
		};

		$scope.reviewMore = function() {
			var data = {
				blogId: $routeParams.id,
				length: $scope.reviews.length
			};
			golbalLoding();
			blogService.reviewMore( data, function(d){
				if( !!d && d.status === "OK" ) {
					if( !!review && !!d.data && !!d.data.length ) {
						$scope.append( d.data );
						reflushScope( $scope );
					} else {
						autoError( $('#tips'), '没有更多了!' );
					}
					removeLoding();
				} else {
					autoError( $('#tips'), '操作失败，请稍后再试！' );
				}
			});
		};
		
		$scope.addOne = function( o ) {
			if( !!$scope.reviews ) {
				$scope.reviews.unshift( o );
			} else {
				$scope.reviews = [];
				$scope.reviews.push( o );
			}
		};

		$scope.append = function( arr ) {
			if( !!$scope.reviews ) {
				$scope.reviews = $scope.reviews.concat( arr );
			} else {
				$scope.reviews = [].concat( arr );
			}
		};

		$scope.showReply = function( list ) {
			$scope.hideReply();
			list.showReply = true;
		};

		$scope.hideReply = function() {
			for( var i in $scope.reviews ) {
				$scope.reviews[i].showReply = false;
			}
		};
	}
]);

controllers.controller( 'blogSendCtrl', [ '$rootScope', '$scope', '$location', 'blogService',
	function( $rootScope, $scope, $location, blogService ) {
		if( !$rootScope.user ) window.location.href = requestUrl + "/u_login?url=blogSend";
		$scope.init = function() {
			$rootScope.title = '我的博客_博客发布';
			$scope.blog = {
				iSavePic: '0',
				title: '',
				desc: ''
			};
			
			/** select **/
			var vm = $scope.vm = {};
			vm.iSavePic = [
				{
				  code: '1',
				  label: '是'
				},
				{
				  code: '0',
				  label: '否'
				}
			];
			vm.code = '0';
			reflushScope( $scope );
			/** select **/
		};
		$scope.init();

		$scope.initUeditor = function(e) {
			addStyleLink( _labCss.umeditor, 'umeditor' );
			$LAB
				.script( _labJs.umeditor.edit )
				.script( _labJs.umeditor.config )
				.script( _labJs.umeditor.cn )
				.wait(function(){	//注意 重新改了 UMEDITOR_CONFIG 133行
					e.target.style.display = 'none';
					UM.getEditor('desc');
					//全屏bug
					$(document).off( 'click', '.edui-btn-fullscreen' );
					$(document).on( 'click', '.edui-btn-fullscreen', function() {
						if( $(this).hasClass('edui-active') ) {
							$( '.edui-editor-body' ).css( 'max-height', $(window).height() - $('.edui-toolbar').height() + 'px' );
						} else {
							$( '.edui-editor-body' ).css( 'max-height', '500px' );
						}
					});
			});
		};

		$scope.submit = function() {
			$scope.blog = {
				iSavePic: $scope.vm.code,
				title: htmlTagEscape( $("#title").val().trim() ),
				desc: $('#desc').html()
			};
			
			var $msg = $(".alert"),
				msg = '',
				flag = true;
			var imgArr = [];
			
			if( $scope.blog.iSavePic === '1' ) {
				var $img = $( $scope.blog.desc ).find('img'), src = '';
				for( var i = 0; i < $img.length; i++ ) {
					src = $img.eq(i).attr('src').trim();
					imgArr.push( src );
				}
				$scope.blog.imgArr = imgArr;
			}

			if( $scope.blog.title.trim().isEmpty() || 
					$scope.blog.desc.trim().isEmpty() || 
					$scope.blog.desc.trim() === '<p><br></p>' ) {
				msg = "信息未填写完整！";
				flag = false;
			}

			if( !flag ) {
				$msg.find("b").text( msg );
				$msg.removeClass("hide");
				setTimeout(function(){
					$msg.addClass("hide");
				},3000);
			} else {
				blogService.send( $scope.blog, function(d){
					if( !!d && d.status === "OK" ) {
						var $msg = $(".alert"),
							msg = '';
						if( !!d.send ) {
							window.location.href = requestUrl + "/";
						} else {
							if( d.code === 'error' ) {
								msg = "发布失败，请稍后再试！";
							}

							if( d.code === 'login' ) {
								msg = "您还未登录！";
							}

							$msg.find("b").text( msg );
							$msg.removeClass("hide");
							setTimeout(function(){
								$msg.addClass("hide");
							},3000);
						}
					}
				});
			}
		};
	}
]);

controllers.controller( 'loginCtrl', [ '$rootScope', '$scope', '$location', 'indexService',
	function( $rootScope, $scope, $location, indexService ) {
		if( !!$rootScope.user ) window.location.href = requestUrl;
		$rootScope.title = '我的博客_登录';		
		$scope.init = function() {
			$scope.login = {
				username: '',
				password: '',
				correct: true
			};
			reflushScope( $scope );
		};
		$scope.init();

		$scope.submit = function() {
			var $msg = $(".alert"),
				msg = '',
				flag = true;

			indexService.login( $scope.login, function(d) {
				if( !!d && d.status === "OK" ) {
					if( !!d.login ) {
						$rootScope.user = d.user.name;
						if( !!$location.search().url ) {
							window.location.href = requestUrl + "/u_" + $location.search().url;
						} else {
							window.location.href = requestUrl;
						}
					} else {
						if( d.code === 'error' ) {
							msg = "用户名或密码错误！";
						}

						$scope.login.error = msg;
						$scope.login.correct = false;	//false表示显示错误提示
						reflushScope( $scope );	//需要重新刷新
						setTimeout(function(){
							$scope.login.correct = true;
							reflushScope( $scope );
						},3000);
					}
				}
			});
		};
	}
]);

controllers.controller( 'regCtrl', [ '$rootScope', '$scope', 'indexService',
	function( $rootScope, $scope, indexService ) {
		if( !!$rootScope.user ) window.location.href = requestUrl;
		$rootScope.title = '我的博客_注册';
		$scope.init = function() {
			$scope.reg = {
				username: '',
				password: '',
				passwordRepeat: '',
				desc: ''
			};
			reflushScope( $scope );
		};
		$scope.init();

		$scope.submit = function() {
			var $msg = $(".alert"),
				msg = '',
				flag = true;

			if( $scope.reg.username.trim().length > 15 ) {
				msg = "用户名长度是0-15个字符！";
				flag = false;
			}

			if( $scope.reg.passwordRepeat.trim() !== $scope.reg.password.trim() ) {
				msg = "两次密码输入不一致！";
				flag = false;
			}	
	
			if( !flag ) {
				$msg.find("b").text( msg );
				$msg.removeClass("hide");
				setTimeout(function(){
					$msg.addClass("hide");
				},3000);
			} else {
				indexService.reg( $scope.reg, function(d) {
					if( !!d && d.status === "OK" ) {
						if( !!d.register ) {
							$rootScope.user = d.user.name;
							window.location.href = requestUrl;
						} else {
							if( d.code === 'error' ) {
								msg = "注册失败，请稍后再试！";
							}

							if( d.code === 'userExist' ) {
								msg = "用户已存在，请重新注册！";
							}

							$msg.find("b").text( msg );
							$msg.removeClass("hide");
							setTimeout(function(){
								$msg.addClass("hide");
							},3000);
						}
					}
				});
			}
		};
	}
]);

controllers.controller( 'userCtrl', [ '$rootScope', '$scope', 'userService',
	function( $rootScope, $scope, userService ) {
		$rootScope.title = '我的博客_用户资料修改';
		$scope.init = function() {
			if( !$rootScope.user ) window.location.href = '/index.html#/login?url=user';
			$LAB
				.script( _labJs.webuploader )
				.wait(function(){	//加载上传插件
					$scope.user = {};
					$scope.user.avatar = '';
					userService.info( function( d ) {
						if( d.status === 'OK' && !!d.user ) {
							$scope.user = {
								username: d.data.firstname,
								avatar: d.data.head,
								desc: d.data.message,
								password: d.data.lastname,
								passwordRepeat: d.data.lastname
							};
							reflushScope( $scope );
						}
					});
					uploaderFile( $rootScope.token, '#avatarPicker', 'user', 'avatar', $scope, function(res,$scope,name,key){						
						if( !!name && !!key  ) {
							$scope[name][key] = imgUrl + res.key;
							$scope.$$phase || $scope.$apply();
							autoInfo( $("#tips"), "上传成功！" );
						}
						if( !!$(".bootbox-close-button").length ) $(".bootbox-close-button").trigger("click");
					});
			});
		};
		$scope.submit = function() {
			var $msg = $(".alert"),
				msg = '',
				flag = true;

			if( $scope.user.password.trim().isEmpty() || $scope.user.passwordRepeat.trim().isEmpty() || $scope.user.desc.trim().isEmpty() ) {
				msg = "修改信息未填写完整！";
				flag = false;
			}

			if( $scope.user.passwordRepeat.trim() !== $scope.user.password.trim() ) {
				msg = "两次密码输入不一致！";
				flag = false;
			}
			
			if( !flag ) {
				$msg.find("b").text( msg );
				$msg.removeClass("hide");
				setTimeout(function(){
					$msg.addClass("hide");
				},3000);
			} else {
				userService.edit( $scope.user, function(d){
					if( !!d && d.status === "OK" ) {
						if( !!d.userEdit ) {
							window.location.href = requestUrl;
						} else {
							if( d.code === 'error' ) {
								msg = "保存失败，请稍后再试！";
							}

							if( d.code === 'login' ) {
								window.location.href = requestUrl + "/u_login?url=user";
							}

							$msg.find("b").text( msg );
							$msg.removeClass("hide");
							setTimeout(function(){
								$msg.addClass("hide");
							},3000);
						}
					}
				});
			}
		};
		$scope.init();
	}
]);

controllers.controller( 'logoutCtrl', [ '$rootScope', '$scope', 'indexService',
	function( $rootScope, $scope, indexService ) {
		$scope.logout = function() {
			indexService.logout(function(d){
				if(d.status == 'OK' && d.logout ) {
					window.location.href = requestUrl + '/u_home';
				}
			});
		};
		$scope.logout();
	}
]);

function reflushScope( scope1, scope2 ) {
	if( !!scope1 ) {
		scope1.$$phase || scope1.$apply();
	}
	
	if( !!scope2 ) {
		scope2.$$phase || scope2.$apply();
	}
}
function initHome( app ) {
	app.all('/', function(req, res) {
		res.redirect( '/index.html' );
	});

	app.all('/index.html', function(req, res) {
		res.render( 'index', {});
	});

	app.all('/u_*', function(req, res) {
		res.render( 'index', {});
	});
}

var exports = {
	initHome: initHome
};

module.exports = exports;
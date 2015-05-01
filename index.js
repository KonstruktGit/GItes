var express = require('express'),
	handlebars = require('express-handlebars'),
	app = express(),
	port = 3000;

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.use('/app', express.static(__dirname + '/app'));

app.get('/', function(req, res) {
	res.render('home');
});

app.listen(port, function() {
	console.log("Listening on localhost:"+port+" ...");
});

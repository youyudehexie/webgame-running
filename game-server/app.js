var pomelo = require('pomelo');
var redisService = require('./app/services/redisService');
var RankService = require('./app/services/rankService');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'running');

app.set('redisService', redisService.init())


// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true,
			useProtobuf : true
		});


});

app.configure('production|development', 'rank', function(){
	app.set('rankService', new RankService(app));
});




// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});

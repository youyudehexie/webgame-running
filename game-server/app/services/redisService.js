var exp = module.exports;
var client = null

exp.init = function(opt){
	var defaultConfig = {
		host: '127.0.0.1',
		port: 6379
	}

	opt = opt || defaultConfig;
	
	if(!client){
		var client = require('redis').createClient(opt);
	}
	return client;
}
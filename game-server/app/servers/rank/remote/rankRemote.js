var consts = require('../../../consts/consts');

module.exports = function(app) {
	return new RankRemote(app);
};

var RankRemote = function(app) {
	this.app = app;
	this.redisService = app.get('redisService');
	this.channelService = app.get('channelService');
	this.kuser_list = consts.RedisKey.USER_LIST;
};


RankRemote.prototype.add = function(uid, sid, name, cb){
	var self = this;
	var client = self.redisService;


	client.sadd(self.kuser_list, uid, cb)

	var channel = self.channelService.getChannel(name, true);

	if(!! channel){
		channel.add(uid, sid);
	}

	client.scard(self.kuser_list, function(err, replies){
		if(err) return cb(err);

		var param = {
			route: 'onOnlineNum',
			onlineNum: replies
		};
		
		channel.pushMessage(param);
	})


};

RankRemote.prototype.kick = function(uid, sid, name){
	var self = this;
	var channel = self.channelService.getChannel(name, true);
	var client = self.redisService;

	client.srem(this.kuser_list, uid, function(err){
		if(err) {
			console.error('redisClient push service failed! error is : %j', err);
		}

		if(!!channel) {
			channel.leave(uid, sid);
		}

		client.scard(self.kuser_list, function(err, replies){
			if(err) return cb(err);

			var param = {
				route: 'onOnlineNum',
				onlineNum: replies
			};
			
			channel.pushMessage(param);
		});


	});

};

function errHandler(err, fails){
	if(!!err){
		logger.error('Push Message error! %j', err.stack);
	}
}



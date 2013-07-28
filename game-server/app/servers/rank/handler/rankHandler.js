var consts = require('../../../consts/consts');
var hat = require('hat');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;

};

var handler = Handler.prototype;

var dequeue = function(app){

}

handler.ready = function(msg, session, next){

	var onPrepare = function(uid, targetId){
		var msg = {
			uid: uid
		};

		var uids = []
		var target = {uid: uid, sid: 'connector-server-1'}
		uids.push(target)
		var target = {uid: targetId, sid: 'connector-server-1'}
		uids.push(target)

		self.app.get('channelService').pushMessageByUids('onPrepare', msg, uids, errHandler);
	
	}


	var self = this;	
	var matchId = msg.matchId;
	var uid = session.uid;

	var rankService = self.app.get('rankService');

	var game = rankService.get(matchId);

	game.match_status += 1;

	if(game.match_status > 1){
		var uid = game.user_list[0];
		var targetId = game.user_list[1];
	}

	onPrepare(uid, targetId)

}

function errHandler(err, fails){
	if(!!err){
		logger.error('Push Message error! %j', err.stack);
	}
}

handler.run = function(msg, session, next){
	var self = this;
	var matchId = msg.matchId;
	var uid = session.uid;


	var rankService = self.app.get('rankService');

	rankService.update(matchId, uid);
	rankService.setStatus()

}

handler.enqueue = function(msg, session, next){

	var self = this;
	var uid = session.uid;

	var rankService = self.app.get('rankService');
	var sid = self.app.get('serverId');
//	var channelService = self.app.get('channelService');

	var targetId = rankService.getCompetitor(uid);
	if(!targetId) {
		return next();
	}

	var matchId = hat();
	rankService.add(matchId, uid);
	rankService.add(matchId, targetId);

	var msg = {
		uid: uid,
		targetId: targetId,
		matchId: matchId
	}

	var uids = []
	var target = {uid: uid, sid: 'connector-server-1'}
	uids.push(target)
	var target = {uid: targetId, sid: 'connector-server-1'}
	uids.push(target)


	//app.rpc.rank.rankRemote.start(null, uid, targetId, matchId, self.app.get('serverId'), null)
	self.app.get('channelService').pushMessageByUids('onStart', msg, uids, errHandler);
	//console.log(uids,msg);




//	console.log('targetId ' + targetId);


/*
	var self = this;
	var uid = session.uid

	var rankService = self.app.get('rankService');
	var sessionService = self.app.get('sessionService');
	var sid = self.app.get('serverId');
	var channelService = self.app.get('channelService');


	var targetId = rankService.getCompetitor(uid);


	if(!targetId) {
		return next();
	}

	var matchId = hat();


	rankService.add(matchId, uid);
	rankService.add(matchId, targetId);

	var msg = {
		uid: uid,
		targetId: targetId,
		matchId: matchId
	}

	var uids = []
	var target = {uid: uid, sid: sid}
	uids.push(target)
	var target = {uid: targetId, sid: sid}
	uids.push(target)



//	channelService.pushMessageByUids('onStart', msg, uids, errHandler);

	self.app.rpc.rank.rankRemote.start(null, uid, targetId, matchId, self.app.get('serverId'), null)

	*/
}



/*
RankRemote.prototype.start = function(uid, targetId, matchId, sid){

	var self = this;

	var msg = {
		uid: uid,
		targetId: targetId,
		matchId: matchId
	}

	var uids = []
	var target = {uid: uid, sid: sid}
	uids.push(target)
	var target = {uid: targetId, sid: sid}
	uids.push(target)



	self.channelService.pushMessageByUids('onStart', msg, uids, errHandler);

}
*/
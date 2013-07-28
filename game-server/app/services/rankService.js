var Timer = require('../domain/action/timer');


var RankService = function(app) {
  this.app = app;
  this.competitor = [];
  this.matches = {}; 
  this.status = 0; //是否需要更新
  this.timer = new Timer({
    rank : this,
    interval : 500
  });
  this.timer.run()

};

module.exports = RankService;

RankService.prototype.getCompetitor = function(uid) {

	if(this.competitor.length > 0){
		var targetId = this.competitor.pop();
		return targetId;
	} else {
		if(! this.competitor.hasOwnProperty(uid)){
			this.competitor.push(uid);
		}
	}

};

RankService.prototype.add = function(matchId, uid) {

	if(!this.matches[matchId]){
		this.matches[matchId] = {match_status: 0}
		this.matches[matchId]['user_list'] =  [uid]
		this.matches[matchId][uid] = {
			x: 0,
			status: 0
		}
 	} else {

 		this.matches[matchId]['user_list'].push(uid);
 		this.matches[matchId][uid] = {
 			x: 0,
 			status: 0
 		}
 	}

 
};

RankService.prototype.get = function(matchId) {

	return this.matches[matchId]
 
};

RankService.prototype.setStatus = function(matchId) {

	this.status = 1;
 
};

RankService.prototype.update = function(matchId, uid) {

	if(!this.matches[matchId] || !this.matches[matchId][uid]){

		return;
	}

	this.matches[matchId][uid].x += 1;
	
};

function errHandler(err, fails){
	if(!!err){
		logger.error('Push Message error! %j', err.stack);
	}
}

RankService.prototype.pushMessage = function() {

	var matches = this.matches;
	var channelService = this.app.get('channelService');
	if(this.status){

		Object.keys(matches).forEach(function(matchId){

			var uid = matches[matchId].user_list[0]
			var targetId = matches[matchId].user_list[1];
			var uids = []
			var target = {uid: uid, sid: 'connector-server-1'}
			uids.push(target)
			var target = {uid: targetId, sid: 'connector-server-1'}
			uids.push(target)


			if(matches[matchId][uid].x > 200 || matches[matchId][targetId].x > 200){
				if(matches[matchId][uid].x > matches[matchId][targetId].x){
					var win = uid;
					var lose = targetId;
				} else {
					var lose = uid;
					var win = targetId;
				}

				delete matches[matchId]

				var msg = {
					win: win,
					lose: lose
				}

				return channelService.pushMessageByUids('onRet', msg, uids, errHandler);
			}

			var msg = {}
			msg[targetId] = matches[matchId][targetId];
			msg[uid] = matches[matchId][uid];

			channelService.pushMessageByUids('onMove', msg, uids, errHandler);
		});

		this.status = 0;	
	}

};




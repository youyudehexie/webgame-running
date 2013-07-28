var consts = require('../../../consts/consts');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;

};

var handler = Handler.prototype;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.entry = function(msg, session, next) {
	var self = this;

	var rid = 'chanel:global';

	var sessionService = self.app.get('sessionService');

	var uid = msg.username;

	if(!msg || !msg.username || !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;	
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});


	session.on('closed', onUserLeave.bind(null, self.app));

	self.app.rpc.rank.rankRemote.add(null, uid, self.app.get('serverId'), rid, function(err){
	 	next(null, msg);
	});

};



var onUserLeave = function(app, session) {

	if(!session || !session.uid) {
		return;
	}

	var rid = session.get('rid');
	app.rpc.rank.rankRemote.kick(session, session.uid, app.get('serverId'), rid, null);

/*
	var redisService = app.get('redisService');
	var key = consts.RedisKey.USER_LIST;
	redisService.srem(key,)*/

	/*
	if(!session || !session.uid) {
		return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);*/
};


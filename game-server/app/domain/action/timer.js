
var Timer = function(opts){
  this.interval = opts.interval||100;
  this.rank = opts.rank;
};

module.exports = Timer;

Timer.prototype.run = function () {
  this.interval = setInterval(this.tick.bind(this), this.interval); //定时执行 tick
};


Timer.prototype.close = function () {
  clearInterval(this.interval);
};

Timer.prototype.tick = function() {
 // console.log('tick');
  this.rank.pushMessage()
};



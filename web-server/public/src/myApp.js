/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var pomelo = window.pomelo;
var g_uid = 0;
var g_targetId = 0;


var TAG_LABEL_ONLINENUM = 1;


var LoadingLayer = cc.Layer.extend({

    init:function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        var self = this;
        var loadingText = '在匹配你的对手，如果实在没对手，请多开一个窗口';

        var loadingLabel =  cc.LabelTTF.create(loadingText, "Arial", 18); //使用说明

        self.addChild(loadingLabel);
        loadingLabel.setPosition(cc.p(size.width / 2, size.height / 2));
        
        return true

    }
});

var GameLayer = cc.Layer.extend({
    addEventListen: function(){
        this._super();
        var self = this;
        pomelo.on('onPrepare', function(){
            self.setKeyboardEnabled(true);
            var size = cc.Director.getInstance().getWinSize();
            var text = 'GO'
            var goLabel =  cc.LabelTTF.create(text, "Arial", 48); //使用说明
            goLabel.setColor(cc.c3b(255, 0, 0));

            self.addChild(goLabel);
            goLabel.setPosition(cc.p(size.width / 2, size.height / 2));
            var fadeOut = cc.FadeOut.create(2);
            var seq = cc.Sequence.create(fadeOut)
            goLabel.runAction(seq);

        });

        pomelo.on('onMove', function(msg){
            self.sprite1.setPosition(cc.p(self.player1.x + msg[g_uid].x, self.player1.y));
            self.sprite2.setPosition(cc.p(self.player2.x + msg[g_targetId].x, self.player2.y));

        });

        pomelo.on('onRet', function(msg){
            self.setKeyboardEnabled(false);
            var size = cc.Director.getInstance().getWinSize();
            var text = '到达终点，游戏施工中,咱无返回键，按F5重进';
            var FinLabel =  cc.LabelTTF.create(text, "Arial", 35); //使用说明
            FinLabel.setColor(cc.c3b(255, 0, 0));

            self.addChild(FinLabel);   
            FinLabel.setPosition(cc.p(size.width / 2, size.height / 2));       
         //   window.alert('fin');

        });

    },
    init:function () {
        this._super();

        var map = cc.TMXTiledMap.create("res/running.tmx");
        this.addChild(map); 


        var group1 = map.getObjectGroup("player1");
        var group2 = map.getObjectGroup("player2");

        var array1 = group1.getObjects();
        var array2 = group2.getObjects();

        this.player1 = array1[0]
        this.player2 = array2[0]


        this.sprite1 = cc.Sprite.create("res/player.jpg");
        this.sprite2 = cc.Sprite.create("res/player.jpg");

        this.addChild(this.sprite1);
        this.addChild(this.sprite2);


        this.sprite1.setPosition(cc.p(this.player1.x, this.player1.y));
        this.sprite2.setPosition(cc.p(this.player2.x, this.player2.y));

        pomelo.notify("rank.rankHandler.ready",{matchId: matchId});
        this.addEventListen();
        return true

    },
    onKeyUp:function (key) {  

        pomelo.notify("rank.rankHandler.run", {matchId: matchId});

    },
});

var matchId = 0;


var LoadingScene = cc.Scene.extend({
    addEventListen:function(){
        pomelo.on('onStart', function(msg){
            matchId = msg.matchId;
            g_uid = msg.uid;
            g_targetId = msg.targetId;
            var scene = new GameScene() 
            scene.init()
            var layer = new GameLayer(); 

            scene.addChild(layer, 0);

        });
    },
    init:function(){
        this._super();
        var layer = new LoadingLayer();
        layer.init();
        this.addChild(layer);   
        cc.Director.getInstance().replaceScene(this); 
        this.addEventListen()
    }
});


var GameScene = cc.Scene.extend({

    init:function(){
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);   
        cc.Director.getInstance().replaceScene(this); 
    }
});




var IndexLayer = cc.Layer.extend({
    addEventListen:function(self){
        pomelo.on('onOnlineNum', function(msg){
            var onlineNum = msg.onlineNum;

            var onlineText = '在线人数: ' + onlineNum;

            var label2 = self.getChildByTag(TAG_LABEL_ONLINENUM);
            label2.setString(onlineText);
            });
    
    },

    init: function(){
        var self = this;


        var host = "42.121.110.118";
        var port = "3010";

        var guiInit = function(onlineNum){

            var size = cc.Director.getInstance().getWinSize();
            var playIcon = cc.MenuItemImage.create(s_playNormal, s_playSelect, self.onMenuCallback, this);

            var introduce = '按任意键盘按键进行跑步，跟你的小伙伴们跑起来吧';
            var onlineText = '在线人数: ' + onlineNum;


            var introduceLabel =  cc.LabelTTF.create(introduce, "Arial", 18); //使用说明
            var onlineNumLabel =  cc.LabelTTF.create(onlineText, "Arial", 14);

            self.addChild(introduceLabel);
            introduceLabel.setPosition(cc.p(size.width / 2, size.height / 2 - 50));

            self.addChild(onlineNumLabel, 0, TAG_LABEL_ONLINENUM);
            onlineNumLabel.setPosition(cc.p(size.width / 2, size.height / 2 - 75));

            var menu = cc.Menu.create(playIcon);
            menu.alignItemsVertically();
            self.addChild(menu);     
        }

        var username = Date.now();

        pomelo.init({
          host: host,
          port: port,
          log: true
        }, function() {
        pomelo.request("connector.entryHandler.entry", {username: username}, function(data) {
          });
        });

        guiInit(0);

        self.addEventListen(self);

    },
    onMenuCallback: function(){
        var scene = new LoadingScene()
        scene.init()
        var layer = new LoadingLayer(); 
        pomelo.notify('rank.rankHandler.enqueue');
    }
});



var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new IndexLayer();
        layer.init();
        this.addChild(layer);
    }
});





var CHD = require("commonHandler");
var GameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        startBtn:cc.Node,
        overlayBtn:cc.Node,
        rankBtn:cc.Node,
        shareBtn:cc.Node,

        overlayIcon: cc.Node,
        sliderIcon: cc.Node,

        soundNode:cc.Node,
        overlayNode:cc.Node
    },
    onLoad () {
        cc.director.preloadScene('game');
    },

    start () {
        this.gameStorageCheck('hitMaxScore', 0);
        this.gameStorageCheck('isSound', 'on');
        this.runIcons();
        
        this.startBtn.on('touchstart', function(){
            this.startBtn.getChildByName('cover').active = true;
        }, this);
        this.startBtn.on('touchend', function(){
            this.startBtn.getChildByName('cover').active = false;
            this.openGame();
        }, this)
        this.startBtn.on('touchcancel', function(){
            this.startBtn.getChildByName('cover').active = false;
        }, this)


        this.overlayBtn.on('touchstart', function(){
            this.overlayBtn.getChildByName('cover').active = true;
        }, this);
        this.overlayBtn.on('touchend', function(){
            this.overlayBtn.getChildByName('cover').active = false;
            this.overlayNode.active = true;
        }, this);
        this.overlayBtn.on('touchcancel', function(){
            this.overlayBtn.getChildByName('cover').active = false;
        }, this);

        this.rankBtn.on('touchstart', function(){
            this.rankBtn.getChildByName('cover').active = true;
        }, this)
        this.rankBtn.on('touchend', function(){
            this.rankBtn.getChildByName('cover').active = false;
            this.openRank();
        }, this)
        this.rankBtn.on('touchcancel', function(){
            this.rankBtn.getChildByName('cover').active = false;
        }, this)

        this.shareBtn.on('touchstart', function(){
            this.shareBtn.getChildByName('cover').active = true;
        }, this);
        this.shareBtn.on('touchend', function(){
            this.shareBtn.getChildByName('cover').active = false;
            CHD.shareAppMessage('hitBricks', 'hitBricks.jpg');
        }, this);
        this.shareBtn.on('touchcancel', function(){
            this.shareBtn.getChildByName('cover').active = false;
        }, this);
        
        
        CHD.setInitValue(GameData);
        // this.soundNode.getComponent('sound').init();
    },
    openGame() {
        cc.director.loadScene('game');
    },
    openRank() {
        cc.director.loadScene('rank');
    },

    runIcons(){
        this.overlayIcon.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.25, 1.2),
                cc.rotateTo(0.2, -36),
                cc.rotateTo(0.2, 34),
                cc.rotateTo(0.2, -30),
                cc.rotateTo(0.1, 0),
                cc.scaleTo(0.2, 1),
                cc.delayTime(2)
            )
        ));

        this.sliderIcon.x = -this.sliderIcon.parent.width/3;
        this.sliderIcon.runAction(cc.repeatForever(
            cc.sequence(
                cc.moveBy(0.8, 2*this.sliderIcon.parent.width/3, 0),
                cc.moveBy(0.8, -2*this.sliderIcon.parent.width/3, 0)
            )
        ));
    },
    gameStorageCheck(key, value) {
        var ls = cc.sys.localStorage;
        var r = ls.getItem(key);
        if (r == "" || r == null) {
            ls.setItem(key, value);
        }
    },
    // update (dt) {},
});


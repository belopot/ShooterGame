// const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        gameNode:cc.Node,
        continueNode:cc.Node,
        cancelBtn:cc.Node,
        radialCounter:cc.Sprite

    },

    start () {
        
        this.cancelBtn.on('touchstart', function(){
            this.closeCount();
        }, this);
    },
    init(){
        this._started = false;
        this.cancelBtn.active = false;
        this.radialCounter.fillRange = 1;
        this.continueNode.y = this.node.height/2 + this.continueNode.height/2;
        this.continueNode.runAction(cc.sequence(
            cc.moveTo(0.12, 0, 0),
            cc.moveTo(0.08, 0, -100),
            cc.moveTo(0.24, 0, 200),
            cc.moveTo(0.15, 0, 132),
            cc.delayTime(0.1),
            cc.callFunc(this.startCount, this)
        ));
        
        this.scheduleOnce(() => {
            this.cancelBtn.scale = 5;
            this.cancelBtn.active = true;
            this.cancelBtn.runAction(cc.scaleTo(0.2, 1, 1));
        }, 0.6);
    },
    update (dt) {
        if(this._started){
            this._updateFillRange(this.radialCounter, dt);
        }
    },
    startCount(){
        this._started = true;
        this.continueNode.stopAllActions();
        this.continueNode.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.7, 1.2),
                cc.scaleTo(0.7, 0.9)
            )
        ));
    },
    closeCount(){
        this._started = false;
        this.node.active = false;
        this.node.parent.getComponent('game').gameOver();
    },
    stopCount(){
        this._started = false;
    },
    _updateFillRange: function (sprite, dt) {
        var fillRange = sprite.fillRange;
        if(fillRange <= 0){
            this.closeCount();            
        }else{
            sprite.fillRange -= (dt * 0.2);
        }
    }
});

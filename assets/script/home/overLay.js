var CHD = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {
        overBtn:cc.Node,
        closeBtn:cc.Node,
        closeHover:cc.Node,

        tipNumTxt:cc.Label
    },


    // onLoad () {},

    start () {
        this.tipNumTxt.string = CHD.tipNum;
        this.closeBtn.on('touchstart', function(event){
            this.closeHover.active = true;
        }, this);
        this.closeBtn.on('touchend', function(event){
            this.closeHover.active = false;
            this.node.active = false;
        }, this);
        this.closeBtn.on('touchcancel', function(event){
            this.closeHover.active = false;
        }, this);

        this.overBtn.on('touchstart', function(){
            this.overBtn.getChildByName('cover').active = true;
        }, this);
        this.overBtn.on('touchend', function(){
            this.overBtn.getChildByName('cover').active = false;
            this.invite();
        }, this);
        this.overBtn.on('touchcancel', function(){
            this.overBtn.getChildByName('cover').active = false;
        }, this);

        this.node.on('touchstart', function(event){
            event.stopPropagation();
        }, this);
    },
    invite(){
        let self = this;
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: 'hitBricks', 
                imageUrl: 'res/raw-assets/resources/hitBricks.jpg', 
                query: "from=group",
                success:(res)=>{
                    CHD.tipNum += 1;
                    self.tipNumTxt.string = CHD.tipNum;
                }
            });
        }
    }

    // update (dt) {},
});

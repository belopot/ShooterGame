cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.scale = 1;
        this.runScale();
    },
    runScale(){

        let seq = cc.sequence(
            cc.scaleTo(0.5, 1.5),
            cc.scaleTo(0.5, 1)
        );
        this.node.runAction(cc.repeatForever(seq));
    }
});

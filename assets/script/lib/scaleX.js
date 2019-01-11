cc.Class({
    extends: cc.Component,

    properties: {
        scaleType: 1
    },


    onLoad () {
        var screenSize = cc.sys.windowPixelResolution;
        let rX;
        if (this.scaleType == -1) {
            rX = screenSize.height / screenSize.width  / 1.775;
        } else {
            rX = screenSize.width / screenSize.height / 0.5633;
        }
        this.node.scaleX = rX;
    },

    start () {

    },

    // update (dt) {},
});

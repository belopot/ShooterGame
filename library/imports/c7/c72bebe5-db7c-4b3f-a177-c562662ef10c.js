"use strict";
cc._RF.push(module, 'c72bevl23xLP6F3xWJmLvEM', 'scaleY');
// script/lib/scaleY.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var screenSize = cc.sys.windowPixelResolution;
        var rY = screenSize.width / screenSize.height * 1.775;
        this.node.scaleY = rY;
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();
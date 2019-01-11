"use strict";
cc._RF.push(module, '254a2WRI+hLLK2UbDVSvz52', 'scaleX');
// script/lib/scaleX.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        scaleType: 1
    },

    onLoad: function onLoad() {
        var screenSize = cc.sys.windowPixelResolution;
        var rX = void 0;
        if (this.scaleType == -1) {
            rX = screenSize.height / screenSize.width / 1.775;
        } else {
            rX = screenSize.width / screenSize.height / 0.5633;
        }
        this.node.scaleX = rX;
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();
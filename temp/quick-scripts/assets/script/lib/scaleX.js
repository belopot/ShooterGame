(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/lib/scaleX.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '254a2WRI+hLLK2UbDVSvz52', 'scaleX', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=scaleX.js.map
        
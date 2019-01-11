(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/bulletGroup.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd628fi8wPlIk4bUWlqKKvfX', 'bulletGroup', __filename);
// script/game/bulletGroup.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        cBullet: cc.Node,
        rBullet: cc.Node,
        lBullet: cc.Node
    },

    init: function init(count) {
        if (count === 1) {
            this.cBullet.setPosition(0, 0);
            this.cBullet.active = true;

            this.rBullet.active = false;
            this.lBullet.active = false;
        } else if (count === 2) {
            this.cBullet.active = true;
            this.rBullet.active = true;
            this.lBullet.active = false;

            this.cBullet.setPosition(0, 0);
            this.rBullet.setPosition(0, 0);
            this.cBullet.runAction(cc.moveTo(0.02, -22, 50));
            this.rBullet.runAction(cc.moveTo(0.02, 22, 50));
        } else {
            this.cBullet.active = true;
            this.rBullet.active = true;
            this.lBullet.active = true;

            this.cBullet.setPosition(0, 0);
            this.rBullet.setPosition(0, 0);
            this.lBullet.setPosition(0, 0);
            this.cBullet.runAction(cc.moveTo(0.02, 0, 50));
            this.rBullet.runAction(cc.moveTo(0.02, 44, 50));
            this.lBullet.runAction(cc.moveTo(0.02, -44, 50));
        }
    }
});

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
        //# sourceMappingURL=bulletGroup.js.map
        
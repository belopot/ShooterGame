(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/home/overLay.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd453ap59eZMh46EN+kRsAwa', 'overLay', __filename);
// script/home/overLay.js

'use strict';

var CHD = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {
        overBtn: cc.Node,
        closeBtn: cc.Node,
        closeHover: cc.Node,

        tipNumTxt: cc.Label
    },

    // onLoad () {},

    start: function start() {
        this.tipNumTxt.string = CHD.tipNum;
        this.closeBtn.on('touchstart', function (event) {
            this.closeHover.active = true;
        }, this);
        this.closeBtn.on('touchend', function (event) {
            this.closeHover.active = false;
            this.node.active = false;
        }, this);
        this.closeBtn.on('touchcancel', function (event) {
            this.closeHover.active = false;
        }, this);

        this.overBtn.on('touchstart', function () {
            this.overBtn.getChildByName('cover').active = true;
        }, this);
        this.overBtn.on('touchend', function () {
            this.overBtn.getChildByName('cover').active = false;
            this.invite();
        }, this);
        this.overBtn.on('touchcancel', function () {
            this.overBtn.getChildByName('cover').active = false;
        }, this);

        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        }, this);
    },
    invite: function invite() {
        var self = this;
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: 'hitBricks',
                imageUrl: 'res/raw-assets/resources/hitBricks.jpg',
                query: "from=group",
                success: function success(res) {
                    CHD.tipNum += 1;
                    self.tipNumTxt.string = CHD.tipNum;
                }
            });
        }
    }

    // update (dt) {},

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
        //# sourceMappingURL=overLay.js.map
        
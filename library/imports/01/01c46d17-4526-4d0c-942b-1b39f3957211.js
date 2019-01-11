"use strict";
cc._RF.push(module, '01c460XRSZNDJQrGznzlXIR', 'rankView');
// script/rank/rankView.js

'use strict';

var CHD = require("commonHandler");
cc.Class({
    extends: cc.Component,

    properties: {
        subCanvas: {
            default: null,
            type: cc.Sprite
        },
        returnBtn: {
            default: null,
            type: cc.Node
        },
        friendBtn: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {
        if (window.wx != undefined) {
            window.wx.showShareMenu({ withShareTicket: true });
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1080;
            window.sharedCanvas.height = 1920;
        }

        this.returnBtn.on('touchstart', function () {
            this.returnBtn.getChildByName('cover').active = true;
        }, this);
        this.returnBtn.on('touchend', function () {
            this.returnBtn.getChildByName('cover').active = false;
            cc.director.loadScene('home');
        }, this);
        this.returnBtn.on('touchcancel', function () {
            this.returnBtn.getChildByName('cover').active = false;
        }, this);

        this.friendBtn.on('touchstart', function () {
            this.friendBtn.getChildByName('cover').active = true;
        }, this);
        this.friendBtn.on('touchend', function () {
            this.friendBtn.getChildByName('cover').active = false;
            CHD.shareAppMessage('hitBricks', 'hitBricks.jpg');
        }, this);
        this.friendBtn.on('touchcancel', function () {
            this.friendBtn.getChildByName('cover').active = false;
        }, this);

        // this.node.on('touchstart', function(event){
        //     event.stopPropagation();
        // }, this);
    },
    _updateSubCanvas: function _updateSubCanvas() {
        if (window.sharedCanvas != undefined && this.tex) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.subCanvas.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update: function update() {
        this._updateSubCanvas();
    },
    onEnable: function onEnable() {
        CHD.rankList("rank");
    }
});

cc._RF.pop();
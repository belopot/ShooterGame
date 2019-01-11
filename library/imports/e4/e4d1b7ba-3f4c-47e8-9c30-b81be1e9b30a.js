"use strict";
cc._RF.push(module, 'e4d1be6P0xH6JwwuBvh6bMK', 'gameOver');
// script/gameOver/gameOver.js

"use strict";

var CHD = require("commonHandler");
var GameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        subCanvas: {
            default: null,
            type: cc.Sprite
        },
        gameNode: cc.Node,
        rankViewNode: cc.Node,
        againBtn: cc.Node,
        homeBtn: cc.Node,
        shareBtn: cc.Node,
        maxScoreLabel: cc.Label,
        scoreLabel: cc.Label,
        groupBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        if (window.wx != undefined) {
            window.wx.showShareMenu({ withShareTicket: true });
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1080;
            window.sharedCanvas.height = 1920;
        }

        this.againBtn.on('touchstart', function () {
            this.againBtn.getChildByName('cover').active = true;
        }, this);
        this.againBtn.on('touchend', function () {
            this.againBtn.getChildByName('cover').active = false;
            cc.director.loadScene('game');
        }, this);
        this.againBtn.on('touchcancel', function () {
            this.againBtn.getChildByName('cover').active = false;
        }, this);

        this.homeBtn.on('touchstart', function () {
            this.homeBtn.getChildByName('cover').active = true;
        }, this);
        this.homeBtn.on('touchend', function () {
            this.homeBtn.getChildByName('cover').active = false;
            cc.director.loadScene('home');
        }, this);
        this.homeBtn.on('touchcancel', function () {
            this.homeBtn.getChildByName('cover').active = false;
        }, this);

        this.shareBtn.on('touchstart', function () {
            this.shareBtn.getChildByName('cover').active = true;
        }, this);
        this.shareBtn.on('touchend', function () {
            this.shareBtn.getChildByName('cover').active = false;
            CHD.shareAppMessage('hitBricks', 'hitBricks.jpg');
        }, this);
        this.shareBtn.on('touchcancel', function () {
            this.shareBtn.getChildByName('cover').active = false;
        }, this);

        // this.node.on('touchstart', function(event){
        //     event.stopPropagation();
        // }, this);
        this.init();
    },
    init: function init() {
        this.setScore();
        this.againBtn.y = -340;
        this.groupBtn.y = -430;
        this.runEffect();
    },
    runEffect: function runEffect() {
        this.againBtn.stopAllActions();
        this.againBtn.runAction(cc.sequence(cc.moveTo(0.2, 0, -49), cc.moveTo(0.05, 0, -10), cc.moveTo(0.07, 0, -49)));

        this.groupBtn.stopAllActions();
        this.groupBtn.runAction(cc.sequence(cc.moveTo(0.15, 0, -280), cc.moveTo(0.05, 0, -255), cc.moveTo(0.07, 0, -280)));
    },
    setScore: function setScore() {
        var maxScore = CHD.getMaxScore();
        var score = GameData.score;
        if (maxScore < score) {
            maxScore = score;
            // CHD.rankList("gameOver", maxScore);
            CHD.setMaxScore(score);
        }
        // else{
        //     CHD.rankList("gameOver");
        // }

        this.maxScoreLabel.string = "本局得分: " + this.convertNum(score);
        this.scoreLabel.string = "历史最高: " + this.convertNum(maxScore);
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
        // this.setScore();
        // console.log('ranklist');
        CHD.rankList("gameOver");
    },
    convertNum: function convertNum(num) {
        if (num < 0) return 0;
        if (num >= 1000) {
            return Math.round(num / 10) / 100 + 'K';
        }
        return num;
    }
});

cc._RF.pop();
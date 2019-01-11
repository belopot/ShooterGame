"use strict";
cc._RF.push(module, '071ff3ZL7dMFpikrODHjwsY', 'endBlock');
// script/game/endBlock.js

'use strict';

// var CHD = require("commonHandler");
var GameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        lblVal: cc.Label,
        deadAudio: cc.AudioClip
    },

    start: function start() {
        this.node.on('explore', function () {
            this.explore();
        }, this);
    },
    update: function update(dt) {
        if (this.node.parent.y + this.node.y < GameData.endLine) {
            this.node.removeFromParent();
        }
    },
    onCollisionEnter: function onCollisionEnter(other, self) {
        // if(self.node.parent == null) return;
        if (GameData.exploreALL) return;
        if (other.node.name == 'cbullet' || other.node.name == 'rbullet' || other.node.name == 'lbullet') {
            if (this._isSound) {
                cc.audioEngine.play(this.deadAudio, false, 0.5);
            }
            other.node.active = false;

            GameData.score += this._value;
            GameData.game.changeScoreView();
            // self.node.parent.parent.emit('changedScore');
            this.explore();
            // this.node.emit('explore');
        }
    },
    init: function init(val) {
        this._isSound = GameData.isSound;
        this._value = val;
        var txtVal = val;
        if (txtVal >= 1000) {
            txtVal = Math.round(txtVal / 10) / 100 + 'K';
        }
        this.lblVal.string = txtVal;
    },
    explore: function explore() {
        var _this = this;

        this.node.active = false;
        if (GameData.blastPool.size() > 0) {
            var blast = GameData.blastPool.get();
            blast.setPosition(this.node.x, this.node.y);
            blast.parent = this.node.parent;

            var color = new cc.Color(250, 206, 0);
            blast.getComponent(cc.ParticleSystem).startColor = color;
            blast.getComponent(cc.ParticleSystem).endColor = color;

            blast.getComponent(cc.ParticleSystem).resetSystem();
            this.scheduleOnce(function () {
                GameData.blastPool.put(blast);
                _this.node.removeFromParent();
            }, 0.8);
        }
    }
});

cc._RF.pop();
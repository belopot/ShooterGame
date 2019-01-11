(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game/block.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e7d0974x19JXpWRfDc9wC/w', 'block', __filename);
// script/game/block.js

'use strict';

// var CHD = require("commonHandler");
var GameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        lblVal: cc.Label,
        hitAudio: cc.AudioClip,
        deadAudio: cc.AudioClip
    },
    start: function start() {
        this.node.on('explore', function () {
            this.explore();
        }, this);
        this.node.on('playHit', function () {
            if (!this._isSound) return;
            cc.audioEngine.play(this.hitAudio, false, 0.6);
        }, this);
        this.node.on('playDead', function () {
            if (!this._isSound) return;
            cc.audioEngine.play(this.deadAudio, false, 0.5);
        }, this);
    },
    update: function update(dt) {
        if (this.node.parent.y + this.node.y < GameData.endLine - 50) {
            if (this.node.name == 'block') {
                GameData.blockPool.put(this.node);
            } else {
                this.node.removeFromParent();
            }
        }
    },
    onCollisionEnter: function onCollisionEnter(other, self) {
        // if(this.node.parent == null) return;
        if (GameData.exploreALL) return;
        if (other.node.name == 'cbullet' || other.node.name == 'rbullet' || other.node.name == 'lbullet') {
            other.node.active = false;

            var decreaseN = GameData.bulletPower;
            if (GameData.bulletSpeed > 15) {
                decreaseN += GameData.bulletSpeed - 15;
            }

            var cVal = this._value - decreaseN;

            if (cVal <= 0) {
                GameData.score += this._value;
                GameData.game.changeScoreView();
                this.node.emit('playDead');
                if (this.node.name == 'starBlock') {
                    this.node.active = false;
                    // GameData.exploreALL = true;
                    GameData.game.exploreAllBlocks();
                } else {
                    this.explore();
                    // this.node.emit('explore');
                }
            } else {
                GameData.score += decreaseN;
                GameData.game.changeScoreView();
                if (this.audioCount >= this.audioSkip) {
                    this.node.emit('playHit');
                    this.audioCount = 0;
                } else {
                    this.audioCount += 1;
                }

                var rate = cVal / this._value;
                var R = this._color[0];
                var G = this._color[1];
                var B = this._color[2];
                if (R < 200) {
                    R = 205;
                    G = 25;
                    B = 25;
                }
                this.changeColor(rate * (R - 255) + 255, rate * (G - 200) + 200, rate * B);
                this.changeValue(cVal);
            }
        }
    },
    init: function init(val, rColor, gColor, bColor) {
        this._isSound = GameData.isSound;
        this.changeValue(val);
        this._initColor = new cc.Color(rColor, gColor, bColor);
        this.changeColor(rColor, gColor, bColor);
        this.audioSkip = GameData.bulletMulti - 1;
        if (GameData.bulletSpeed > 8) this.audioSkip += 4;
        this.audioCount = 0;
    },
    getValue: function getValue() {
        return this._value;
    },
    changeValue: function changeValue(val) {
        this._value = val;
        var txtVal = val;
        if (txtVal >= 1000) {
            txtVal = Math.round(txtVal / 10) / 100 + 'K';
        }
        this.lblVal.string = txtVal;
    },
    changeColor: function changeColor(rColor, gColor, bColor) {
        this._color = [rColor, gColor, bColor];
        this.node.color = new cc.Color(rColor, gColor, bColor);
    },
    explore: function explore() {
        // console.log('block Expore');
        var self = this;
        this.node.active = false;
        if (GameData.blastPool.size() > 0) {
            var blast = GameData.blastPool.get();
            blast.setPosition(this.node.x, this.node.y);
            blast.parent = this.node.parent;
            blast.getComponent(cc.ParticleSystem).startColor = this._initColor;
            blast.getComponent(cc.ParticleSystem).endColor = this._initColor;

            blast.getComponent(cc.ParticleSystem).resetSystem();
            this.scheduleOnce(function () {
                GameData.blastPool.put(blast);
                self.removeSelf();
            }, 0.8);
        } else {
            self.removeSelf();
        }
    },
    removeSelf: function removeSelf() {
        if (this.node.name == 'block') {
            GameData.blockPool.put(this.node);
        } else {
            this.node.removeFromParent();
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
        //# sourceMappingURL=block.js.map
        
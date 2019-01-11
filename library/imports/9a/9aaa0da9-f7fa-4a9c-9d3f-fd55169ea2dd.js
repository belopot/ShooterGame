"use strict";
cc._RF.push(module, '9aaa02p9/pKnJ0//VUWnqLd', 'sound');
// script/home/sound.js

"use strict";

var CHD = require("commonHandler");
var GameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        soundOFF: cc.Node
    },

    start: function start() {
        this.node.on('touchstart', function () {
            if (GameData.isSound) {
                this.soundOFF.active = true;
                CHD.setSoundStatus(false);
                GameData.isSound = false;
            } else {
                this.soundOFF.active = false;
                CHD.setSoundStatus(true);
                GameData.isSound = true;
            }
        }, this);

        this.init();
    },
    init: function init() {
        if (GameData.isSound) {
            this.soundOFF.active = false;
        } else {
            this.soundOFF.active = true;
        }
    }

    // update (dt) {},

});

cc._RF.pop();
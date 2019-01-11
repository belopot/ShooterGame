(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/commonHandler.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f3c1fMj84lJfLwTDv6gTG8I', 'commonHandler', __filename);
// script/commonHandler.js

'use strict';

var commonHandler = {
    // tipNum:0,
    // isSound: true,
    hitMaxScore: 0,
    // score:0,
    // blockDropSpeed:4,

    // bulletSpeed:4,
    // bulletPower:6,
    // bulletMulti:1,

    // // bulletGroupPool:null,
    // blistPool:null,
    // blockListPool:null,
    // blastPool:null,

    // centerLine:0,
    // actorLine:0,
    // endLine:0,

    // cursorXPos:0,
    // jumpMove:0,
    // collideStatus:[0,0],
    // rocketStatus:0,


    // revertNum(strNum){
    //     strNum = String(strNum);
    //     if(strNum.search('K') > 0){
    //         return Number(strNum.substr(0, strNum.length -1))*1000;
    //     }
    //     return Number(strNum);
    // },

    setSoundStatus: function setSoundStatus(status) {
        if (status) {
            cc.sys.localStorage.setItem('isSound', 'on');
        } else {
            cc.sys.localStorage.setItem('isSound', 'off');
        }
        // this.isSound = status;
    },
    getMaxScore: function getMaxScore() {
        return this.hitMaxScore;
    },
    setMaxScore: function setMaxScore(score) {
        this.hitMaxScore = score;
        cc.sys.localStorage.setItem('hitMaxScore', score);
        // this.submitScore(score);
    },
    setInitValue: function setInitValue(gameData) {
        var str1 = cc.sys.localStorage.getItem('isSound');
        if (str1 == 'on') {
            gameData.isSound = true;
        } else if (str1 == 'off') {
            gameData.isSound = false;
        }
        this.hitMaxScore = parseInt(cc.sys.localStorage.getItem('hitMaxScore'));
        // this.setMaxScore(0);
    },
    shareAppMessage: function shareAppMessage(title, shareImg) {
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: title,
                imageUrl: 'res/raw-assets/resources/' + shareImg,
                query: "from=group"
            });
        }
    },

    // submitScore(){
    //     // cc.log('submitScore:  '+score);
    //     if (window.wx != undefined) {
    //         window.wx.postMessage({
    //             messageType: "sendScore",
    //             score: this.score
    //         });
    //     } else {
    //         cc.log("fail: x_total : " + this.score)
    //     }
    // },
    rankList: function rankList(vType) {
        if (window.wx != undefined) {
            window.wx.postMessage({
                messageType: "rankList",
                viewType: vType
            });
        } else {
            cc.log("fail rank list:");
        }
    }
};
module.exports = commonHandler;

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
        //# sourceMappingURL=commonHandler.js.map
        
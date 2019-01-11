
var commonHandler = {
    // tipNum:0,
    // isSound: true,
    hitMaxScore:0,
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
   
    setSoundStatus(status) {
        if (status) {
            cc.sys.localStorage.setItem('isSound', 'on');
        } else {
            cc.sys.localStorage.setItem('isSound', 'off');
        }
        // this.isSound = status;
    },
    getMaxScore() {
        return this.hitMaxScore;
    },
    setMaxScore(score) {
        this.hitMaxScore = score;
        cc.sys.localStorage.setItem('hitMaxScore', score); 
        // this.submitScore(score);
    },
    setInitValue(gameData) {
        let str1 = cc.sys.localStorage.getItem('isSound');
        if (str1 == 'on') {
            gameData.isSound = true;
        } else if (str1 == 'off') {
            gameData.isSound = false;
        }
        this.hitMaxScore = parseInt(cc.sys.localStorage.getItem('hitMaxScore'));
        // this.setMaxScore(0);
    },

    shareAppMessage(title, shareImg) {
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
    rankList(vType) {
        if (window.wx != undefined) {
            window.wx.postMessage({
                messageType: "rankList",
                viewType:vType,
            });
        } else {
            cc.log("fail rank list:");
        }
    },

    // groupRankList() {
    //     if (window.wx != undefined) {                
    //         window.wx.shareAppMessage({
    //             success: (res) => {
    //                 if (res.shareTickets != undefined && res.shareTickets.length > 0) {
    //                     window.wx.postMessage({
    //                         messageType: 'groupList',
    //                         shareTicket: res.shareTickets[0]
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // },
};
module.exports = commonHandler;
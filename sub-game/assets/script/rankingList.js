cc.Class({
    extends: cc.Component,

    properties: {
        rankItemPrefab: cc.Prefab,
        content: cc.Node,
        rankListLayout: cc.Node,
    },
    onLoad() {
        this.rankData = [];
        this.displayCnt = 6;
    },

    start() {
        
        this.removeChild();
        var dataKey = "shootbrickskey";
        if (window.wx != undefined) {
            window.wx.onMessage(data => {
                cc.log("Message：", data)
                this.content.active = false;
                if (data.messageType == 0) {
                    this.removeChild();
                } else if (data.messageType == "rankList") {
                    this._vType = data.viewType;
                    this.rankListLayout.active = true;
                    this.fetchFriendData(dataKey, 'list');
                } else if (data.messageType == "sendScore") {
                    this.submitScore(dataKey, data.score);
                } else if (data.messageType == 'groupList') {
                    this.rankListLayout.active = true;
                    this.fetchGroupData(dataKey, data.shareTicket);
                }
            });
        } else {
            // this.fetchFriendData(1000);
            this.testData();
        }

        this.displayRank(this.rankData, 6);

    },
    submitScore(key, score) { 
        // var self = this;
        if (window.wx != undefined) {
            window.wx.getUserCloudStorage({
                keyList: [key],
                success: function (getres) {
                    // console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        if (getres.KVDataList[0].value > score) {
                            // self.fetchFriendData(key, 'list');
                            return;
                        }
                    }
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: key, value: "" + score}],
                        success: function (res) {
                        //     console.log('setUserCloudStorage', 'success', res);                            
                            // self.fetchFriendData(key, 'list');
                        },
                        // fail: function (res) {
                        //     console.log('setUserCloudStorage', 'fail')
                        // },
                        // complete: function (res) {
                        //     console.log('setUserCloudStorage', 'ok')
                        // }
                    });
                }//,
                // fail: function (res) {
                //     console.log('getUserCloudStorage', 'fail')
                // },
                // complete: function (res) {
                //     console.log('getUserCloudStorage', 'ok')
                // }
            });
        } else {
            cc.log("error:" + key + " : " + score)
        }
    },
    removeChild() {
        this.content.removeAllChildren();
        // this.topContent.removeAllChildren();
    },
    fetchFriendData(key, type) {
        console.log('showRanking');
        // this.removeChild();
        let self = this;
        
        if (window.wx != undefined) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    // console.log('success', userRes.data)
                    self._userData = userRes.data[0];
                    wx.getFriendCloudStorage({
                        keyList: [key],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;                        
                            });
                            this.rankData = data;
                            this.displayRank(this.rankData, this.displayCnt);
                        },
                        fail: res => {
                            // console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                },
                fail: (res) => {
                    // this.loadingLabel.getComponent(cc.Label).string = "Test。";
                }
            });
        }
    },

    fetchGroupData(key, shareTicket) {
        this.removeChild();
        // this.content.active = true;
        if (window.wx != undefined) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    // console.log('success', userRes.data)
                    self._userData = userRes.data[0];
                    wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [key],
                        success: res => {
                            // console.log("wx.getGroupCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;                        
                            });
                            this.rankData = data;
                            this.displayRank(this.rankData, this.displayCnt);
                        },
                        fail: res => {
                            // console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                },
                fail: (res) => {
                    // this.loadingLabel.getComponent(cc.Label).string = "Test。";
                }
            });
        }
    },

    displayRank(data, cnt) {
        this.removeChild();
        var nStep = 0;
        var nH = 220;
        var startY = -80;
        let n1 = 3, n2 = 4;
        if(this._vType == 'gameOver'){
            startY = -300;
            n2 = 3;
        }
        
        n2 = data.length > n2 ? n2: data.length;

        var isSelf = false;

        for (let i = 0 ; i < n2; i++) {
            var isUser = false;
            var playerInfo = data[i];
            if(playerInfo.avatarUrl == this._userData.avatarUrl){
                isSelf = true;
                isUser = true;
                if(this._vType == 'rank'){
                    this.addUserRank(i, playerInfo);
                }
            }
            var item = cc.instantiate(this.rankItemPrefab);
            this.content.addChild(item);
            item.getComponent('rankItem').init(i, playerInfo, isUser);
            item.setPositionY(-nStep * nH + startY);
            nStep ++;
        }
        
        if(!isSelf && this._vType == 'rank'){
            for (let i = 0 ; i < data.length; i++) {
                var playerInfo = data[i];
                if(playerInfo.avatarUrl == this._userData.avatarUrl){
                    this.addUserRank(i, playerInfo);
                    return;
                }
            }
        }
        this.content.active = true;
    },
    addUserRank(order, playerInfo){
        var item = cc.instantiate(this.rankItemPrefab);
        this.content.addChild(item);
        item.getComponent('rankItem').init(order, playerInfo, true);

        item.setPositionY(-this.content.height+140);
    },
    testData() {
        var data = [];
        for (var i = 0; i < 5; i++) {
            var tmp = {};
            tmp.avatarUrl = "/resources/close_red.png";
            tmp.KVDataList = [{value: i}];
            tmp.nickname = "AAAAAA";
            data.push(tmp);
        }
        // #F3E800
        this.rankData = data;
    },

    testFun() {
        // window.wx.chooseAddress({
        //     success: function(res) {
        //         console.log(JSON.stringify(res));
        //     },
        //     fail: function(err) {
        //         console.log('fail');
        //     }
        // })
    }
});

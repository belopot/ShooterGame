cc.Class({
    extends: cc.Component,
    properties: {
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        avatarGroup: cc.Node,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
        userBG:cc.Node,
        //,
        // graphicsNode: cc.Graphics
    },
    onLoad() {
    },
    start() {

    },

    init: function (rank, data, isSelf) {
        let color;
        if(isSelf){
            this.userBG.active = true;
            this.rankLabel.node.color = new cc.Color(233, 191,0);
            this.nickLabel.node.color = new cc.Color(255, 255, 255);
            this.topScoreLabel.node.color = new cc.Color(255, 255, 255);
        }
        let avatarUrl = data.avatarUrl;        
        let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        // if (this.node.name == 'topRank') {
        //         var g = this.graphicsNode;
        //         if (g != null) {
        //             let scale = 1;
        //             if (rank == 0) {
        //                 color = cc.hexToColor('#F3E800');
        //                 scale = 1.2;
        //             }
        //             if (rank == 1) {
        //                 color = cc.hexToColor('#F68500');
        //                 scale = 1.05;
        //             }
        //             if (rank == 2) {
        //                 color = cc.hexToColor('#A263E6');
        //             }
        //             g.fillColor = color;
                    
        //             g.circle(0, 0, 13);
        //             g.fill();
        //             g.close();
        //             this.avatarGroup.scale = scale;
        //         }
        // }
        this.rankLabel.string = (rank + 1).toString();
        this.createImage(avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = grade.toString();
    },
    createImage(avatarUrl) {
        if (window.wx != undefined) {
            if (avatarUrl == "") {
                this.avatarImgSprite.node.active = false;
                return;
            }
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                cc.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

});

// var CHD = require("commonHandler");
var GameData = require("gameData");

cc.Class({
    extends: cc.Component,

    properties: {
        bulletGroupPrefab:cc.Prefab,
        bonusNode:cc.Node,
        speedLbl:cc.Label,
        powerLbl:cc.Label,
        gameBox:cc.Node,
        fireAudio:cc.AudioClip,
        bonusAudio:cc.AudioClip,
        deadAudio:cc.AudioClip
    },

    onLoad () {
        this.bulletGroupPool = new cc.NodePool();
        for (let i = 0; i < 20; ++i) {
            let bullet = cc.instantiate(this.bulletGroupPrefab);
            this.bulletGroupPool.put(bullet);
        }
    },
   
    start () {
        this.init();
        this.node.on('runShoot', this.shooting, this);
        // this.node.on('startRocket', this.startRocketing, this);
        this.node.on('stoped', this.stopPlay, this);

        this.node.on('playDead', function(){
            if(!this._isSound) return;
            cc.audioEngine.play(this.deadAudio, false, 1);
        }, this)
        this.node.on('playBonus', function(){
            if(!this._isSound) return;
            cc.audioEngine.play(this.bonusAudio, false, 1);
        }, this);
    },
    init(){
        this._isSound = GameData.isSound;
        this._bAudiocount = 0;
        this.skipCount = 1;
        this.count = 0;
        this.rocketing = false;
        this.isStoped = false;
        this.node.active = true;
        this.node.x = 0;
        this._moveDir = 0;
        if(GameData.tipNum > 0){
            GameData.tipNum -= 1;
            GameData.bulletMulti = 2;
        }
    },
    update (dt) {
        if(this.isStoped || GameData.rocketStatus) return;
        this.node.emit('runShoot');
    },
    shooting() {
        this.count += 1;
        let speed = GameData.bulletSpeed;

        if(speed > 15){
            speed = 15;
        }
        if (this.count % parseInt(60 / speed) === 0) {
            this.createBullet();
            if(this._bAudiocount >= this.skipCount && this._isSound){
                cc.audioEngine.play(this.fireAudio, false, 1);
                this._bAudiocount = 0;
            }else{
                this._bAudiocount += 1;
            }
        }
        
        if (this.count >= 600) this.count = 0;
    },
    createBullet() {
        let bulletGroup = null;

        if (this.bulletGroupPool.size() > 0) {
            bulletGroup = this.bulletGroupPool.get();
        } else {
            bulletGroup = cc.instantiate(this.bulletGroupPrefab);
        }
        
        bulletGroup.setPosition(this.node.x, this.node.y + this.node.height / 2);
        bulletGroup.parent = this.gameBox;
        bulletGroup.getComponent('bulletGroup').init(GameData.bulletMulti);

        bulletGroup.runAction(cc.sequence(
            cc.delayTime(0.02),
            cc.moveTo(0.5, bulletGroup.x, this.gameBox.height/2),
            cc.callFunc(function(){
                this.bulletGroupPool.put(bulletGroup);
            }, this)
        ));

    },
    onCollisionEnter(other, self) {
        let otherName = other.node.name;
        if(otherName == 'fast'){
            this.node.emit('playBonus');
            other.node.removeFromParent();
            GameData.bulletSpeed += 2;
            this.speedLbl.string = '射速:  ' + GameData.bulletSpeed;
            this.showBonusView();
            if(GameData.bulletSpeed > 8){
                this.skipCount = 2;
            }
        }else if(otherName == 'forceful'){
            this.node.emit('playBonus');
            other.node.removeFromParent();
            GameData.bulletPower += 2;
            this.powerLbl.string = '威力:  ' + GameData.bulletPower;
            this.showBonusView();
        }else if(otherName == 'double'){
            this.node.emit('playBonus');
            other.node.removeFromParent();
            if(GameData.bulletMulti < 3){
                GameData.bulletMulti += 1;
            }
        }else if(otherName == 'rocket'){
            other.node.removeFromParent();
            if(GameData.rocketStatus) return;
            // this.node.emit('playBonus');
            GameData.game.setRockect();
            // this.node.parent.emit('startRocket');
        }else if(otherName == 'endBlock'){
            other.node.getComponent('endBlock').explore();
        }else if(otherName == 'block' || otherName == 'starBlock'){
            GameData.jumpMove = 0;
            
            if(GameData.rocketStatus){
                this.node.emit('playDead');
                let _label = other.node.getComponent('block').getValue();
                GameData.score += _label;
                other.node.getComponent('block').explore();
                this.gameBox.emit('changedScore');
            }else{
                var deltaX = self.node.x - (other.node.x - this.gameBox.width/2);
                var absDeltaX = Math.abs(deltaX);
                var deltaY = other.node.parent.y + other.node.y - this.node.y;

                if(absDeltaX < 168 && deltaY > 0.8*(other.node.height + this.node.height)/2){
                    this.node.emit('stoped');
                    return;
                }

                var direction = deltaX/absDeltaX;
                GameData.collideStatus = [GameData.collideStatus[0]+1, direction];

                if(absDeltaX < 178){
                    self.node.x += direction*(178 - absDeltaX); 
                }
            }
        }
    },
    onCollisionExit: function (other, self) {
        if(this.isStoped) return;

        if(other.node.name == 'block' || other.node.name == 'starBlock'){
            GameData.collideStatus[0] -= 1;

            let deltaW = GameData.cursorXPos - this.node.x;
            if(deltaW == 0 || GameData.collideStatus[0] > 0) return;
            
            let predictPos = 5000;
            let actorWPos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());

            let childs = this.gameBox.children;
            for(let index in childs){
                let child = childs[index];
                if(child.name == 'blockList' || child.name == 'specList'){
                    let subChilds = child.children;
                    for(let sIndex in subChilds){
                        let subChild = subChilds[sIndex];
                        if(subChild.name == 'blast') continue;

                        let blockWPos = subChild.parent.convertToWorldSpaceAR(subChild.getPosition());
                        let deltaX = blockWPos.x - actorWPos.x;
                        let deltaY = blockWPos.y - actorWPos.y;
                        let minH = subChild.height/2;
                        let minw = (subChild.width + this.node.width)/2;
                        
                        let isEqDir = deltaX*deltaW;

                        if(Math.abs(deltaY) < minH && isEqDir > 0){
                            if(deltaX >0 && deltaX < deltaW){
                                deltaW = deltaX;
                                predictPos = subChild.x - minw;
                            }else if(deltaX < 0 && deltaX > deltaW){
                                deltaW = deltaX;
                                predictPos = subChild.x + minw;
                            }
                        }
                    }
                }
            }

            if(predictPos === 5000){
                this.node.x = GameData.cursorXPos;
            }else{
                let realPos = predictPos - this.gameBox.width/2
                GameData.jumpMove = 1;
                this.node.x = realPos;
            }
        }        
    },
    stopPlay(){
        this.isStoped = true;
        GameData.game.pauseGame();
        // this.node.parent.getComponent('game').pauseGame();
    },
    showBonusView(){
        this.bonusNode.stopAllActions();
        this.bonusNode.runAction(cc.sequence(
            cc.moveTo(0.2, -540, this.bonusNode.y), 
            cc.delayTime(0.7), 
            cc.moveTo(0.2, -710, this.bonusNode.y)
        ));
    }
});

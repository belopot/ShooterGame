// var CHD = require("commonHandler");
var GameData = require("gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        continueNode:cc.Node,
        player:cc.Node,
        scoreView:cc.Node,

        gameBox:cc.Node,
        continueBtn:cc.Node,

        // bulletGroupPrefab:cc.Prefab,
        blastPrefab:cc.Prefab,
        failBlastPrefab:cc.Prefab,

        blockPrefab:cc.Prefab,
        endBlockPrefab:cc.Prefab,
        starBlockPrefab:cc.Prefab,
        blockListPrefab:cc.Prefab,
        specListPrefab:cc.Prefab,

        fastPrefab: cc.Prefab,
        powerPrefab: cc.Prefab,
        doublePrefab: cc.Prefab,
        rocketPrefab: cc.Prefab
    },

    onLoad () {
        // GameData.bulletGroupPool = new cc.NodePool();
        GameData.game = this;
        GameData.blockPool = new cc.NodePool();
        GameData.blastPool = new cc.NodePool();
        this.makePools();
        cc.director.getCollisionManager().enabled = true;
        
        this.soundStatus = GameData.isSound;
    },
    makePools(){
            console.log('make pool');
            // for (let i = 0; i < 20; ++i) {
            //     let bullet = cc.instantiate(this.bulletGroupPrefab);
            //     GameData.bulletGroupPool.put(bullet);
            // }
        
            for (let i = 0; i < 50; ++i) {
                let block = cc.instantiate(this.blockPrefab);
                GameData.blockPool.put(block);
            }
        
            for (let i = 0; i < 10 ; ++i) {
                let blast = cc.instantiate(this.blastPrefab);
                blast.getComponent(cc.ParticleSystem).stopSystem();
                GameData.blastPool.put(blast);
            }
    },
    start () {
        let self = this;
        self._delayTime = 0;

        this.gameBox.on('touchstart', this.moveCursor,  this);
        this.gameBox.on('touchmove', this.moveCursor, this);

        this.gameBox.on('passedCenterLine', function(){
            self.createBonus();
        }, this);
        this.gameBox.on('passedActorLine', function(){
            self.scheduleOnce(function(){
                self.createNextBlock();
                self._delayTime =  0;
            },  self._delayTime);
        }, this);

        // this.gameBox.on('changedScore', function(){
        //     self.changeScoreView();
        // }, this);

        // this.gameBox.on('exploreALL', function(){
        //     if(this.exploreStatus) return;
        //     this.exploreStatus = true;
        //     self.exploreAllBlocks();
        // }, this);

        this.continueBtn.on('touchstart', function(){
            if(self._isInvite) return;
            self.invite();
        });

        // this.node.on('startRocket', function(){
        //     self.setRockect();
        // }, this);
        this.init();
    },
    init() {
        GameData.jumpMove = 0;
        GameData.centerLine = (this.gameBox.height/2 + this.player.y)/2+300;
        GameData.actorLine = this.player.y+this.player.height;
        GameData.endLine = -this.gameBox.height/2;
        GameData.collideStatus = [0,0];
        GameData.bulletSpeed = 4;
        GameData.bulletPower = 6;
        GameData.bulletMulti = 1;
        GameData.score = 0;
        this._isInvite = false;
        this.level = 1;
        this.levelInCount = 9;
        this.levelInNum = 0;
        this.blockValInLevel = 10;
        this._delayTime = 0;
        this._gameOver = false;

        this._bw = this.gameBox.width/5;

        GameData.cursorXPos = 0;

        this.removeAllChilds();

        this.isPaused = false;
        this.player.getComponent('player').init();
        this.firstBlockGroup();
    },
    createBonus(){
        if(this.isPaused) return;
        this.createRandBlocks();
        
        let type = parseInt(12*Math.random());
        if(type !== 4 || this.level < 2){
            if(GameData.bulletMulti == 3){
                type = parseInt(2 * Math.random()) + 1;
            }else{
                type = parseInt(3 * Math.random()) + 1;
            }
        }
        let newProp = null;
        switch (type) {
            case 1:
                newProp = cc.instantiate(this.fastPrefab);
                break;
            case 2:
                newProp = cc.instantiate(this.powerPrefab);
                break;
            case 3:
                newProp = cc.instantiate(this.doublePrefab);
                break;
            case 4:
                newProp = cc.instantiate(this.rocketPrefab);
                break;
        }
        let range = this.gameBox.width - newProp.width * 3/2;
        let _x = parseInt((range) * Math.random()) - range/2,
            _y = this.gameBox.height/2 + newProp.height;
        newProp.setPosition(_x, _y);
        this.gameBox.addChild(newProp);

        if(GameData.rocketStatus === 1){
            newProp.runAction(cc.sequence( 
                cc.moveTo(GameData.blockDropSpeed/5, newProp.x, this.gameBox.height/2-300),
                cc.moveTo(0.01, this.player.x, this.player.y + 30)
            ));
        }else{
            newProp.runAction(cc.sequence( cc.moveTo(GameData.blockDropSpeed, newProp.x, -this.gameBox.height/2-100), cc.callFunc(this.removeProp, newProp, true)));
        }

        if(GameData.rocketStatus === 2){
            this.stopRocketing();
            this._delayTime = 1;
        }
    },
    removeProp(prop){
        prop.stopAllActions();
        prop.removeFromParent();
    },
    createNextBlock(){
        if(this.isPaused) return;
        this.levelInNum += 1;
        if(this.levelInNum == this.levelInCount -1){
            this.scheduleOnce(this.createSpecGroup, 0.5);
            // this.createSpecGroup();
        }else if(this.levelInCount == this.levelInNum){
            this.levelInNum = 0;
            this.blockValInLevel = 90*this.level*this.level + 10;
            this.level += 1;
            this.levelInCount = 7;
            this.createEndGroup();
        }else{
            this.createBlockGroup();
        }
    },
    getBlockList(){
        let newList = cc.instantiate(this.blockListPrefab);
        newList.setPosition(-this.gameBox.width/2, this.gameBox.height/2);
        newList.parent = this.gameBox;
        return newList;
    },
    removeBlockList(blockList){
        let blocks = blockList.children;
        for(let index in blocks){
            let block = blocks[index];
            if(block.name == 'block'){
                GameData.blockPool.put(block);
            }else{
                block.removeFromParent();
            }
        }
       
        blockList.removeFromParent();
    },
    firstBlockGroup(){
        let self = this;
        let blockList = this.getBlockList();
        for(var y = 0; y < 3; y++){
            for(var x = 0; x < 5; x++){
                let block = null;
                if (GameData.blockPool.size() > 0) {
                    block = GameData.blockPool.get();
                } else {
                    block = cc.instantiate(this.blockPrefab);
                }
                
                block.parent = blockList;
                block.active = true;

                block.setPosition((x+0.5)*this._bw, y*150);

                let label = parseInt(3 * Math.random()) + 1;
                

                if(label == 1){
                    block.getComponent('block').init(label, 97, 193, 7);
                }else{
                    block.getComponent('block').init(label, 205, 27, 23);
                }

            }
        }
        blockList.height = 450;
        blockList.runAction(cc.sequence( cc.moveTo(GameData.blockDropSpeed, blockList.x, -this.gameBox.height/2-450), cc.callFunc(self.removeBlockList, blockList, true)));
    },
    createBlockGroup(){
        let self = this;
        let blockList = this.getBlockList();
        let minBlock = parseInt(5*Math.random());
        
        for(var x = 0; x < 5; x++){
            let block = null;
            let isMin = 0;
            let isStar = 0;
            if(x == minBlock){
                isMin = 1;
            }else if(this.level > 1){
                isStar = parseInt(10*Math.random());
            }

            if(isStar === 1){
                block = self.getBlock(x, 0, isMin, true);
            }else{
                block = self.getBlock(x, 0, isMin, false);
            }
            
            block.parent = blockList;
        }

        var ran = parseInt(8*Math.random());
        if(ran < 5){
            let block = self.getBlock(ran, 1, 0, false);
            block.parent = blockList;
        }
        
        blockList.runAction(cc.sequence( cc.moveTo(GameData.blockDropSpeed, blockList.x, -this.gameBox.height/2-200), cc.callFunc(self.removeBlockList, blockList, true)));
    },
    createSpecGroup(){
        let self = this;
        let maxCount = parseInt(5*Math.random());
        let specList = cc.instantiate(this.specListPrefab);
        specList.setPosition(-this.gameBox.width/2, this.gameBox.height/2);
        specList.parent = this.gameBox;
        specList.height = 0;
        specList.getComponent('specList').setVal(this.blockValInLevel);
        if(maxCount === 1){
            maxCount = 7;
            specList.getComponent('specList').setMaxGroupCount(maxCount);
        }else{
            maxCount = 1;
        }
        
        var dT = 0.45*GameData.blockDropSpeed*(this.gameBox.height + maxCount*3000)/this.gameBox.height;
        specList.runAction(cc.sequence(
            cc.delayTime((maxCount-1)/30),
            cc.moveTo(dT, specList.x, -this.gameBox.height/2-maxCount*3000), 
            cc.callFunc(self.removeBlockList, specList, true)
        ));
    },
    createRandBlocks(){
        let self = this;
        let blockList = null;

        if(this.levelInNum == this.levelInCount -2){
            blockList = this.getBlockList();
            for(var x = 0; x < 5; x++){
                let block = self.getBlock(x, 0, -1, false);
                block.parent = blockList;
                block.getComponent('block').init(1, 97, 193, 7);
            }
        }else if(this.levelInNum < this.levelInCount -2 && this.levelInNum != 0){
            var ran = parseInt(4*Math.random());
            if(ran == 1 && this.blockValInLevel > 80){
                blockList = this.getBlockList();
                ran = parseInt(5*Math.random());
                let block = self.getBlock(ran, 0, -1, false);
                
                block.parent = blockList;
                block.getComponent('block').init(this.blockValInLevel*20, 147, 41, 156);
            }
        }

        if(blockList){
            blockList.getComponent('blockList').disableEvent();
            blockList.runAction(cc.sequence( cc.moveTo(0.9, blockList.x, -this.gameBox.height/2-150), cc.callFunc(self.removeBlockList, blockList, true)));
        }
    },
    createEndGroup(){
        let self = this;
        let blockList = this.getBlockList();
        let yCount = 1;
        if(this.level % 4 === 0){
            yCount = 4;
        }
        for(var y = 0; y < yCount; y++){
            for(var x = 0; x < 5; x++){
                let block = null;
                block = cc.instantiate(this.endBlockPrefab);
                
                block.parent = blockList;
                block.setPosition((x+0.5)*block.width, y*150);

                let label = parseInt((this.blockValInLevel - parseInt(this.blockValInLevel* Math.random()/4))/yCount);
                block.getComponent('endBlock').init(label);
            }
        }
        blockList.height = yCount*150;
        blockList.runAction(cc.sequence( 
            cc.moveTo(GameData.blockDropSpeed, blockList.x, -this.gameBox.height/2-blockList.height), 
            cc.callFunc(function(){
                blockList.removeAllChildren();
                blockList.removeFromParent();
            }, this)
        ));
    },
    getBlock(xPos, yPos, isMin, isStar){
        let block = null;
        if(isStar){
            block = cc.instantiate(this.starBlockPrefab);
        }else{
            if (GameData.blockPool.size() > 0) {
                block = GameData.blockPool.get();
            } else {
                block = cc.instantiate(this.blockPrefab);
            }
        }
        block.setPosition((xPos+0.5)*this._bw, yPos*150);
        block.active = true;

        let variance = parseInt(this.blockValInLevel/4);
        if(isMin === 1){
            let label = (3 + this.levelInNum)*variance;
            block.getComponent('block').init(label, 97, 193, 7);
        }else if(isMin === 0){
            let label = this.blockValInLevel - parseInt(variance* Math.random()) + this.levelInNum*variance;
            block.getComponent('block').init(label, 205, 25, 25);
        }

        return block;
    },
    changeScoreView(){
        this.scoreView.getComponent(cc.Label).string = this.convertNum(GameData.score);
        this.scoreView.runAction(
            cc.sequence(
                cc.scaleTo(0.03, 1.15),
                cc.scaleTo(0.03, 1)
            )
        );
    },
    moveCursor(event) {
        let locationv = event.getLocation();
        let location = this.gameBox.convertToNodeSpaceAR(locationv);

        let minX = -this.gameBox.width / 2 + this.player.width / 2,
            maxX = -minX
        if (location.x < minX) location.x = minX;
        if (location.x > maxX) location.x = maxX;
        let xPos = location.x;
        GameData.cursorXPos = xPos;

        if(this.isPaused || GameData.jumpMove) return;
        // if(CHD.jumpMove) {
        //     CHD.jumpMove = 0
        //     return;
        // }
        var deltaX = xPos - this.player.x;
        if(GameData.collideStatus[0] > 0 && deltaX*GameData.collideStatus[1] < 0) return;

        this.player.x = xPos;
    },
    gameOver() {
        if(this._gameOver) return;
        this.removeAllChilds();
        cc.director.loadScene('gameOver');
        this._gameOver = true;
    },
    pauseGame(){
        this.submitScore();
        this.pauseAllChilds();
        this.node.runAction(cc.sequence(
            cc.moveBy(0.015, 5, 50),
            cc.moveBy(0.015, -5, -50),
            cc.moveBy(0.01, -5, 30),
            cc.moveBy(0.01, 5, -30)
        ));
        let failBlast = cc.instantiate(this.failBlastPrefab);
        failBlast.setPosition(this.player.x, this.player.y);
        failBlast.parent = this.gameBox.parent;
        this.scheduleOnce(() => {
            failBlast.removeFromParent();
            
            if(GameData.score < 500 || this._isInvite){
                this.gameOver();
            }else{
                this.player.active = false;
                this.resumeAllChilds();
    
                this.continueNode.active = true;
                this.continueNode.getComponent('cover').init();
            }
        }, 0.8);
        
    },
    
    removeAllChilds(){
        this.isPaused = true;
        let childs = this.gameBox.children;

        for(let x in childs){
            let child = childs[x];
            if(child.name == 'blockList' || child.name == 'specList'){
                child.stopAllActions();
                this.removeBlockList(child);
            }else if(child.name == 'forceful'){
                GameData.bulletPower += 2;
                child.removeFromParent();
            }else if(child.name == 'fast'){
                GameData.bulletSpeed += 2;
                child.removeFromParent();
            }else if(child.name == 'double' || child.name == 'rocket'){
                child.removeFromParent();
            }
            // else if(child.name == 'bulletGroup'){
            //     child.stopAllActions();
            //     GameData.bulletGroupPool.put(child);
            // }
        }

        this.gameBox.removeAllChildren();
    },
    pauseAllChilds(){
        this.isPaused = true;
        let childs = this.gameBox.children;
        for(let index in childs){
            childs[index].pauseAllActions();
        }
    },
    resumeAllChilds(){
        this.isPaused = false;
        let childs = this.gameBox.children;
        for(let index in childs){
            childs[index].resumeAllActions();
        }
    },
    exploreAllBlocks(){
        if(GameData.exploreALL) return;
        GameData.exploreALL = true;
        let childs = this.gameBox.children;
        console.log('Total count  '+ this.gameBox.childrenCount);        
        for(let x in childs){
            let child = childs[x];
            if(child.name == 'blockList' || child.name == 'specList'){
                let subChilds = child.children;
                console.log('list count  '+ subChilds.length);
                for(let y in subChilds){
                    let subChild = subChilds[y];
                    console.log('block name   ' + subChild.name);
                    if(subChild.name == 'endBlock'){
                        subChild.getComponent('endBlock').explore();
                    }else if(subChild.name == 'block' || subChild.name == 'starBlock'){
                        subChild.getComponent('block').explore();
                    }
                }
            }else if(child.name == 'forceful'){
                GameData.bulletPower += 2;
                child.removeFromParent();
            }else if(child.name == 'fast'){
                GameData.bulletSpeed += 2;
                child.removeFromParent();
            }else if(child.name == 'double' || child.name == 'rocket'){
                child.removeFromParent();
            }
        }
        GameData.exploreALL = false;
        console.log('end exploreALL');
        // this.resumeAllChilds();
    },
    setRockect(){
        let self = this;
        GameData.rocketStatus = 1;
        GameData.blockDropSpeed = 0.7;

        let childs = this.gameBox.children;
        for(let x in childs){
            let child = childs[x];
            if(child.group == 'prop'){
                child.stopAllActions();
                child.runAction(cc.moveTo(0.01, this.player.x, this.player.y + 30));
            }else if(child.name == 'blockList' || child.name == 'specList'){
                child.stopAllActions();
                child.runAction(
                    cc.sequence( 
                        cc.moveTo(5, child.x, -140*150 - this.node.parent.height), 
                        cc.callFunc(function(){
                            self.removeBlockList(child);
                        }, this)
                    )
                );
            }
        }

        this.player.runAction(cc.sequence( cc.moveBy(0.5, 0, this.node.height/2), cc.delayTime(2), cc.callFunc(function(){
            GameData.rocketStatus = 2;
        }, this) ));
    },
    stopRocketing(){
        GameData.blockDropSpeed = 4;
        this.exploreAllBlocks();
        
        this.player.runAction(cc.moveBy(0.2, 0, -this.node.height/2));
        GameData.rocketStatus = 0;
        GameData.collideStatus = [0,0];
    },
    invite(){
        let self = this;
        this.continueNode.getComponent('cover').stopCount();
        this.pauseAllChilds();
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: 'hitBricks', 
                imageUrl: 'res/raw-assets/resources/hitBricks.jpg', 
                query: "from=group",
                success:(res)=>{
                    self.continueGame();
                },
                fail:()=>{
                    self.continueNode.getComponent('cover').startCount();
                    self.resumeAllChilds();
                }
            });
        }
    },
    continueGame(){
        this._isInvite = true;
        this.continueNode.active = false;
        this.scheduleOnce(function(){
            this.player.getComponent('player').init();
            this.exploreAllBlocks();
            this.resumeAllChilds();
        }, 0.8);
        
        
    },
    convertNum(num){
        if(num < 0) return 0;
        if(num >= 1000){
            return Math.round(num/10)/100 + 'K';
        }
        return num;
    },
    revertNum(strNum){
        strNum = String(strNum);
        if(strNum.search('K') > 0){
            return Number(strNum.substr(0, strNum.length -1))*1000;
        }
        return Number(strNum);
    },
    submitScore(){
        // cc.log('submitScore:  '+score);
        if (window.wx != undefined) {
            window.wx.postMessage({
                messageType: "sendScore",
                score: GameData.score
            });
        } else {
            cc.log("fail: x_total : " + this.score)
        }
    }
});

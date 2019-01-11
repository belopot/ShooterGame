// var CHD = require("commonHandler");
var GameData = require("gameData");
var blockData = require("blockData");
cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._maxGroupCount = 1;
        this._blockVal = 0;
    },

    start () {
        this.startLine = this.node.parent.height/2;
        this.firstLine = GameData.centerLine;
        this.secondLine = GameData.actorLine+150;
        this.passedCenter = false;
        this.passedActor = false;

        this.groupData = [];
        this.groupCount = 0;
        this.bNum = 0;
        
        this.resetGroupData();
        this.node.on('resetData', this.resetGroupData, this);
        this.node.on('addNewBar', this.addBlockBar, this);
    },

    update (dt) {
        var endPos = this.node.y + this.node.height;
        if(this.groupCount == this._maxGroupCount && this.bNum == 19){
            if(endPos < this.firstLine && !this.passedCenter){
                this.passedCenter = true;
                this.node.parent.emit('passedCenterLine');
            }
            
            if(endPos < this.secondLine && !this.passedActor){
                this.passedActor = true;
                this.node.parent.emit('passedActorLine');
            }
        }else{
            if(endPos < this.startLine){
                // this.node.emit('addNewBar');
                this.addBlockBar();
            }
        }
    },
    addBlockBar(){
        var yPos = 20*(this.groupCount-1) + this.bNum;
        let groupBar = this.groupData[this.bNum];
        for(var x = 0; x < 5; x++){
            
            let isBlock = groupBar[x];
            if(isBlock){
                
                let block = null;
                if (GameData.blockPool.size() > 0) {
                    block = GameData.blockPool.get();
                } else {
                    block = cc.instantiate(this.blockPrefab);
                }
                
                block.parent = this.node;
                block.setPosition((x+0.5)*block.width, yPos*150);
                block.active = true;

                let isMin = parseInt(40*Math.random());

                let maxVal = 9*this._blockVal +150;
                                
                if(isMin === 1){
                    let label = parseInt(0.75*maxVal);
                    block.getComponent('block').init(label, 97, 193, 7);
                }else{
                    let label = parseInt(maxVal - 0.25*maxVal* Math.random());
                    let color = this.getBlockColor(maxVal, label);//new cc.Color(205, 25, 25);

                    block.getComponent('block').init(label, color[0], color[1], color[2]);
                }
            }
        }

        if(this.bNum == 19){
            this.node.emit('resetData');
            this.bNum = 0;
        }else{
            this.bNum += 1;
        }
        
        this.node.height += 150;
    },
    getBlockColor(max, val){
        let rate = Math.ceil(10*val/max)/10;
        return [255-rate*50, 200 - rate*175, rate*25];
    },
    resetGroupData(){
        if(this._maxGroupCount === 1){
            var ran = parseInt(17*Math.random());
            this.groupData = blockData.single[ran];
        }else{
            var ran = parseInt(9*Math.random());
            this.groupData = blockData.couple[ran];
        }
        
        this.groupCount += 1;
    },
    setMaxGroupCount(count){
        this._maxGroupCount = count;
    },
    setVal(val){
        this._blockVal = val;
    },
    // exploreAll(){
    //     let childs = this.node.children;
    //     for(let x in childs){
    //         if(childs[x].name == 'block'){
    //             childs[x].getComponent('block').explore();
    //         }
    //     }
    // }
});
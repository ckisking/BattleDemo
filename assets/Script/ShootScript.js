/**
 * 主角或者怪物抛出物体控制脚本
 */
cc.Class({
    extends: cc.Component,

    properties: {
        speed : 15,               //飞行速度
        attack : 0,               //攻击力
        attackCount : 0,          //攻击次数
        attackMode : 0,           //攻击模式（普通0、子弹1、持续性魔法2）
    },

    // use this for initialization
    onLoad: function () {
        cc.log(this.node.getComponent("cc.BoxCollider").size);
    },
    
    //初始化抛出物体
    initShoot : function (speed, attack, attackCount, attackMode){
        this.speed = speed;
        this.attack = attack;
        this.attackCount = attackCount;
        this.attackMode = attackMode;
        this.node.getComponent("cc.BoxCollider").size.width = this.node.width;
        this.node.getComponent("cc.BoxCollider").size.height = this.node.height;
        if(attackMode === 0){
            this.unscheudleUpdate();
        }
    },
    
    onCollisionEnter: function (other, self) {
        //  this.node.getComponent("cc.BoxCollider").enabled = false;
        if(this.attackMode == 0){
            return;
        }
        if(other.node.group == "monster"){
            this.node.removeFromParent(true);   
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.attackMode == 0){
            return;
        }
        this.node.x += this.speed;
        if(this.node.x >= cc.find("Canvas/BattleLayer/floorNode").width){
            this.node.destroy();
        }
    },
});

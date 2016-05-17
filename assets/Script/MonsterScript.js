/**
 * 怪物控制脚本
 */
var UnitSprite = require('UnitSpriteScript');
cc.Class({
    extends: UnitSprite,

    properties: {
        hitbloodLab : {             //怪物飘雪动画
            default : null,
            type : cc.Prefab
        },
        
        spasticity : 0.5             //僵值
    },

    // use this for initialization
    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        this.anima = this.getComponent(cc.Animation); 
    },
    
    //碰撞监测开始
    onCollisionEnter: function (other, self) {
        var otherGroup = other.node.group;
        var selfGroup = self.node.group;
        if(otherGroup == "heroAttack" && selfGroup == "monster"){
            this.node.color = cc.Color.RED;
            this.anima.play('1monster_behit');
            this.unschedule(this.onRecoverState);
            this.scheduleOnce(this.onRecoverState, this.spasticity);
            
            var att = other.node.getComponent("ShootScript").attack;
            var hit = att - this.baseDefen;
            this.hp -= hit;
            //扣血
            var bloodLabel = cc.instantiate(this.hitbloodLab);
            bloodLabel.position = cc.p(this.node.width/2,this.node.height);
            bloodLabel.getComponent(cc.Label).string = "-" + hit;
            bloodLabel.scaleX = -1;
            this.node.addChild(bloodLabel);
            bloodLabel.active = true;
            cc.log(other.node.group);  
            //血量低于零时触发死亡函数
            if(this.hp <= 0){
                this.onDead();
            }
        }
    },
    
    //碰撞监测结束
    onCollisionExit: function (other, self) {
       cc.log("检测结束");
    },
    
    //被攻击后恢复正常状态
    onRecoverState : function () {
        this.anima.play('1monster_stand');
        this.node.color = cc.Color.WHITE;
    },
    
    //死亡后触发
    onDead : function () {
        this.node.runAction(cc.sequence(cc.blink(0.5, 4), cc.removeSelf()));
    },
    //被销毁后执行
    onDisabled: function () {
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

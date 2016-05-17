/**
 * 怪物控制脚本
 */
var UnitSprite = require('UnitSpriteScript');
var AIState = require('GlobalScript').AIState; 

var ActionState = require('GlobalScript').ActionState;
 
 //状态
var AiPatrolState = require('AiPatrolState');
var AiIdelState = require('AiIdelState');
var AiAttackState = require('AiAttackState');

cc.Class({
    extends: UnitSprite,

    properties: {
        hitbloodLab : {             //怪物飘雪动画
            default : null,
            type : cc.Prefab
        },
        
        spasticity : 0.5,             //僵值
        moveDirection : {
            default : new cc.Vec2()    
        },            
        eyeArea : 400,                //警戒距离
        attackArea : 200,             //攻击范围
        aiState : 0,                  //AI状态
        nextDecisionTime : 0,          //延迟时间
        speed : 5
    },

    // use this for initialization
    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        this.anima = this.getComponent(cc.Animation); 
    },
    start : function () {
        this.aiPatrolState = new AiPatrolState();
        this.aiIdelState = new AiIdelState();
        this.aiAttackState = new AiAttackState();
        this.changeState(this.aiPatrolState); 
        this.aiState = AIState.AI_IDEL;
    },
    //碰撞监测开始
    onCollisionEnter: function (other, self) {
        var otherGroup = other.node.group;
        var selfGroup = self.node.group;
        cc.log(selfGroup);
        //被英雄攻击
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
    
     //根据方向判断是否改变状态
    changestateByDir : function (dir) {
        if (dir > 0) {
            this.changeState(new WalkState()); 
            this.mCurState.execute(this);
            this.onRun();
        }
        else if(dir === 0){
           this.changeState(new IdelState()); 
           this.mCurState.execute(this);
        }
        if(dir > 1 && dir < 5){
            this.node.scaleX = 1.8;
            cc.log(this.node.getComponent("cc.BoxCollider").offset.x);
        }
        else if(dir > 5 && dir < 9){
            this.node.scaleX = -1.8;
        }
    },
    
    //根据状态改变动画
    changeActionByState : function (state) {
        var anim = this.getComponent(cc.Animation);
        this._actionState = state; 
        if(state == ActionState.ACTION_STATE_IDLE){
            anim.play('1monster_stand');
        }
        else if(state == ActionState.ACTION_STATE_WALK){
            anim.play('1monster_run');
        }
        else if(state == ActionState.ACTION_STATE_NOR_ATTACK){

            // anim.play('1hero_attack1');
            var animName = '1monster_attack' + this._attackMode;
            this.nowHeroAction = animName;
             anim.play(animName);
             this._attackMode += 1;
             if(this._attackMode == AttackMode.ATTACK_4){
                  this._attackMode = AttackMode.ATTACK_1;
             }
        }
        else if(state == ActionState.ACTION_STATE_SKILL_ATTACK){
            
        }
        else if(state == ActionState.ACTION_STATE_BEHIT){
            
        }
        else if(state == ACTION_STATE_DEAD){
            
        }
    },
    
    //巡逻
    onPatrol : function () {
        var moveDirectionx = this.getRandomInt(-1, 2);
        var moveDirectiony = this.getRandomInt(-1, 2);
        cc.log("x:" +moveDirectionx +"y: " + moveDirectiony );
        this.moveDirection.x  = moveDirectionx > 0 ? (moveDirectionx  + this.speed) : (moveDirectionx  -this.speed);
        this.moveDirection.y  =moveDirectiony  > 0 ? (moveDirectiony  +this.speed) : (moveDirectiony  -this.speed);
        this.nextDecisionTime =Math.random() * 100;
        if(moveDirectionx > 0){
            this.node.scaleX = 1.8;
        }else{
            this.node.scaleX = -1.8;
        }
    },
    
    getRandomInt : function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    
    execute : function (target, targetBodyWidth) {
        //延时判定
        if(this.nextDecisionTime <= 0 ){
            this.decide(target, targetBodyWidth);
        }
        else{
            this.nextDecisionTime --;
        }
    },
    
     //简单状态机FSM
    decide : function (target, targetBodyWidth) {
        var self = this;
        var pos = this.node.position;    //脚下坐标
        var distance = cc.pDistance(pos, target);
        distance = distance - targetBodyWidth/2;
        var isFlipedX;
        if(self.node.scaleX < 0){
            isFlipedX = true; 
        }else{
            isFlipedX = false;
        }
        if(distance < self.eyeArea){
            self.aiState = (distance < self.attackArea) && (Math.abs(pos.y - target.y)) ? AIState.AI_ATTACK : AIState.AI_PURSUIT;
        }else{
            self.aiState = Math.random() > 0.5 ? AIState.AI_PATROL : AIState.AI_IDEL;
        }
        
        switch(self.aiState)
        {
            case AIState.AI_ATTACK:
            {
                cc.log("攻击");
                self.nextDecisionTime = 50;
            }
            break;
            case AIState.AI_IDLE:
            {
                cc.log("待机");
                self.nextDecisionTime = Math.random() * 100;
            }
            break;
            case AIState.AI_PATROL:
            {
                cc.log("闲逛");
                this.changeState(this.aiPatrolState); 
                this.mCurState.execute(this);
                self.nextDecisionTime = Math.random() * 50;
            }
                break;
            case AIState.AI_PURSUIT:
            {
                cc.log("追击");
                 
            }
            break;
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.aiState == AIState.AI_PATROL)
        {
            var currentP= this.node.position;             //当前坐标
            var expectP = cc.pAdd(currentP , this.moveDirection);  //期望坐标
            var actualP = expectP;                         //实际坐标
            this.node.position = actualP;
        }
    },
});

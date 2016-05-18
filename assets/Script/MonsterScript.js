/**
 * 怪物控制脚本
 */
var UnitSprite = require('UnitSpriteScript');
var Hero = require('HeroScript');
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
        moveDirection : {             //行动方向
            default : new cc.Vec2()    
        },            
        eyeArea : 400,                //警戒距离
        attackArea : 200,             //攻击范围
        aiState : 0,                  //AI状态
        nextDecisionTime : 0,          //延迟时间
        speed : new cc.Vec2(0,0)
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
        // this.changeState(this.aiIdelState); 
        this.aiState = AIState.AI_NONE;
    },
    
    //初始化怪物属性
    initMonster : function (range) {
      this.moveRange = range;
    },
    
    //碰撞监测开始
    onCollisionEnter: function (other, self) {
        var otherGroup = other.node.group;
        var selfGroup = self.node.group;
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
            bloodLabel.position = cc.p(0, this.node.height - 10);
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
    },
    
    
    
    
    //被攻击后恢复正常状态
    onRecoverState : function () {
        this.anima.play('1monster_stand');
        this.node.color = cc.Color.WHITE;
    },
    
    //死亡后触发
    onDead : function () {
        this.node.runAction(cc.sequence(cc.blink(0.5, 4), cc.removeSelf(true)));
    },
    //被销毁后执行
    onDisabled: function () {
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    
    //根据状态改变动画
    changeActionByState : function (state) {
        var anim = this.getComponent(cc.Animation);
        this.aiState = state; 
        if(state == AIState.AI_IDEL){
            anim.play('1monster_stand');
        }
        else if(state == AIState.AI_PATROL){
            anim.play('1monster_run');
        }
        else if(state == AIState.AI_ATTACK){
            var animName = '1monster_attack' + this._attackMode;
            this.nowHeroAction = animName;
             anim.play(animName);
             this._attackMode += 1;
             if(this._attackMode == AttackMode.ATTACK_4){
                  this._attackMode = AttackMode.ATTACK_1;
             }
        }
    },
    
    //巡逻时执行
    onPatrol : function () {
        var moveDirectionx = this.getRandomInt(-1, 2);
        var moveDirectiony = this.getRandomInt(-1, 2);
        this.moveDirection.x  = moveDirectionx > 0 ? (moveDirectionx  + this.speed.x) : (moveDirectionx  -this.speed.x);
        this.moveDirection.y  =moveDirectiony  > 0 ? (moveDirectiony  +this.speed.y) : (moveDirectiony  -this.speed.y);
        this.nextDecisionTime =Math.random() * 100;
        if(moveDirectionx > 0){
            this.node.scaleX = 1.8;
        }else{
            this.node.scaleX = -1.8;
        }
        //改变状态，改变帧动画
        this.changeActionByState(AIState.AI_PATROL); 
        
    },
    
    //待机时执行
    onIdel : function () {
        //改变状态，改变帧动画
        this.changeActionByState(AIState.AI_IDEL);
        this.moveDirection = cc.p(0,0);
    },
    
    getRandomInt : function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    
    //AI判断
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
        var aistate;
        if(distance < self.eyeArea){
            aistate = (distance < self.attackArea) && (Math.abs(pos.y - target.y)) ? AIState.AI_ATTACK : AIState.AI_PURSUIT;
        }else{
            aistate = Math.random() > 0.5 ? AIState.AI_PATROL : AIState.AI_IDEL;
        }
        
        switch(aistate)
        {
            case AIState.AI_ATTACK:
            {
                cc.log("攻击");
                self.nextDecisionTime = 50;
            }
            break;
            case AIState.AI_IDEL:
            {
                cc.log("待机");
                this.changeState(this.aiIdelState); 
                this.mCurState.execute(this);
                self.nextDecisionTime = Math.random() * 100;
            }
            break;
            case AIState.AI_PATROL:
            {
                cc.log("闲逛");
                this.changeState(this.aiPatrolState); 
                this.mCurState.execute(this);
                self.nextDecisionTime = Math.random() * 100;
            }
                break;
            case AIState.AI_PURSUIT:
            {
                cc.log("追击");
                this.changeState(this.aiPatrolState); 
                this.mCurState.execute(this);
                 
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
            if(actualP.x < this.node.width/2){
                actualP.x = this.node.width/2;
            }
            if(actualP.x > this.moveRange.x - this.node.width/2){
                actualP.x = this.moveRange.x - this.node.width/2;
            }
            if(actualP.y < 0){
                actualP.y = 0;
            }
            if(actualP.y > this.moveRange.y){
                 actualP.y = this.moveRange.y;
             }
            this.node.position = actualP;
        }
        else if(this.aiState == AIState.AI_PURSUIT)
        {
            var currentP= this.node.position;                      //当前坐标
            var expectP = cc.pAdd(currentP , this.moveDirection);  //期望坐标
            cc.log(Hero.instance.node.position);
        }
    },
});

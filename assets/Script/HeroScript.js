/**
 * 英雄类脚本(单例)
 */
var Rocker = require('RockerScript');
var UnitSprite = require('UnitSpriteScript');
// 全局变量
var Direction = require('GlobalScript').Direction;
var ActionState = require('GlobalScript').ActionState;
var AttackMode = require('GlobalScript').AttackMode;
//状态
var IdelState = require('IdelState');
var WalkState = require('WalkState');
var RunState = require('RunState');
var NorAttackState = require('NorAttackState');
var BeHitState = require('BeHitState');

var Hero = cc.Class({
    extends: UnitSprite,

    properties: {
        shootNode : {                  //【远程攻击判断碰撞框】
            default : null,
            type : cc.Prefab  
        },
        boneSpeed   : 0.8,      // 【速度】 
    },
    //静态变量
    statics : {
        instance : null,  
    },
    
    onLoad: function () {
        //初始化类单例
        Hero.instance = this;
        //记录普通攻击模式
        this._attackMode = AttackMode.ATTACK_1; 
        //获取近战普通攻击碰撞框
        this.collider = this.attackNode.getComponent("cc.BoxCollider");
        this.anim = this.getComponent(cc.Animation);  
       
        
        //测试（监听键盘事件）
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD, 
            onKeyPressed: function(keyCode, event) {
                if (keyCode === cc.KEY.space) {
                    self.onNorAttackCall();
                }
            }
        }, self); 
    },
    start : function () {
         //初始动作化状态机
        this.idelState = new IdelState();
        this.walkState = new WalkState();
        this.norAttackState = new NorAttackState();
        this.beHitState = new BeHitState();
        this.runState = new RunState();
        this.changeState(this.idelState); 
    },
    //初始化英雄属性
    initHero : function (range) {
        this.moveRange = range;
    },
    
    //碰撞时触发
    onCollisionEnter: function (other, self) {
        var otherGroup = other.node.group;
        var selfGroup = self.node.group;
        if(otherGroup == "monsterAttack" && selfGroup == "hero"){
            this.changeState(this.beHitState); 
            this.mCurState.execute(this);
        
            var att = other.node.getComponent("ShootScript").attack;
            var hit = att - this.baseDefen;
            this.hp -= hit;
            //扣血
            var bloodLabel = cc.instantiate(this.hitbloodLab);
            bloodLabel.position = cc.p( this.node.position.x, this.node.position.y + this.node.height * this.node.scaleY / 2);
            bloodLabel.getComponent(cc.Label).string = hit;
            this.node.parent.addChild(bloodLabel);
            bloodLabel.active = true;
            
            //血量低于零时触发死亡函数
            if(this.hp <= 0){
                this.onDead();
            }
        }
    },
    //碰撞中，离开碰撞后触发
    onCollisionExit: function (other) {
    },
    //隐藏后关闭碰撞
    onDisabled: function () {
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    
    ///////////////////////////////////////////////////////////////////
    //状态机各个不同状态的实现函数
    //////////////////////////////////////////////////////////////////
    
    //根据方向判断是否改变状态
    changestateByDir : function (dir) {
        if (dir > 0) {
            this.onRun();
        }
        else if(dir === 0){
           this.changeState(this.idelState); 
           this.mCurState.execute(this);
        }
        if(dir > 1 && dir < 5){
            this.node.scaleX = Math.abs(this.node.scaleX);
            cc.log(this.node.getComponent("cc.BoxCollider").offset.x);
        }
        else if(dir > 5 && dir < 9){
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }
    },
    // 跑动
    onRun : function(){
        // 获取摇杆方向
        var dir =Rocker._direction;
        // 获取摇杆速度 (取值范围[0-1])
        var rockerSpeed = Rocker._speed;
        if(rockerSpeed >=0.5){
            this.changeState(this.runState); 
            this.mCurState.execute(this);
        }
        else{
            this.changeState(this.walkState); 
            this.mCurState.execute(this);
        }
        // 获取摇杆弧度
        var radians = Rocker._radians;
        var x = this.node.x;
        var y = this.node.y;
        switch (dir){
            case Direction.D_UP:
                y += rockerSpeed * this.boneSpeed;
                break;
            case Direction.D_RIGHT_UP:
                x += rockerSpeed * this.boneSpeed * Math.cos(radians);
                y += rockerSpeed * this.boneSpeed * Math.sin(radians);
                break;
            case Direction.D_RIGHT:
                x += rockerSpeed * this.boneSpeed;
                break;
            case Direction.D_RIGHT_DOWN:
                x += rockerSpeed * this.boneSpeed * Math.cos(radians);
                y += rockerSpeed * this.boneSpeed * Math.sin(radians);
                break;
            case Direction.D_DOWN:
                y -= rockerSpeed * this.boneSpeed;
                break;
            case Direction.D_LEFT_DOWN:
                x += rockerSpeed * this.boneSpeed * Math.cos(radians);
                y += rockerSpeed * this.boneSpeed * Math.sin(radians);
                break;
            case Direction.D_LEFT:
                x -= rockerSpeed * this.boneSpeed;
                break;
            case Direction.D_LEFT_UP:
                x += rockerSpeed * this.boneSpeed * Math.cos(radians);
                y += rockerSpeed * this.boneSpeed * Math.sin(radians);
                break;
            case Direction.DEFAULT:
            default :
                break;
        }
        if(x <= this.node.width / 2){
            x = this.node.width / 2;
        }
        else if(x >= this.moveRange.x -  this.node.width / 2){
            x =  this.moveRange.x -  this.node.width / 2;
        }
        if(y <= 0){
            y = 0;
        }
        else if(y >= this.moveRange.y){
            y = this.moveRange.y;
        }
        this.node.position = cc.p(x, y);
    },
    
    //待机状态时执行
    onIdel : function () {
        this.anim.play('2hero_stand0');
        this._actionState = ActionState.ACTION_STATE_IDLE;
    },
    //普通攻击状态时执行
    onNorAttack : function () {
         if(this._attackMode < AttackMode.ATTACK_4){
             var animName = '2hero_attack' + 1;
             this.anim.play(animName);
         }else{
             var animName = '2hero_attack' + 2;
             this.anim.play(animName);
             this._attackMode = AttackMode.ATTACK_1;
         }
         this._attackMode += 1;
         this._actionState = ActionState.ACTION_STATE_NOR_ATTACK;
    },
    //移动状态时执行
    onWalk : function () {
         this.anim.play('2hero_walk');
         this._actionState = ActionState.ACTION_STATE_WALK;
    },
    //奔跑状态时执行
    onRunState : function () {
        this.anim.play('2hero_run');
         this._actionState = ActionState.ACTION_STATE_RUN;
    },
    //被攻击状态时执行
    onHit : function () {
        this._actionState = ActionState.ACTION_STATE_BEHIT;
        this.anim.play('2hero_behit');
        this.node.color = cc.Color.RED;
        this.unschedule(this.onRecoverState);
        this.scheduleOnce(this.onRecoverState, this.spasticity);
    },
    ///////////////////////////////////////////////////////////////////////
    //END
    //////////////////////////////////////////////////////////////////////
    
    //普通按钮回调
    onNorAttackCall : function () {
          this.changeState( this.norAttackState ); 
          this.mCurState.execute(this);
    },
    //被攻击后恢复正常状态
    onRecoverState : function () {
        this.anim.play('2hero_stand0');
        this.node.color = cc.Color.WHITE;
        this._actionState = ActionState.ACTION_STATE_IDLE;
    },
    //死亡后触发
    onDead : function () {
        this.node.runAction(cc.sequence(cc.blink(0.5, 4), cc.removeSelf(true)));
    },
   
    //改变攻击方式（延迟执行)
    changeAttackMode : function () {
          this._attackMode = AttackMode.ATTACK_1;
    },
    

    
    //帧事件近战攻击attack1，监测碰撞开启
    heroAttack1 : function () {
        this.collider.enabled = true;
    },
    //攻击结束，监测碰撞关闭
    heroAttackOver : function () {
      this.collider.enabled  = false;  
      this.unschedule(this.changeAttackMode);
      this.scheduleOnce(this.changeAttackMode, 10);
    },
    //动作结束后触发回调
    actionOver : function () {
        this._actionState = ActionState.ACTION_STATE_NONE;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //当人物处于攻击、被攻击状态时无法移动
        if(this._actionState == ActionState.ACTION_STATE_BEHIT || this._actionState == ActionState.ACTION_STATE_NOR_ATTACK){
            return;
        }
        this.changestateByDir(Rocker._direction);
    },
});

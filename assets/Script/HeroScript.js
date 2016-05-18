/**
 * 英雄控制脚本
 */
var Rocker = require('RockerScript');
var UnitSprite = require('UnitSpriteScript');
// 方向
var Direction = require('GlobalScript').Direction;
var ActionState = require('GlobalScript').ActionState;

//状态
var IdelState = require('IdelState');
var WalkState = require('WalkState');
var NorAttackState = require('NorAttackState');
//攻击方式（连续攻击会改变攻击方式）
var AttackMode = cc.Enum({
    ATTACK_DEFAULT : 0,
    ATTACK_1 : 1,
    ATTACK_2 : 2,
    ATTACK_3 : 3,
    ATTACK_4 : 4,
})
cc.Class({
    extends: UnitSprite,

    properties: {
        floorNode : {          //[地板]
            default : null,
            type : cc.Node
        },
        attackNode : {         // [攻击碰撞框]
            default : null,
            type : cc.Node
        },
        shootNode : {
            default : null,
            type : cc.Prefab  
        },
        boneSpeed   : 0.8,      // [速度]
        _attackMode : AttackMode.ATTACK_DEFAULT
    },

    // use this for initialization
    onLoad: function () {
        //记录普通攻击第几下
        this._attackMode = AttackMode.ATTACK_1;
        //记录当前可以打断idel、Walk状态的动作
        this.nowHeroAction = '1hero_attack1';
        //普通攻击1的碰撞框
        this.collider = this.attackNode.getComponent("cc.BoxCollider");
        //是否开启碰撞
        cc.director.getCollisionManager().enabled = true;
        //是否显示碰撞框
        cc.director.getCollisionManager().enabledDebugDraw = true;   
    },
    
    start : function () {
        this.idelState = new IdelState();
        this.walkState = new WalkState();
        this.norAttackState = new NorAttackState();
        this.changeState(this.idelState); 
    },
    
    //初始化英雄属性
    initHero : function (range) {
        this.moveRange = range;
    },
    
    onCollisionEnter: function (other, self) {
        // this.node.color = cc.Color.RED;
    },
    onCollisionExit: function (other) {
        this.node.color = cc.Color.WHITE;
    },
    onDisabled: function () {
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    
    //根据状态改变动画
    changeActionByState : function (state) {
        var anim = this.getComponent(cc.Animation);
        this._actionState = state; 
        if(state == ActionState.ACTION_STATE_IDLE){
            anim.play('1hero_stand');
        }
        else if(state == ActionState.ACTION_STATE_WALK){
            anim.play('1hero_run');
        }
        else if(state == ActionState.ACTION_STATE_NOR_ATTACK){

            // anim.play('1hero_attack1');
            var animName = '1hero_attack' + this._attackMode;
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
    
    // 改变方向[切换帧动画]
    boneChangeDir : function(dir){
        var anim = this.getComponent(cc.Animation); 
        var animRunState = anim.getAnimationState('1hero_run').isPlaying;
        var animStandState = anim.getAnimationState('1hero_stand').isPlaying;
        
        if (dir > 0 && !animRunState) {
            anim.play('1hero_run');
        }
        else if(dir === 0 && !animStandState){
            anim.play('1hero_stand');
        }
        if(dir > 1 && dir < 5){
            this.node.scaleX = 1.8;
            cc.log(this.node.getComponent("cc.BoxCollider").offset.x);
        }
        else if(dir > 5 && dir < 9){
            this.node.scaleX = -1.8;
        }
    },
    
    // 跑动
    onRun : function(){
        // 获取摇杆方向
        var dir =Rocker._direction;
        // 获取摇杆速度 (取值范围[0-1])
        var rockerSpeed = Rocker._speed;
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
    
    //普通攻击
    onAttack : function () {
          this.changeState(this.norAttackState); 
          this.mCurState.execute(this);
    },
    //改变攻击方式（1秒后执行)
    changeAttackMode : function () {
          this._attackMode = AttackMode.ATTACK_1;
    },
    
    //攻击抛出物
    attackShoot : function () {
        var shootNode = cc.instantiate(this.shootNode);
        shootNode.parent = this.floorNode;
        var speed;
        if(this.node.scaleX < 0){
            speed = -15;
        }
        else{
            speed = 15;
        }
        shootNode.getComponent("ShootScript").initShoot(speed, 25, 1, 1);
        shootNode.position = cc.p(this.node.position.x + this.node.width, this.node.position.y + shootNode.height/2 );
        cc.log("shoot");
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
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var anim = this.getComponent(cc.Animation); 
        if(anim.getAnimationState( this.nowHeroAction).isPlaying){
            return;
        }
        // this.boneChangeDir(Rocker._direction); 
        // this.onRun();
        
        this.changestateByDir(Rocker._direction);
    },
});

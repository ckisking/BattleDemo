/**
 * 怪物控制脚本
 */
var UnitSprite = require('UnitSpriteScript');
var Hero = require('HeroScript');
var AIState = require('GlobalScript').AIState;

var ActionState = require('GlobalScript').ActionState;
var Battle = require('BattleScript');
//状态
var AiPatrolState = require('AiPatrolState');
var AiIdelState = require('AiIdelState');
var AiAttackState = require('AiAttackState');
var AiPursuitState = require('AiPursuitState');
var AiBeHitState = require('AiBeHitState');

cc.Class({
    extends : UnitSprite,

    properties: {
        moveDirection: { //【行动方向】
            default: new cc.Vec2()
        },
        eyeArea: 800, //【警戒距离】
        attackArea: 0, //【攻击范围】
        aiState: 0, //【当前AI状态】
        nextDecisionTime: 0, //【AI检测延迟时间】
        whetherIdel: false },

    //【是否会待着不动】
    onLoad: function () {
        this.type = 1;
        //初始化AI状态机
        this.aiPatrolState = new AiPatrolState();
        this.aiIdelState = new AiIdelState();
        this.aiAttackState = new AiAttackState();
        this.aiPursuitState = new AiPursuitState();
        this.aiBeHitState = new AiBeHitState();
        this.aiState = AIState.AI_NONE;
        //获取近战普通攻击碰撞框
        this.collider = this.attackNode.getComponent("cc.BoxCollider");
        //获取动画组件
        this.anim = this.getComponent(cc.Animation);
    },

    //初始化怪物属性
    initMonster: function (range) {
        this.moveRange = range;
    },

    //碰撞时触发
    onCollisionEnter: function (other, self) {
        var otherGroup = other.node.group;
        var selfGroup = self.node.group;
        // cc.log(self._size);
        //被英雄攻击
        if (otherGroup == "heroAttack" && selfGroup == "monster") {
            this.changeState(this.aiBeHitState);
            this.mCurState.execute(this);

            this.node.color = cc.Color.RED;
            this.anim.play('m001_beHit');
            var att = other.node.getComponent("ShootScript").attack;
            var hit = att - this.baseDefen;
            this.hp -= hit;
            this.beHitCount += 1;
            //扣血
            var bloodLabel = cc.instantiate(this.hitbloodLab);
            bloodLabel.position = cc.p(this.node.position.x, this.node.position.y + this.node.height * this.node.scaleY / 2);
            bloodLabel.getComponent(cc.Label).string = hit;
            this.node.parent.addChild(bloodLabel);
            bloodLabel.active = true;
            
            this.node.x = this.node.scaleX > 0 ?  this.node.x - 10 : this.node.x + 10;
            //血量低于零时触发死亡函数
            if (this.hp <= 0) {
                this.onDead();
            }
            if( this.beHitCount >=5){
                
            }
        }
    },

    //之前处于碰撞状态，离开碰撞范围后触发
    onCollisionExit: function (other, self) {},

    //攻击开始判断【帧事件】
    norAttackStart: function () {
        this.collider.enabled = true;
    },
    //结束攻击判断【帧事件】
    norAttackOver: function () {
        this.collider.enabled = false;
    },
    //动作结束【帧事件】
    actionOver: function () {
        this.unschedule(this.changeStateByTime);
        this.scheduleOnce(this.changeStateByTime, this.actionSpasticity);
    },
    //根据动作僵值时间，来执行
    changeStateByTime: function () {
        this.changeActionByState(AIState.AI_IDEL);
    },

    //被攻击后恢复正常状态
    onRecoverState: function () {
        this.anim.play('m001_stand');
        this.node.color = cc.Color.WHITE;
        this.aiState = AIState.AI_NONE;
    },

    //死亡后触发
    onDead: function () {
        this.node.runAction(cc.sequence(cc.blink(0.5, 4), cc.removeSelf(true)));
    },
    //被隐藏后执行
    onDisabled: function () {
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    //根据状态改变动画
    changeActionByState: function (state) {
        var anim = this.getComponent(cc.Animation);
        this.aiState = state;
        if (state == AIState.AI_IDEL) {
            anim.play('m001_stand');
        } else if (state == AIState.AI_PATROL || state == AIState.AI_PURSUIT) {
            anim.play('m001_run');
        } else if (state == AIState.AI_ATTACK) {
            var animName = 'm001_norAttack';
            this.nowHeroAction = animName;
            anim.play(animName);
        }
    },
    //巡逻时执行
    onPatrol: function () {
        var moveDirectionx = this.getRandomInt(-1, 2);
        var moveDirectiony = this.getRandomInt(-1, 2);
        this.moveDirection.x = moveDirectionx > 0 ? moveDirectionx + this.speed.x : moveDirectionx - this.speed.x;
        this.moveDirection.y = moveDirectiony > 0 ? moveDirectiony + this.speed.y : moveDirectiony - this.speed.y;
        this.nextDecisionTime = Math.random() * 100;
        this.node.scaleX = moveDirectionx > 0 ? Math.abs(this.node.scaleX) : -Math.abs(this.node.scaleX);
        this.changeActionByState(AIState.AI_PATROL);
    },
    //待机时执行
    onIdel: function () {
        this.changeActionByState(AIState.AI_IDEL);
        this.moveDirection = cc.p(0, 0);
    },
    //追击时执行
    onPursuit: function () {
        this.changeActionByState(AIState.AI_PURSUIT);
    },
    //获取随机数（min-max不包含max）
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    //攻击状态时执行
    onAttack: function () {
        var currentP = this.node.position; //当前坐标
        var heroPos = Hero.instance.node.position; //英雄坐标
        if (heroPos.x > currentP.x) {
            this.node.scaleX = Math.abs(this.node.scaleX);
        } else {
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }
        this.changeActionByState(AIState.AI_ATTACK);
        // if (Math.random() > 0.5) {
        //     this.changeActionByState(AIState.AI_ATTACK);
        // } else {
        //     var anim = this.getComponent(cc.Animation);
        //     this.aiState = AIState.AI_ATTACK;
        //     var animName = 'm001_skill1';
        //     this.nowHeroAction = animName;
        //     anim.play(animName);
        // }
    },
    //被攻击状态时执行
    onHit: function () {
        this.aiState = AIState.AI_BEHIT;
        this.unschedule(this.onRecoverState);
        this.scheduleOnce(this.onRecoverState, this.hitSpasticity);
    },

    //AI判断
    execute: function (target, targetBodyWidth) {
        //延时判定
        if (this.nextDecisionTime <= 0) {
            this.decide(target, targetBodyWidth);
        } else {
            this.nextDecisionTime--;
        }
    },

    //AI状态机FSM
    decide: function (target, targetBodyWidth) {
        var self = this;
        var pos = this.node.position;
        var distance = cc.pDistance(pos, target);
        distance = distance - targetBodyWidth / 2;
        var isFlipedX;
        if (self.node.scaleX < 0) {
            isFlipedX = true;
        } else {
            isFlipedX = false;
        }
        var aistate;
        if (distance < self.eyeArea) {
            aistate = distance < self.attackArea && Math.abs(pos.y - target.y) ? AIState.AI_ATTACK : AIState.AI_PURSUIT;
        } else {
            aistate = self.whetherIdel && Math.random() > 0.5 ? AIState.AI_IDEL : AIState.AI_PATROL;
        }

        switch (aistate) {
            case AIState.AI_ATTACK:
                {
                    cc.log("攻击");
                    this.moveDirection = cc.p(0, 0);
                    this.changeState(this.aiAttackState);
                    self.nextDecisionTime = Math.random() * 200;
                }
                break;
            case AIState.AI_IDEL:
                {
                    cc.log("待机");
                    this.changeState(this.aiIdelState);
                    self.nextDecisionTime = Math.random() * 100;
                }
                break;
            case AIState.AI_PATROL:
                {
                    cc.log("巡逻");
                    this.changeState(this.aiPatrolState);
                    self.nextDecisionTime = Math.random() * 100;
                }
                break;
            case AIState.AI_PURSUIT:
                {
                    cc.log("追击");
                    this.changeState(this.aiPursuitState);
                }
                break;
        }
        this.mCurState.execute(this);
    },

    update: function (dt) {
        this.execute(Hero.instance.node.position, Hero.instance.node.width);
        if (this.aiState == AIState.AI_PATROL) {
            var currentP = this.node.position; //当前坐标
            var expectP = cc.pAdd(currentP, this.moveDirection); //期望坐标
            var actualP = expectP; //实际坐标
            if (actualP.x < this.node.width / 2) {
                actualP.x = this.node.width / 2;
            }
            if (actualP.x > this.moveRange.x - this.node.width / 2) {
                actualP.x = this.moveRange.x - this.node.width / 2;
            }
            if (actualP.y < 0) {
                actualP.y = 0;
            }
            if (actualP.y > this.moveRange.y) {
                actualP.y = this.moveRange.y;
            }
            this.node.position = actualP;
            this.node.setLocalZOrder(-actualP.y);
        } else if (this.aiState == AIState.AI_PURSUIT) {
            var currentP = this.node.position; //当前坐标
            var heroPos = cc.p(Hero.instance.node.position.x - Hero.instance.node.width / 2 + Math.random() * Hero.instance.node.width, Hero.instance.node.position.y + Math.random() * Hero.instance.node.height); //英雄坐标
            var moveDirection = cc.pNormalize(cc.pSub(heroPos, currentP)); //获取单位向量
            this.node.scaleX = moveDirection.x < 0 ? -Math.abs(this.node.scaleX) : Math.abs(this.node.scaleX);
            moveDirection = cc.pCompMult(moveDirection, this.speed);
            var expectP = cc.pAdd(currentP, moveDirection); //期望坐标
            if (expectP.x < this.node.width / 2) {
                expectP.x = this.node.width / 2;
            }
            if (expectP.x > this.moveRange.x - this.node.width / 2) {
                expectP.x = this.moveRange.x - this.node.width / 2;
            }
            if (expectP.y < 0) {
                expectP.y = 0;
            }
            if (expectP.y > this.moveRange.y) {
                expectP.y = this.moveRange.y;
            }
            this.node.position = expectP;
            this.node.setLocalZOrder(-expectP.y);
        }
    }
});
/**
 * 怪物和英雄的基类脚本
 */
// 方向
var Direction = require('GlobalScript').Direction;
var ActionState = require('GlobalScript').ActionState;

//状态
var IdelState = require('IdelState');
var WalkState = require('WalkState');
var NorAttackState = require('NorAttackState');
var BeHitState = require('BeHitState');

var UnitSprite = cc.Class({
    'extends': cc.Component,

    properties: {
        attackNode: { // [近战攻击碰撞框]
            'default': null,
            type: cc.Node
        },
        hitbloodLab: { //飘血动画
            'default': null,
            type: cc.Prefab
        },
        effect1: {
            'default': null,
            type: cc.Node
        },
        effect2: {
            'default': null,
            type: cc.Node
        },
        animapre: {
            'default': null,
            type: cc.Prefab
        },
        shootNode: { //【远程攻击判断碰撞框】
            'default': null,
            type: cc.Prefab
        },
        id : 1,  //id
        type : 1,  //type:分为英雄（0）、怪物（1）
        hp: 0, //血量
        baseAtt: 0, //攻击
        baseDefen: 0, //防御
        _actionState: 0, //动作状态
        hitSpasticity: 0.5, //受击僵值
        actionSpasticity: 0.5, //动作僵值
        beHitCount : 0,      //受击数
        moveRange: new cc.Vec2(0, 0), //移动范围
        _attackMode: 0, //普通攻击模式
        speed: new cc.Vec2(0, 0) //速度
        
    },

    // use this for initialization
    onLoad: function onLoad() {
    },

    //改变状态机状态
    changeState: function changeState(enstate) {
        this.mCurState = enstate;
    },

    //攻击发出抛出物（远程）count：发出个数，
    attackShoot: function attackShoot(pos, count, animation) {
        if(animation){
            
        }else
        {
            for(let i =1; i <= count; i++){
                this.onShoot(pos , i);
            }
        }
    },

    /**
     * 远程攻击
     * 攻击模式（普通射击、2：技能
     * 位置模式（1：effect1，2：effect2, 3:effect1+effect2, 4:跟踪hero位置， 5：自定义位置）
     */
    onShoot: function onShoot(pos, count) {
        var shootNode = cc.instantiate(this.shootNode);
        shootNode.group =  this.type === 0 ? 'heroAttack' : 'monsterAttack';
        shootNode.parent = this.node.parent;
        shootNode.setLocalZOrder(this.node.getLocalZOrder() - 1);
        
        var shootpos;
        switch (pos) {
            case 1:
                var worldpos = this.effect1.convertToWorldSpaceAR(cc.Vec2.ZERO);
                shootpos = this.node.parent.convertToNodeSpace(worldpos);
                break;
            case 2:
                var worldpos = this.effect1.parent.convertToWorldSpace(this.effect2.position);
                shootpos = this.node.parent.convertToNodeSpace(worldpos);
                break;
            case 3:
                shootpos = Hero.instance.node.position;
                break;
            default:
                break;
        }
        var res = this.type === 0 ? "2hero_skill8"+this.id : "m"+this.id;
        shootNode.getComponent("ShootScript").initShoot("2hero_skill8", 25, 1, 1);
        shootNode.position = shootpos;
        shootNode.scaleX = this.node.scaleX > 0 ? Math.abs(shootNode.scaleX) : -Math.abs(shootNode.scaleX);
        var shootRange = this.node.scaleX > 0 ? 1200 : -1200;
        var delay = cc.delayTime(count * 0.1);
        var callback = cc.callFunc(function () {
            this.node.destroy();
        }, this);
        shootNode.runAction(cc.sequence(delay, cc.moveBy(1, cc.p(shootRange, 0)), cc.callFunc(function () {
            shootNode.destroy();
        }, shootNode)));
    },

    //技能(位置， 速度， )
    onskill: function onskill(pos, speed, res) {
        var loadAnim = cc.instantiate(this.animapre);
        loadAnim.parent = this.node.parent;
        loadAnim.setPosition(cc.p(800, 500));
        var AanimCtrl = loadAnim.getComponent(cc.Animation);
        cc.loader.loadRes("AnimationClip/skill/mskill_001", function (error, res) {
            if (!error) {
                AanimCtrl.addClip(res);
                AanimCtrl.play(res.name);
            }
        });
        var callback = cc.callFunc(function () {
            this.node.destroy();
        }, this);
        loadAnim.runAction(cc.sequence(cc.moveTo(0.8, cc.p(800, 150), callback)));
    }
});
module.exports = UnitSprite;
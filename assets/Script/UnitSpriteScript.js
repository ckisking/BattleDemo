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
    extends: cc.Component,

    properties: {
        attackNode : {                 // [近战攻击碰撞框]
            default : null,
            type : cc.Node
        },
        hitbloodLab : {             //怪物飘雪动画
            default : null,
            type : cc.Prefab
        },
        hp : 0,                        //血量
        baseAtt : 0,                   //攻击
        baseDefen : 0,                 //防御
        _actionState : 0,              //动作状态
        spasticity : 0.5,             //僵值
        moveRange : new cc.Vec2(0,0),      //移动范围 
        _attackMode : 0   //普通攻击模式    
    },

    // use this for initialization
    onLoad: function () {
    },
    
    //改变状态机状态
    changeState : function (enstate){
        this.mCurState = enstate; 
    },
    
    //攻击发出抛出物（远程）
    attackShoot : function () {
        var shootNode = cc.instantiate(this.shootNode);
        shootNode.parent = this.node.parent;
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
    
});
module.exports = UnitSprite;
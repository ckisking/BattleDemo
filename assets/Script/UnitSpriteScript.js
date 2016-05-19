/**
 * 怪物和英雄一些定义的基类定义
 */
// 方向
var Direction = require('GlobalScript').Direction;
var ActionState = require('GlobalScript').ActionState;
 
 //状态
var IdelState = require('IdelState');
var WalkState = require('WalkState');
var NorAttackState = require('NorAttackState');

var UnitSprite = cc.Class({
    extends: cc.Component,

    properties: {
        attackNode : {                 // [攻击碰撞框]
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
        moveRange : new cc.Vec2(0,0)      //移动范围     
    },

    // use this for initialization
    onLoad: function () {
    },
    
    //改变AI状态
    changeState : function (enstate){
        this.mCurState = enstate; 
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
module.exports = UnitSprite;
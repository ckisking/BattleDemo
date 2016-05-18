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
        hp : 0,                        //血量
        baseAtt : 0,                   //攻击
        baseDefen : 0,                 //防御
        _actionState : 0,              //动作状态
        
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
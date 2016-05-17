/**
 * 普通攻击状态
 */
var ActionState = require('GlobalScript').ActionState;
var NorAttackState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit._actionState; 
        //角色在任何情况下都能转化为待机状态
        if(oldState == ActionState.ACTION_STATE_IDLE || oldState == ActionState.ACTION_STATE_WALK || oldState == ActionState.ACTION_STATE_NONE){
            unit.changeActionByState(ActionState.ACTION_STATE_NOR_ATTACK);
        }
    },
    
});
module.exports = NorAttackState;
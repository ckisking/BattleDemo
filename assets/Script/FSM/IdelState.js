/**
 * 待机状态
 */
var ActionState = require('GlobalScript').ActionState;
var IdelState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit._actionState; 
        //角色在任何情况下都能转化为待机状态
        if(oldState != ActionState.ACTION_STATE_IDLE &&  oldState != ActionState.ACTION_STATE_BEHIT 
        && oldState != ActionState.ACTION_STATE_JUMP &&  oldState != ActionState.ACTION_STATE_SKILL_ATTACK 
        || oldState == ActionState.ACTION_STATE_NONE){
            unit.onIdel();
        }
    },
    
});
module.exports = IdelState;
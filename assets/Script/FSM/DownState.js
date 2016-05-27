/**
 * 倒地状态
 */
var ActionState = require('GlobalScript').ActionState;
var DownState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit._actionState; 
        //角色只有在待机、跑动过程中能跳动
        if(oldState == ActionState.ACTION_STATE_IDLE || oldState == ActionState.ACTION_STATE_WALK
        || oldState == ActionState.ACTION_STATE_RUN){
            unit.onJumpState();   
        }
    },
    
});
module.exports = DownState;

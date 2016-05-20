/**
 * 奔跑状态
 */
var ActionState = require('GlobalScript').ActionState;
var RunState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit._actionState; 
        //只有在角色不在被攻击、奔跑的状态下，才能改变状态为奔跑
        if(oldState != ActionState.ACTION_STATE_RUN && oldState != ActionState.ACTION_STATE_BEHIT){
            unit.onRunState();
        }
    },
    
});
module.exports = RunState;
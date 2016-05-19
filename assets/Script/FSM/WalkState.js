/**
 * 行走状态
 */
var ActionState = require('GlobalScript').ActionState;
var WalkState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit._actionState; 
        //只有在角色为待机、错误的状态下，才能改变状态为walk
        if(oldState != ActionState.ACTION_STATE_WALK && oldState != ActionState.ACTION_STATE_BEHIT){
            unit.onWalk();
        }
    },
    
});
module.exports = WalkState;
/**
 * 被攻击状态
 */
var ActionState = require('GlobalScript').ActionState;
var BeHitState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit._actionState; 
        //角色在攻击时无法被打断
        if(oldState != ActionState.ACTION_STATE_NOR_ATTACK){
            unit.onHit();   
        }
    },
    
});
module.exports = BeHitState;
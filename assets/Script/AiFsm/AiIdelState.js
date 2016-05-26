/**
 * AI待机状态
 */
var ActionState = require('GlobalScript').ActionState;
var AIState = require('GlobalScript').AIState; 
var AiIdelState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit.aiState; 
        //角色在不是[攻击]、[待机]、[被攻击]都能转化为待机状态
        if(oldState !=  AIState.AI_IDEL && oldState != AIState.AI_ATTACK 
        && oldState != AIState.AI_BEHIT){
            unit.onIdel();
        }
    },
    
});
module.exports = AiIdelState;
/**
 * AI追击状态
 */
var AIState = require('GlobalScript').AIState; 
var AiIdelState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit.aiState; 
        //当状态不是[攻击]、[追击]、[被攻击]时，转化为追击状态
        if(oldState !=  AIState.AI_PURSUIT && oldState != AIState.AI_ATTACK && oldState != AIState.AI_BEHIT){
            unit.onPursuit();
        }
    },
    
});
module.exports = AiIdelState;
/**
 * AI巡逻状态
 */
var ActionState = require('GlobalScript').ActionState;
var AIState = require('GlobalScript').AIState; 
var AiPatrolState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit.aiState; 
        //只要不是[攻击]、[被攻击]状态就能转化为巡逻状态
        if(oldState != AIState.AI_ATTACK && oldState != AIState.AI_BEHIT){
            unit.onPatrol();
        }
    },
    
});
module.exports = AiPatrolState;
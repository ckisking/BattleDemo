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
        //只有在角色为待机、错误的状态下，才能改变状态为walk
        if(oldState != AIState.AI_PATROL){
            unit.onPatrol();
        }
    },
    
});
module.exports = AiPatrolState;
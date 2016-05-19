/**
 * AI攻击状态
 */
var AIState = require('GlobalScript').AIState; 
var AiAttackState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit.aiState; 
        //角色在不是[攻击]、[被攻击]的状态下都能转化为攻击状态
        if(oldState != AIState.AI_ATTACK && oldState != AIState.AI_BEHIT){
            unit.onAttack();
        }
    },
    
});
module.exports = AiAttackState;
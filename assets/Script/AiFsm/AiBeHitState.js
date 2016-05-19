/**
 * AI被攻击状态
 */
var AIState = require('GlobalScript').AIState; 
var AiBeHitState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit.aiState; 
        unit.onHit();
    },
    
});
module.exports = AiBeHitState;
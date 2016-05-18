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
        //角色在任何情况下都能转化为待机状态
        if(oldState !=  AIState.AI_PURSUIT){
            unit.onIdel();
        }
    },
    
});
module.exports = AiIdelState;
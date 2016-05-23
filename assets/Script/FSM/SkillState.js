/**
 * 技能攻击状态
 */
var ActionState = require('GlobalScript').ActionState;
var SkillState = cc.Class({
    extends:  cc.Component, 

    properties: () => ({
     }),
     
    execute : function (unit) {
        //获取角色之前的状态
        var oldState = unit._actionState; 
        //角色只有在待机、跑动过程中能跳动
        if(oldState != ActionState.ACTION_STATE_SKILL_ATTACK && oldState != ActionState.ACTION_STATE_BEHIT
        && oldState != ActionState.ACTION_STATE_JUMP){
            unit.onSkillState();   
        }
    },
    
});
module.exports = SkillState;
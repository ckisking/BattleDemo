/**
 * 一些全局枚举变量
 */

//定义一些静态的全局变量
var GlobalVar = {
};


//方向枚举
var Direction  = cc.Enum({
    DEFAULT      : 0,
    D_UP         : 1,
    D_RIGHT_UP   : 2,
    D_RIGHT      : 3,
    D_RIGHT_DOWN : 4,
    D_DOWN       : 5,
    D_LEFT_DOWN  : 6,
    D_LEFT       : 7,
    D_LEFT_UP    : 8,
});

//角色状态枚举
var ActionState = cc.Enum({
    ACTION_STATE_NONE : -1,                
    ACTION_STATE_IDLE :-1,                 //待机状态
    ACTION_STATE_WALK : -1,                //行走状态
    ACTION_STATE_RUN : -1,                 //跑动状态
    ACTION_STATE_JUMP : -1,                //跳动状态
    ACTION_STATE_NOR_ATTACK : -1,          //普通攻击状态
    ACTION_STATE_SKILL_ATTACK : -1,        //技能攻击状态
    ACTION_STATE_BEHIT : -1,               //被攻击
    ACTION_STATE_DEAD : -1                 //死亡状态
});

//AI状态枚举
var AIState = cc.Enum({
    AI_NONE    : -1,
    AI_IDEL    : -1,                //待机
    AI_PATROL  : -1,                 //巡逻
    AI_ATTACK  : -1,                //攻击
    AI_PURSUIT : -1,                //追击
    AI_BEHIT : -1,                //追击
});

//攻击方式枚举（连续攻击会改变攻击方式）
var AttackMode = cc.Enum({
    ATTACK_DEFAULT : 0,
    ATTACK_1 : 1,
    ATTACK_2 : 2,
    ATTACK_3 : 3,
    ATTACK_4 : 4,
});

module.exports = {
    Direction,
    ActionState,
    AIState,
    AttackMode
};

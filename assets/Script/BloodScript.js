/**
 * 飘血动画控制
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        //飘血动作（加入随机延时，防止怪物一多所有血条叠加在一起）
        var bloodAction = cc.spawn(cc.moveBy(1.0, cc.p(0, 200)), cc.fadeOut(1.0)); 
        var delay = cc.delayTime(Math.random() * 0.1); 
        this.node.runAction(cc.sequence(delay, bloodAction, cc.removeSelf())).easing(cc.easeIn(2.0));
    },
});

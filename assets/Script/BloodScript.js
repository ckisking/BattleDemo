/**
 * 飘血动画控制
 */
cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        //飘血动作（加入随机延时，防止怪物一多所有血条叠加在一起）
        var bloodAction = cc.spawn(cc.moveBy(1.5, cc.p(0, 300)), cc.fadeOut(1.5));
        var delay = cc.delayTime(Math.random() * 0.1);
        this.node.runAction(cc.sequence(delay, bloodAction, cc.callFunc(function () {
            this.node.destroy();
        }, this))).easing(cc.easeIn(2.0));
    }
});
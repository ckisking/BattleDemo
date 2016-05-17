/**
 * 飘血动画控制
 */
var bloodAction = {
    move : cc.moveBy(0.5, cc.p(0, 40)),
    hide : cc.fadeOut(0.5)
}
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.node.runAction(cc.sequence(bloodAction.move, bloodAction.hide, cc.removeSelf()));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

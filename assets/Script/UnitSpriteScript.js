/**
 * 怪物和英雄一些定义的基类定义
 */
var UnitSprite = cc.Class({
    extends: cc.Component,

    properties: {
        hp : 0,
        baseAtt : 0,
        baseDefen : 0
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
module.exports = UnitSprite;
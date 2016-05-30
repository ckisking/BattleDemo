/**
 * 主角或者怪物抛出物体控制脚本
 */
cc.Class({
    extends : cc.Component,

    properties: {
        attack: 0, //攻击力
        attackCount: 0, //攻击次数
        attackMode: 0 },

    //攻击模式（普通0、子弹1、持续性魔法2）
    // use this for initialization
    onLoad: function () {},

    //初始化抛出物体
    initShoot: function (res, attack, attackCount, attackMode) {
        this.attack = attack;
        this.attackCount = attackCount;
        this.attackMode = attackMode;
        this.node.getComponent("cc.BoxCollider").size.width = this.node.width;
        this.node.getComponent("cc.BoxCollider").size.height = this.node.height;
        var self = this;

        cc.loader.loadRes("2hero/2hero_1", cc.SpriteAtlas, function (err, atlas) {
            self.node.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(res);
        });
    },

    onCollisionEnter: function (other, self) {
        if (this.attackMode == 0) {
            return;
        }
        this.node.removeFromParent(true);
    }

});
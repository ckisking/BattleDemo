cc.Class({
    extends: cc.Component,

    properties: {
        floorNode : {          //[地板]
            default : null,
            type : cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.hero = cc.find("Canvas/BattleLayer/floorNode/heroNode");
        this.monster = cc.find("Canvas/BattleLayer/floorNode/monsterNode");
        this.monster.getComponent('MonsterScript').initMonster(cc.p(this.floorNode.width, this.floorNode.height));
        this.hero.getComponent('HeroScript').initHero(cc.p(this.floorNode.width, this.floorNode.height));
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        cc.log("hp:" + this.monster.hp);
        this.monster.getComponent('MonsterScript').execute( this.hero.position, this.hero.width);
    },
});

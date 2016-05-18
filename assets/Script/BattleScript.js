/**
 * 战斗场景中总控制脚本
 */
var Monster = require('MonsterScript');
var Hero = require('HeroScript');
cc.Class({
    extends: cc.Component,

    properties: {
        floorNode : {          //[地板]
            default : null,
            type : cc.Node
        },
    },
    statics : {
        monsterArr   : [],           //弧度
        m_hero : 10,                   //方向
    }, 
    // use this for initialization
    onLoad: function () {
        this.hero = cc.find("Canvas/BattleLayer/floorNode/heroNode");
        this.monster = cc.find("Canvas/BattleLayer/floorNode/monsterNode");
        this.monster.getComponent('MonsterScript').initMonster(cc.p(this.floorNode.width, this.floorNode.height));
        this.hero.getComponent('HeroScript').initHero(cc.p(this.floorNode.width, this.floorNode.height));
        this.m_hero = 1;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.monster.getComponent('MonsterScript').execute( this.hero.position, this.hero.width);
    },
});

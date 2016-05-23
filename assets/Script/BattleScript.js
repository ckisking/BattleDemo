/**
 * 战斗场景中总控制脚本
 */
var Monster = require('MonsterScript');
var Hero = require('HeroScript');
var Battle = cc.Class({
    extends: cc.Component,

    properties: {
        floorNode: {          //[地板]
            default: null,
            type: cc.Node
        },
        bgNode: {
            default: null,
            type: cc.Node
        }
    },
    statics: {
        monsterArr: [],           //怪物数组
    },
    // use this for initialization
    onLoad: function () {
        this.hero = cc.find("Canvas/BattleLayer/floorNode/heroPrefab");
        this.monster = cc.find("Canvas/BattleLayer/floorNode/monsterNode");
        this.monster.getComponent('MonsterScript').initMonster(cc.p(this.floorNode.width, this.floorNode.height));
        this.hero.getComponent('HeroScript').initHero(cc.p(this.floorNode.width, this.floorNode.height));

        //开启碰撞
        cc.director.getCollisionManager().enabled = true;
        //开启显示碰撞框
        cc.director.getCollisionManager().enabledDebugDraw = true;
        this.winsize = cc.director.getWinSize();
        //加载图集
        // cc.loader.loadResAll("2hero", cc.SpriteFrame, function (err, assets) {
        //     if(err){
        //           cc.log(err);
        //      }
        //      var count = assets.length;
        //      cc.log("图片:" + count);
        //     });
    },

    //普通按钮回调
    onNorAttackCall: function () {
        Hero.onNorAttackCall();
    },
    //跳跃按钮回调
    onJumpCall: function () {
    },

    //屏幕滚动
    screenRol: function () {
        var heroPos = Hero.instance.node.parent.convertToWorldSpace(Hero.instance.node.position);
        var bgNodePos = this.bgNode.position;
        var herospeedX = Hero.instance.speed.x;
        if (heroPos.x > this.winsize.width / 2 && herospeedX > 0) {
            bgNodePos.x -= Hero.instance.speed.x;
            if(bgNodePos.x <= -1280){
                bgNodePos.x = -1280;
            }
        }
        else if(heroPos.x < this.winsize.width / 2 && herospeedX < 0){
             bgNodePos.x -= Hero.instance.speed.x;
            if(bgNodePos.x >= 0){
                bgNodePos.x = 0;
            }
        }
        this.bgNode.x = bgNodePos.x;
        this.floorNode.x = bgNodePos.x;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.screenRol();
        // this.monster.getComponent('MonsterScript').execute( this.hero.position, this.hero.width);1
    },
});

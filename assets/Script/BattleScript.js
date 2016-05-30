/**
 * 战斗场景中总控制脚本
 */
var Monster = require('MonsterScript');
var Hero = require('HeroScript');
var Battle = cc.Class({
    extends : cc.Component,

    properties: {
        floorNode: { //[地板]
            default: null,
            type: cc.Node
        },
        bgNode: {
            default: null,
            type: cc.Node
        },
        cdbtn: {
            default: [],
            type: cc.Node
        },
        battleUi: {
            default: null,
            type: cc.Node
        },
        hpBar : {
            default : null,
            type : cc.Sprite
        },
        monsterNode : {
            default : null,
            type : cc.Prefab
        },
        shootNode : {
            default : null,
            type : cc.Prefab
        }
    },
    statics: {
        monsterArr: [] },
    //怪物数组
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
        cc.loader.loadResAll("2hero", cc.SpriteFrame, function (err, assets) {
            if(err){
                  cc.log(err);
             }
             var count = assets.length;
             cc.log("图片:" + count);
            });
            
        this.cdbtn[0].tag = 10001;
        this.cdbtn[0].on("touchstart", (event)=>{
               Hero.instance.onSkillCall(event.target.tag);
        })
        this.cdbtn[1].tag = 10002;
        this.cdbtn[1].on("touchstart", (event)=>{
               Hero.instance.onSkillCall(event.target.tag);
        })
        this.cdbtn[2].tag = 10003;
        this.cdbtn[2].on("touchstart", (event)=>{
               Hero.instance.onSkillCall(event.target.tag);
        })
        this.cdbtn[3].tag = 10004;
        this.cdbtn[3].on("touchstart", (event)=>{
               Hero.instance.onSkillCall(event.target.tag);
        })
        this.cdbtn[4].tag = 5;
        this.cdbtn[4].on("touchstart", (event)=>{
               Hero.instance.onskill(1,1);
        })
        //格式化输出字符测试
        var template1="我是{0}，今年{1}了";
        var result1=template1.format("loogn",22);
        cc.log(result1);
        window.myType = "TARGET";
        this.node.on("TARGET", function(event){
            cc.log(event.detail);
        },this);
        
    },
    
    //测试
    createNode : function (){
        // this.enabled = false;
        cc.director.getScheduler().pauseAllTargets();
    },
    
    //动态添加按钮（技能）
    loadskillButton: function () {
        var btn = cc.instantiate(this.cdbtn);
        btn.getComponent('CdButton').initBtn(1001, 2, "image/skillicon/Mission_Skill_5_disable");
        btn.position = cc.p(200, 100);
        this.battleUi.addChild(btn);
        btn.active = true;
    },

    //普通按钮回调
    onNorAttackCall: function () {
        Hero.onNorAttackCall();
    },
    //跳跃按钮回调
    onJumpCall: function () {},

    //保存数据按钮(测试动态添加button)
    onSaveCall: function () {
        var node = cc.instantiate(new cc.Node("newNode"));
        var commponent = node.addComponent(cc.Sprite);
        component.spriteFrame = "";
    },

    //屏幕滚动
    screenRol: function () {
        var heroPos = Hero.instance.node.parent.convertToWorldSpace(Hero.instance.node.position);
        var bgNodePos = this.bgNode.position;
        var herospeedX = Hero.instance.speed.x;
        var border = this.winsize.width - 2560;
        if (heroPos.x > this.winsize.width / 2 && herospeedX > 0) {
            bgNodePos.x -= Hero.instance.speed.x;
            if (bgNodePos.x <= border) {
                bgNodePos.x = border;
            }
        } else if (heroPos.x < this.winsize.width / 2 && herospeedX < 0) {
            bgNodePos.x -= Hero.instance.speed.x;
            if (bgNodePos.x >= 0) {
                bgNodePos.x = 0;
            }
        }
        this.bgNode.x = bgNodePos.x;
        this.floorNode.x = bgNodePos.x;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.screenRol();
        this.hpBar.fillRange = Hero.instance.hp / 1000;
        // this.monster.getComponent('MonsterScript').execute( this.hero.position, this.hero.width);1
    }
});
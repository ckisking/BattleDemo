cc.Class({
    extends : cc.Component,

    properties: {
        cdBg: {
            default : null,
            type: cc.Sprite
        },
        skillcd: 5
    },

    // use this for initialization
    onLoad: function () {
        var _this = this;

        this.isCD = false;
        this.node.on("touchstart", function (event) {
            if (_this.isCD) {
                cc.log("冷却中。。。。无法释放技能");
                event.stopPropagationImmediate();
                return;
            }
            _this.cdBg.fillRange = 1;
            _this.isCD = true;
            _this.schedule(_this.updateFillRange, 0.1);
            cc.log("放了一个技能，进入冷却");
        });
    },

    //初始化
    initBtn: function (skillid, cd, res) {
        this.node.tag = skillid;
        this.skillcd = cd;
        var image = this.cdBg;
        cc.loader.loadRes(res, cc.SpriteFrame, function (error, spriteFrame) {
            if (!error) {
                image.spriteFrame = spriteFrame;
            }
        });
    },
    
    //技能冷却,根据speed来修改冷却的时间
    updateFillRange: function (dt) {
        var fillRange = this.cdBg.fillRange;
        fillRange = fillRange - 0.1 / this.skillcd;
        if (fillRange <= 0) {
            fillRange = 0;
            cc.log("冷却完毕");
            this.isCD = false;
            this.unschedule(this.updateFillRange);
        }
        this.cdBg.fillRange = fillRange;
    }
});
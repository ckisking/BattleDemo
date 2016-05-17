cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.hero = cc.find("Canvas/BattleLayer/floorNode/heroNode");
        this.monster = cc.find("Canvas/BattleLayer/floorNode/monsterNode");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.monster.getComponent('MonsterScript').execute( this.hero.position, this.hero.width);
    },
});

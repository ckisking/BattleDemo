/**
 * 摇杆脚本封装
 */

// 方向
var Direction = require('GlobalScript').Direction;

var Rocker = cc.Class({
    extends: cc.Component,
    
    properties: {
        rockerBase : {             //底盘
            default : null,
            type : cc.Node
        },
        _radius    : 0,           //可移动半径
        _angle     : 0,           //角度
    },
    statics : {
        _radians   : 0,           //弧度
        _direction : 0,           //方向
        _speed     : 0            //移动速度
    },
    // use this for initialization
    onLoad: function () {
        //初始化半径
        this._radius = this.rockerBase.width / 2;
        
        //监听触摸
        this.node.on("touchstart", this.onTouchBegan, this );
        this.node.on("touchmove", this.onTouchMoved, this );
        this.node.on("touchend", this.onTouchEnd, this );
        this.node.on('touchcancel', this.onTouchEnd, this);
    },
    
    //获得角度
    getAngle : function (pos) {
        this._angle = Math.atan2(pos.y, pos.x) * 57.29577951;
        return this._angle;
    },
    //获得弧度
    getRadians : function (pos) {
      Rocker._radians = Math.PI / 180 * this.getAngle(pos);
      return Rocker._radians;  
    },
    //获取长度
    getLength : function (pos) {
        return Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    },
    
    //触摸开始
    onTouchBegan : function (touch){
        var locationInNode = this.rockerBase.convertTouchToNodeSpaceAR(touch);
        this.node.color = cc.Color.RED;
        this.node.position = locationInNode;
    },
    
    //触摸移动
    onTouchMoved : function (touch) {
        var self = this;
        var locationInNode = self.rockerBase.convertTouchToNodeSpaceAR(touch);
        
        // 更新[角度]
        self.getAngle(locationInNode);
        // 更新[弧度]
        self.getRadians(locationInNode);
        // 更新[方向]
        self.onUpdateDirection(locationInNode);
        // 长度获取[当前触摸点相对摇杆中心点]
        var tmpLength = self.getLength(locationInNode);
        
        // 滑点活动区域判断[如果不在摇杆区域内]
        if ( tmpLength > self._radius){
            // TODO 速度更新[速度达到最大值]
            Rocker._speed = 1;
            // _knob超出区域
            var x = Math.cos(Rocker._radians) * self._radius;
            var y = Math.sin(Rocker._radians) * self._radius;
            self.node.position = cc.p(x, y);
        }else{
            // TODO 速度更新
            Rocker._speed = tmpLength / self._radius;
            self.node.position = locationInNode;
        }
    },
    
    //触摸结束
    onTouchEnd : function () {
        this.node.position = cc.p(0,0);
        this.node.color = cc.Color.WHITE;
        Rocker._direction = Direction.DEFAULT;
    },
    
    // 角度更新
    onUpdateDirection : function(position){
        if(this._angle > -22.5 && this._angle < 22.5){
            Rocker._direction = Direction.D_RIGHT;
        }
        else if(this._angle > 22.5 && this._angle < 67.5){
            Rocker._direction = Direction.D_RIGHT_UP;
        }
        else if(this._angle > 67.5 && this._angle < 112.5){
            Rocker._direction = Direction.D_UP;
        }
        else if(this._angle > 112.5 && this._angle < 157.5){
            Rocker._direction = Direction.D_LEFT_UP;
        }
        else if((this._angle > 157.5 && this._angle < 180)||(this._angle < -157.5 && this._angle > -180)){
            Rocker._direction = Direction.D_LEFT;
        }
        else if(this._angle < -112.5 && this._angle > -157.5){
            Rocker._direction = Direction.D_LEFT_DOWN;
        }
        else if(this._angle < -67.5 && this._angle > -112.5){
            Rocker._direction = Direction.D_DOWN;
        }
        else if(this._angle < -22.5 && this._angle > -67.5){
            Rocker._direction = Direction.D_RIGHT_DOWN;
        }
    },
});
module.exports = Rocker;
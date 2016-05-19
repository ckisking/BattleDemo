cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Label,
            notify: function () {
                // clean content when overflow.
            },
        },
        dragBar: {
            default: null,
            type: cc.Node,
        },
        resizeBtn: {
            default: null,
            type: cc.Node,
        },
        cmdEditBox: {
            default: null,
            type: cc.EditBox,
        },
        pause : false
    },

    onLoad: function () {
        
        var self = this;
        
        cc.log = function (str) {
            if(!self.pause){
                self.content.string += 'log: ' + str + '\n';
                if(self.content.node.height >= 1000){
                     self.content.string = "";
                }
            }
    
        };
        
        cc.warn = function (str) {
            self.content.string += 'warn: ' + str + '\n';
        };
        
        cc.error = function (str) {
            self.content.string += 'error: ' + str + '\n';
        };
        
        cc.syslog = function (str) {
            self.content.string += str + '\n';
        };
        
        
        self.content.node.on('touchmove', function ( touch) {
            var y = touch.getPreviousLocation().y - touch.getLocationY();
            
            this.y += -y;
            if (this.y > 0 || -this.y > (this.height + this.parent.y))
                this.y += y;
        });
        
        self.dragBar.on('touchmove', function ( touch ) {
            var x = touch.getPreviousLocation().x - touch.getLocationX();
            var y = touch.getPreviousLocation().y - touch.getLocationY();
            this.parent.x += -x;
            this.parent.y += -y;
        });
        
        self.resizeBtn.on('touchmove', function ( touch ) {
            var lastPos = touch.getPreviousLocation();
            this.parent.width += touch.getLocationX() - lastPos.x;
            this.parent.height += lastPos.y - touch.getLocationY();
            self.content.node.width = this.parent.width - this.width;
        });
        
    },
    
    commandSubmit: function () {
        
        var content = this.cmdEditBox.string;
        
        if (content === '')
            return;
            
        cc.syslog('cmd: ' + content);
        var cmds = this.cmdEditBox.string.split(' ');
        
        var fun = this[cmds[0]];
        if (!fun) {
            cc.syslog('Invalid command !');
        }
        else{
            fun(this, cmds);
        }
        this.cmdEditBox.string = '';
        
    },
    
    // Command
    Help: function () {
        var cmdList = [
            '\n -- cl : Clean the screen',
            '\n -- e [script] : Execute the script',
            '\n -- q : Quit the console'
        ];
        cc.log('Command List:' + cmdList);
    },
    
    Cl: function (self) {
        var content = self.content;
        content.string = '';
    },
    
    E: function (self, cmds) {
        var script = '';
        for (var i = 1; i < cmds.length; ++i) {
            script += cmds[i] + ' ';
        }
        eval(script);
    },
    
    Q: function (self) {
        self.node.destroy();  
    },
    
    Z: function (self) {
        if(self.pause){
            self.pause = false;
        }
        else{
            self.pause = true;    
        } 
    },
});

var Class = function () { };
const util = {
  isArray : function(arr){
    return Object.prototype.toString.call(arr) === '[object Array]';
  },
  getHistories: function(node, arr){
    arr.unshift(node);
    if(node.father){
      util.getHistories(node.father, arr)
    }
  },
  deselectAllItems: function(items){
    util.isArray(items)&&items.forEach(item=>{
      item.selecting = false;
    });
  },
  getOperations: function(items){

  },
  throttle: function(delay, action){
    var last = 0;
    return function(){
      var curr = +new Date()
      if (curr - last > delay){
        action.apply(this, arguments)
        last = curr
      }
    }
  },
  getCanSelectedItems: function(length, dragData){
    var rowCount = Math.floor((document.body.clientWidth - 216)/138);
    var remainder = (document.body.clientWidth - 216)%138;
    var x1,x2,y1,y2,arr=[];
    x1 = Math.floor((dragData.left-216)/138);
    x2 = Math.min(Math.floor((dragData.left-216 + dragData.width)/138), rowCount-1);
    y1 = Math.floor((dragData.top-70)/104);
    y2 = Math.floor((dragData.top-70+ dragData.height)/104) ;
    for(var i = y1; i <= y2; i++){
      for(var j = x1; j <= x2 ; j++){
        var idx  = i*rowCount + j;
        if(idx < length){
          arr.push(i*rowCount + j);
        }
      }
    }
    return arr;
  },
  getMaterialType: function(material){
    var ctype = 'other';
    if (obj.type == 16) {
      ctype = 'folder';
    } else {
      ctype = "file";
      if (obj.type == 32) {
        switch (obj.subtype) {
          case 0x01:
          case 0x02:
          case 1024:
          case 512:
          case 2048:
            ctype = "video";
            break;
          case 0x0004:
            ctype = "audio";
            break;
          case 0x002000:
            ctype = "txtfile";
            break;
          case 0x004000:
            ctype = "word";
            break;
          case 0x008000:
            ctype = "ppt";
            break;
          case 0x010000:
            ctype = "excel";
            break;
          case 0x040000:
            ctype = "pdf";
            break;
          case 0x000020:
            ctype = "image";
            break;
          case 0x10000000:
            ctype = 'rar';
            break;
        }
      }
      else if (obj.type == 0x40) {
        if (obj.subtype == 1) {
          ctype = "sequence";
        }
        else if (obj.subtype == 3 || obj.subtype == 2 || obj.subtype == 4) {
          ctype = "h5pgm";
        }
      }
      else if (obj.type == 0x80000) {
        ctype = "log";
      }
      else if (obj.type == 0 && obj.subtype == 0) {
        ctype = "rar";
      }
    }
    return ctype;
  },
  parseData: function(arr, father, option){
    var floor = 0;
    if(father){
      floor = father.floor + 1;
    }
    if(util.isArray(arr)){
      arr.forEach(item=>{
        item.floor = floor,
        item.selected = false;
        item.father = father;
        item.openned = false;
        if(item.children && util.isArray(item.children)){
          util.parseData(item.children, item);
        }
        else{
          item.children = [];
        }
      });
      //may sort filter by option
    }
    else{
      arr = [];
    }
    return arr;
  }
}
Class.extend = function (properties) {
    var initializing = false;
    var functionTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

    var _super = this.prototype;

    initializing = true;
    var prototype = new this();
    initializing = false;

    for (var name in properties) {
        prototype[name] = typeof properties[name] == "function" &&
        typeof _super[name] == "function" && functionTest.test(properties[name]) ?
        (function (name, fun) {
            return function () {
                var tmp = this._super;

                this._super = _super[name];
                var ret = fun.apply(this, arguments);
                this._super = tmp;

                return ret;
            };
        })(name, properties[name]) :
        properties[name];
    }

    function Class() {
        if (!initializing && this.init)
            this.init.apply(this, arguments);
    }

    Class.prototype = prototype;

    Class.constructor = Class;

    Class.extend = arguments.callee;

    return Class;
};

Array.prototype.remove = function(item){
  var idx = this.indexOf(item);
  if(idx > -1){
      this.splice(idx, 1);
  }
  return idx;
}

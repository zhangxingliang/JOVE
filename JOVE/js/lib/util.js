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
const Tree = Class.extend({
  init: function(obj){
    var _floor,
        _selected,
        _openned,
        _name,
        _children;

        //init  不知道为啥不初始化在绑定中不能触发更新
        this.openned = false;
        this.selected = false;
        this.children  = [];
        this.floor = 0;
        _name = 123;
    var getChildren = function(val){
      if(util.isArray(val)){
          var arr = [];
          val.forEach(function(item){
            item.floor = _floor + 1;
            arr.push(new Tree(item));
          });
          return arr;
      }
      else {
        return [];
      }
    }
    if(util.isArray(obj)){
      _floor = 0;
      _selected = false;
      _openned = true;
      _children = getChildren(obj);
    }
    else if(typeof obj === 'object'){
      for(var key in obj){
        this[key] = obj[key];
      }
      if(obj.floor && obj.floor > 0){
        _floor = Math.floor(obj.floor);
      }
      else {
        _floor = 0;
      }
      _selected = !!obj.selected || false;
      _openned = !!obj._openned || true;;
      _children = getChildren(obj.children);
    }
    Object.defineProperties(this, {
              floor: {
                  get: function(){
                    return _floor;
                  },
                  set: function(val){
                    if(!val || val < 0 ){
                      _floor = 0;
                    }
                    else{
                      _floor = val;
                    }
                  }
              },
              selected: {
                get: function(){
                  return _selected;
                },
                set: function(val){
                  _selected = val;
                }
              },
              name: {
                get: function(){
                  return _name;
                },
                set: function(val){
                  _name = val;
                }
              },
              openned: {
                get: function(){
                  return _openned;
                },
                set: function(val){
                  _openned = val;
                }
              },
              children: {
                  get: function () {
                      return _children;
                  },
                  set: function(val){
                    _children = getChildren(val);
                  }
              }
          });
  }
});

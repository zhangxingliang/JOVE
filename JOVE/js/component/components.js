const history_ctrl = {
    template: "#history_ctrl",
    computed: {
      histories(){
        return this.$store.state.histories;
      }
    },
    methods: {
        showClips: function (node) {
            this.$store.dispatch("nodeClick", node);
        },
        backUp: function () {
            this.$store.commit("backUp");
        }
    }
};

const tree_ctrl =
{
    template: "#tree_ctrl",
    props: {
        items: Array
    },
    name: "tree-ctrl",
    data: function () {
        return {
        };
    },
    methods: {
        nodeClick: function (node) {
            this.$store.dispatch("nodeClick", node);
        },
        nodeDblClick: function (node) {
            this.$store.dispatch("nodeDblClick", node);
        },
        nodeToggle: function(node){
            this.$store.dispatch("nodeToggle", node)
        }
    },
    computed: {
      nodes(){
        // 排序在这里处理
        return this.items;//.filter(item=>item.type == 'folder').sort();
      },
      selectedNode(){
        var len = this.$store.state.histories.length;
        return len > 0 ? this.$store.state.histories[len-1] : null;
      }
    }
};

const tree_ctrl2 =
{
    template: "#tree_ctrl2",
    props: {
        data: Object
    },
    name: "tree-ctrl2",
    data: function () {
        return {
        };
    },
    methods: {
        nodeClick: function () {
            this.$store.dispatch("nodeClick", this.node);
        },
        nodeDblClick: function (node) {
            this.$store.dispatch("nodeDblClick", this.node);
        },
        nodeToggle: function(node){
            this.$store.dispatch("nodeToggle", this.node)
        }
    },
    computed: {
      node(){
        return this.data;//.filter(item=>item.type == 'folder').sort();
      },
      selectedNode(){
        var len = this.$store.state.histories.length;
        return len > 0 ? this.$store.state.histories[len-1] : null;
      }
    }
};
const material_ctrl = {
  template: "#material_ctrl",
  props: {
    data: Object
  },
  methods: {
    itemClick: function(event){
      if(!event.ctrlKey){
        this.$store.dispatch("deselectAllItems", null);
        this.$store.dispatch("itemSelected", this.material);
      }
    },
    itemMuiltClick: function(event) {
      this.$store.commit({
        type :"selectItem",
        srcNode : this.material,
        data : null
      });
    },
    itemDblClick: function(event){
      this.$store.dispatch("itemDblClick", this.material);
    },
    contextMenu: function(event){
      if(this.material.selecting){
        this.$store.dispatch("activeMenu", event);
      }
      else{
        this.$store.dispatch("deselectAllItems", this.material);
        this.$store.dispatch("itemSelected", this.material);
        this.$store.dispatch("activeMenu", event);
      }
    }
  },
  computed: {
    material(){
      return this.data;
    }
  }
}

const menu_ctrl = {
  template: "#menu_ctrl",
  data: function(){
    return {opts :
    [
      {
        name: "Open",
        func: function(item){
          this.$store.dispatch("itemDblClick", item);
        }
      },
      {
        name: "Delete",
        func: function(item){
          this.$store.dispatch("delete", item);
        }
      },
      {
        name: "Rename",
        func: function(item){
          this.$store.dispatch("rename", item);
        }
      },
      {
        name: "Move",
        func: function(item){
          this.$store.dispatch("move", item);
        }
      },
      {
        name: "Copy",
        func: function(item){
          this.$store.dispatch("copy", item);
        }
      },
      {
          name: "New Folder",
          func: function(item){
            this.$store.dispatch("newFolder", item);
          }
      },
      {
          name: "Order By",
          func: function(item){
            this.$store.dispatch("orderBy", item);
          }
      },
      {
        name: "Refresh",
        func: function(item){
          this.$store.dispatch("Refresh", item);
        }
    },
    {
      name: "Property",
      func: function(item){
        this.$store.dispatch("Property", item);
      }
    }
    ]}
  },
  methods: {
    apply: function(operation){
      //调用弹窗询问或直接执行
      operation.func(this.data);
    }
  },
  computed: {
    data(){
      return this.$store.getters.currentNode.children.filter(item=>item.selecting==true);
    },
    position(){
      //如果超出则自动适应根据
      var p = {
        active : this.$store.state.mousePosition.active
      };
      if(p.x + 200 > this.$store.clientWidth)
      {
        p.x = this.$store.state.mousePosition.x - 200;
      }
      else {
        p.x = this.$store.state.mousePosition.x;
      }
      p.y = this.$store.state.mousePosition.y;
      return p;
    },
    operations(){
      if(this.data.length > 0){
        return this.opts.slice(0,5);
      }
      else {
        return this.opts.slice(5);
      }
    }
  }
}
const app_ctrl = {
  template: "#app_ctrl"
}
const main_ctrl = {
  template: "#main_ctrl"
}
const left_ctrl = {
  template: "#left_ctrl",
  computed: {
    nodes(){
      return this.$store.state.nodes;
    }
  }
}
const header_ctrl = {
  template: "#header_ctrl",
  methods: {
    showTM(){
      this.$store.dispatch("showTM");
    },
    logout(){
      this.$store.dispatch("logout");
    },
    help(){

    }
  },
  computed: {
    langDic(){
      return this.$store.state.languageDic;
    },
    userInfo(){
      return this.$store.state.userInfo;
    }
  }
}

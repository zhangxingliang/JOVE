var t = [
            {
              name: 'MaterialList',
              selected: false,
              selecting:false,
              openned:false,
              path: '/MaterialList',
              floor: 1,
              type : "folder",
              children:[]
            },
            {
              name: 'Search Result',
              selected: false,
              selecting:false,
              openned:false,
              path: '/Search Result',
              floor: 1,
              type : "folder",
              children:[]
            }
          ];
          var q = [
                      {
                        name: 'MaterialListfffffffffffffffffffff',
                        selected: false,
                        selecting:false,
                        openned:false,
                        path: '/MaterialList',
                        floor: 2,
                        type : "folder",
                        father:t[0],
                        children:[]
                      },
                      {
                        name: 'Search Result',
                        selected: false,
                        selecting:false,
                        openned:false,
                        path: '/Search Result',
                        floor: 2,
                        type : "edl",
                        father:t[0],
                        children:[]
                      }
                    ];
t[0].children = q;
const store = new Vuex.Store({
  state: {
    histories: [],
    nodes : t,
    languageDic : languageDic.en,
    userInfo : {username:123},
    mousePosition :{
      x : 0,
      y : 0,
      active : false
    }
  },
  getters:{
    items: state=>{
      return state.nodes;
    },
    currentNode: state=>{
      if(state.histories.length > 0){
        return state.histories[state.histories.length-1];
      }
      return {children:[]};
    },
  },
  plugins: [NotifyPlugin],
  mutations: {
    backUp (state) {
      var l = state.histories.length;
      if(l > 1){
        state.histories.splice(-1, 1)[0].selected = false;
      }
      state.histories[state.histories.length-1].selected = true;
      //else do nothing or grey backUp icon
    },
    setNodes(state, payload){
      payload.srcNode.nodes = payload.data;
      if(state.histories.length){
        state.histories[state.histories.length-1].selected = false;
      }
      payload.srcNode.selected = true;
      state.histories.length = 0 ;
      util.getHistories(payload.srcNode, state.histories);

    },
    nodeToggle(state, payload){
      //如果是这样，消息通知逻辑需要适配，不发送关闭文件夹通知，这样能提高用户体验，不要每次刷新；
    //  payload.srcNode.name += "open!";//!payload.srcNode.openned;
      payload.srcNode.openned = !payload.srcNode.openned;
    //  payload.srcNode.name += 123;
      //payload.srcNode.openned = false;
    },
    selectItem(state, payload){
      //如果是这样，消息通知逻辑需要适配，不发送关闭文件夹通知，这样能提高用户体验，不要每次刷新；
    //  payload.srcNode.name += "open!";//!payload.srcNode.openned;
      payload.srcNode.selecting = !payload.srcNode.selecting;
    //  payload.srcNode.name += 123;
      //payload.srcNode.openned = false;
    },
    deselectAllItems(state, payload){
      payload.data && util.deselectAllItems(payload.data);
    },
    disableMenu(state, payload){
      state.mousePosition.active = false;
    }

  },
  actions: {
    nodeClick(context, node){
      context.commit({
        type : "setNodes",
        srcNode : node,
        data : []
        });
      //http get items then bind
      //Vue.$http.get("").then(res=>{
        //context.commit({
        //  type : "setNodes",
        //  srcNode : node,
        //  data : res.data
      //  });
    //  }).catch(res=>{
        //show error message
      //});
    },
    nodeDblClick(context, node){
      //http get items then bind
      context.dispatch("nodeClick", node);
      //then 展开文件夹
      context.dispatch("nodeToggle", node); //左右两侧文件夹应为同一对象
    },
    deselectAllItems(context, item){
      context.commit({
        type : "deselectAllItems",
        srcNode : item,
        data : context.getters.currentNode.children.filter(item=>item.selecting == true)
      });
    },
    itemSelected(context, item){
      context.commit({
        type : "selectItem",
        srcNode : item,
        data : []
      });
    },
    itemDblClick(context, item){
      item.father && !item.father.openned && context.dispatch("nodeToggle", item.father);
      context.dispatch("nodeClick", item);
    },
    nodeToggle(context, node){
      //如果是这样，消息通知逻辑需要适配，不发送关闭文件夹通知，这样能提高用户体验，不用每次刷新；
      if(node.children.length < 1){
        //get data
        context.dispatch("nodeClick", node);
      }
      context.commit({
        type : "nodeToggle",
        srcNode : node,
        data : null
      });
    },
    activeMenu(context, event){
      if(event){
        context.state.mousePosition.x = event.clientX;
        context.state.mousePosition.y = event.clientY;
        context.state.mousePosition.active = true;
      }
    }
  }
});

const app = new Vue({
  store,
  components: {
    "history-ctrl" : history_ctrl,
    "tree-ctrl" : tree_ctrl,
    "tree-ctrl2" : tree_ctrl2,
    "app-ctrl" : app_ctrl,
    "header-ctrl" : header_ctrl,
    "main-ctrl" : main_ctrl,
    "left-ctrl" : left_ctrl,
    "material-ctrl" : material_ctrl,
    "menu-ctrl" : menu_ctrl
  },
  methods: {
    hideMenu: function(event){
      this.$store.commit({
        type : "disableMenu"
      });
      this.$store.dispatch("deselectAllItems", null);
    },
    contextMenu: function(event){
      this.$store.dispatch("deselectAllItems", null);
      this.$store.dispatch("activeMenu", event);
    }
  },
  computed: {
    nodes(){
      return this.$store.getters.items;
    },
    materials(){
      return this.$store.getters.currentNode.children;
    },
    materialsCount(){
      return this.materials.length;
    }
  },
  data: {
    //flag:false
  }
});

app.$mount('#app');
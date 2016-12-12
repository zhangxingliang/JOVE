var t = [
            {
              name: 'MaterialList',
              selected: false,
              selecting:false,
              openned:false,
              renaming:false,
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
              renaming:false,
              path: '/Search Result',
              floor: 1,
              type : "folder",
              children:[]
            }
          ];
          var q = [
                      {
                        name: 'MaterialList',
                        selected: false,
                        selecting:false,
                        openned:false,
                        renaming:false,
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
                        renaming:false,
                        path: '/Search Result',
                        floor: 2,
                        type : "folder",
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
    mousePosition : {
      x : 0,
      y : 0,
      active : false
    },
    dragData : {
      left : 0,
      top : 0,
      width : 0,
      height : 0
    },
    cuttingBoard : []
  },
  getters:{
    items: state=>{
      return state.nodes;
    },
    currentNode: (state, getters)=>{
      if(state.histories.length > 0){
        return state.histories[state.histories.length-1];
      }
      return {children:[]};
    },
    copingBoard: (state, getters)=>{
      return getters.currentNode.children.filter(item=>item.coping == true);
    }
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
    //  payload.srcNode.children = payload.data;
    // state.treeMap.set(srcNode.guid, payload.data);
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
    expandNode(state, payload){
      payload.srcNode.openned = true;
    },
    selectItem(state, payload){
      //如果是这样，消息通知逻辑需要适配，不发送关闭文件夹通知，这样能提高用户体验，不要每次刷新；
    //  payload.srcNode.name += "open!";//!payload.srcNode.openned;
      payload.srcNode.selecting = !payload.srcNode.selecting;
    //  payload.srcNode.name += 123;
      //payload.srcNode.openned = false;
    },
    selectingItem(state, payload){
        payload.srcNode.selecting = true;
    },
    setSelectingItem(state, payload){
      payload.srcNode.selecting = payload.data;
    },
    selectedItem(state, payload){
      //如果是这样，消息通知逻辑需要适配，不发送关闭文件夹通知，这样能提高用户体验，不要每次刷新；
    //  payload.srcNode.name += "open!";//!payload.srcNode.openned;
      payload.srcNode.selecting = true;
    //  payload.srcNode.name += 123;
      //payload.srcNode.openned = false;
    },
    deselectAllItems(state, payload){
      payload.data && util.deselectAllItems(payload.data);
    },
    disableMenu(state, payload){
      state.mousePosition.active = false;
    },
    receiveData(state, payload){
      //var fNode = treeMap.get(payload.data.fguid);
      // case update recycle move  foreach
      // case create  push
      state.nodes[0].children.push({
        name: payload.data.name,
        selected: false,
        selecting:false,
        openned:false,
        path: payload.data.folderPath,
        floor: 2,
        type : "folder",
        father:t[0],
        children:[]
      });
    },
    setDragData(state, payload){
      state.dragData = payload.data;
    },
    moveItems(state, payload){
      payload.data.forEach(item=>{
        item.floor = payload.srcNode.floor + 1;
        item.father.children.remove(item);
        item.father = payload.srcNode;
        item.selecting = false;
        payload.srcNode.children.push(item);
      });
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
      if(item.type == "folder"){
        context.dispatch("nodeClick", item);
      }
      else{

      }
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
    expandNode(context, node){
      if(node.children.length < 1){
        //get data
        context.dispatch("nodeClick", node);
      }
      context.commit({
        type : "expandNode",
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
    },
    rename(context, item){
      item.renaming = true;
    },
    saveName(context, payload){
      payload.srcNode.name = payload.data;
      payload.srcNode.renaming = false;
      //post
    },
    uploadMaterials(context, payload){
       for (var i = 0; i < payload.length; i++) {
        if(payload[i].type.indexOf("image") >= 0){
          var obj = {
            name: payload[i].name,
            selected: false,
            selecting:false,
            openned:false,
            path: '/MaterialList',
            src: '',
            floor:2,
            type : "image",
            father:context.getters.currentNode,
            children:[]
          };
          var fr = new FileReader();
          fr.onload = function(obj){
            return function(e){
            obj.src = e.target.result;
            }
          }(obj);
          fr.readAsDataURL(payload[i]);
          context.getters.currentNode.children.push(obj);
        }
        else {
          var obj = {
            name: payload[i].name,
            selected: false,
            selecting:false,
            openned:false,
            path: '/MaterialList',
            src: '',
            floor:2,
            type : "other",
            father:context.getters.currentNode,
            children:[]
          };
          context.getters.currentNode.children.push(obj);
        }
      };
    },
    Delete(context, payload){
      context.getters.currentNode.children.remove(payload);
    },
    Move(context, payload){
      //同目录或moveItems的子目录不可粘贴
      context.state.cuttingBoard = [];
      context.getters.currentNode.children.filter(item=>item.selecting == true).forEach(item=>{
        item.cutting = true;
        context.state.cuttingBoard.push(item);
      });
    },
    Copy(context, payload){
      context.state.cuttingBoard = [];
      context.getters.currentNode.children.filter(item=>item.selecting == true).forEach(item=>{
        var newItem = Object.assign({}, item)
        context.state.cuttingBoard.push(newItem);
      });
    },
    Paste(context, payload){
      context.state.cuttingBoard.forEach(item=>{
        item.floor = context.getters.currentNode.floor + 1;
        item.father.children.remove(item);
        item.father = context.getters.currentNode;
        item.selecting = false;
        context.getters.currentNode.children.push(item);
      });
      context.state.cuttingBoard = [];
    },
    dragItems(context,payload){
      var items = context.getters.currentNode.children.filter(item=>payload.data.indexOf(item.name)>-1);
      context.commit({
        type : "moveItems",
        data : items,
        srcNode : payload.target
      });
    },
    NewFolder(){
      router.replace("/message/123");
    }
  }
});

const routes = [
  //{ path: '/newfolder', component: new_folder_ctrl },
  { path: '/message/:msg', component: msg_ctrl },
//  { path: '/comfirm/:msg', component: comfirm_ctrl }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  store,
  router,
  components: {
    "history-ctrl" : history_ctrl,
    "tree-ctrl" : tree_ctrl,
    "tree-ctrl2" : tree_ctrl2,
    "app-ctrl" : app_ctrl,
    "header-ctrl" : header_ctrl,
    "main-ctrl" : main_ctrl,
    "left-ctrl" : left_ctrl,
    "material-ctrl" : material_ctrl,
    "menu-ctrl" : menu_ctrl,
    "select-circle-ctrl" : select_circle_ctrl,
    "msg_ctrl" : msg_ctrl
  },
  methods: {
    hideMenu: function(event){
      this.$store.commit({
        type : "disableMenu"
      });
    },
    contextMenu: function(event){
      this.$store.dispatch("activeMenu", event);
      this.$store.dispatch("deselectAllItems", null);
    },
    deSelectAllItems: function(){
      this.$store.dispatch("deselectAllItems", null);
    },
    onDrop: function(event){
      var files = event.dataTransfer.files;
      this.$store.dispatch("uploadMaterials", files);
    },
    dragStart: function(event){
      if(event.which == 1){
        this.$store.commit({
          type : "disableMenu"
        });
        this.mousePosition.x = event.x;
        this.mousePosition.y = event.y;
        this.dragSymbol = true;
      }
    },
    dragging: util.throttle(5,function(event){
      if(this.dragSymbol){
        var x = event.x;
        var y = event.y;
        var left, top, width, height;
        left = Math.max(Math.min(this.mousePosition.x, x), 216);
        top = Math.max(Math.min(this.mousePosition.y, y), 70);
        width = Math.abs(Math.max(x, 216) - this.mousePosition.x);
        height = Math.abs(Math.max(y, 70) - this.mousePosition.y);
        this.$store.commit({
          type : "setDragData",
          srcNode : null,
          data : {
            left : left,
            top : top,
            width : width,
            height :height
          }
        });
        this.$store.dispatch("deselectAllItems", null);
        var l = this.$store.getters.currentNode.children.length;
        var arr = util.getCanSelectedItems(l, this.$store.state.dragData)
        arr.forEach(i=>{
          store.commit({
            type : "selectedItem",
            srcNode : this.$store.getters.currentNode.children[i]
          });
        });
      }
    }),
    dragEnd: function(event){
      this.dragSymbol = false;
      this.mousePosition =  {
        x : 0,
        y : 0
      };
      this.$store.commit({
        type : "setDragData",
        srcNode : null,
        data : {
          left : 0,
          top : 0,
          width : 0,
          height :0
        }
      });
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
    mousePosition : {
      x : 0,
      y : 0
    },
    dragSymbol : false,
  }
});

app.$mount('#app');

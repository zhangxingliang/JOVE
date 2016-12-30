const history_ctrl = {
  template: "#history_ctrl",
  computed: {
    histories() {
      return this.$store.state.histories;
    }
  },
  methods: {
    showClips: function(node) {
      this.$store.dispatch("nodeClick", node);
    },
    backUp: function() {
      this.$store.commit("backUp");
    }
  }
};

const tree_ctrl = {
  template: "#tree_ctrl",
  props: {
    items: Array
  },
  name: "tree-ctrl",
  data: function() {
    return {
    };
  },
  methods: {
    nodeClick: function(node) {
      this.$store.dispatch("nodeClick", node);
    },
    nodeDblClick: function(node) {
      this.$store.dispatch("nodeDblClick", node);
    },
    nodeToggle: function(node) {
      this.$store.dispatch("nodeToggle", node)
    }
  },
  computed: {
    nodes() {
      // 排序在这里处理
      return this.items; //.filter(item=>item.type == 'folder').sort();
    },
    selectedNode() {
      var len = this.$store.state.histories.length;
      return len > 0 ? this.$store.state.histories[len - 1] : null;
    }
  }
};

const tree_ctrl2 = {
  template: "#tree_ctrl2",
  props: {
    data: Object
  },
  name: "tree-ctrl2",
  data: function() {
    return {
      intervalId: -1
    };
  },
  methods: {
    nodeClick: function() {
      this.$store.dispatch("nodeClick", this.node);
    },
    nodeDblClick: function(node) {
      this.$store.dispatch("nodeDblClick", this.node);
    },
    nodeToggle: function(node) {
      this.$store.dispatch("nodeToggle", this.node)
    },
    dragOver: function(event) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setDragImage(event.target, 0, 0);
      if (!this.node.openned) {
        this.intervalId = setTimeout(() => {
          this.$store.dispatch("expandNode", this.node)
        }, 1000);
      }
    },
    dragLeave: function(event) {
      clearTimeout(this.intervalId);
      this.intervalId = -1;
    },
    drop: function(event) {
      if (event.dataTransfer.files.length > 0) {
        this.$store.dispatch("nodeClick", this.node);
        this.$store.dispatch("uploadMaterials", event.dataTransfer.files)
      } else {
        var data = event.dataTransfer.getData("text");
        this.$store.dispatch("dragItems", {
          target: this.node,
          data: JSON.parse(data)
        });
      }
    }
  },
  computed: {
    node() {
      return this.data; //.filter(item=>item.type == 'folder').sort();
    },
    selectedNode() {
      var len = this.$store.state.histories.length;
      return len > 0 ? this.$store.state.histories[len - 1] : null;
    }
  }
};
const material_ctrl = {
  template: "#material_ctrl",
  props: {
    data: Object
  },
  data: function() {
    return {
      lastSelectingStatus: false,
      ctrlSymbol: false,
      intervalId: -1,
      top: 0,
      left: 0,
    }
  },
  methods: {
    mousemove(event) {
      var x1 = event.x
      var x2 = $(event.target).offset().left
      var offset = Math.floor((x1 - x2) / (240 / this.material.count))
      this.left = x1 - x2
      this.top = -135 * offset
    },
    itemMouseDown: function(event) {
      if (event.which == 1) {
        this.$store.commit({
          type: "disableMenu"
        });
        this.lastSelectingStatus = this.material.selecting;
        if (event.ctrlKey) {
          this.ctrlSymbol = true;
        } else {
          this.$store.dispatch("deselectAllItems", null);
        }
        this.$store.commit({
          type: "selectingItem",
          srcNode: this.material,
          data: null
        });
      }
    },
    itemMouseUp: function(event) {
      if (event.which == 1) {
        if (this.ctrlSymbol) {
          this.$store.commit({
            type: "setSelectingItem",
            srcNode: this.material,
            data: !this.lastSelectingStatus
          });
        } else {
          this.$store.dispatch("deselectAllItems", null);
          this.$store.commit({
            type: "selectingItem",
            srcNode: this.material,
            data: null
          });
        }
      }
      this.ctrlSymbol = false;
    },
    itemDblClick: function(event) {
      this.$store.dispatch("itemDblClick", this.material);
    },
    contextMenu: function(event) {
      if (this.material.selecting) {
        this.$store.dispatch("activeMenu", event);
      } else {
        this.$store.dispatch("deselectAllItems", this.material);
        this.$store.dispatch("itemSelected", this.material);
        this.$store.dispatch("activeMenu", event);
      }
    },
    saveName: function(event) {
      //验证value
      this.$store.dispatch({
        type: "saveName",
        data: event.target.value,
        srcNode: this.material
      });
    },
    dragStart: function(event) {
      event.dataTransfer.effectAllowed = "move";
      var datas = this.$store.getters.currentNode.children.filter(item => item.selecting == true).map(item => item.name);
      event.dataTransfer.setData("text", JSON.stringify(datas));
    //event.dataTransfer.setDragImage(event.target, 0, 0);
    },
    dragOver: function(event) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setDragImage(event.target, 0, 0);
    },
    drop: function(event) {
      if (event.dataTransfer.files.length > 0) {
        this.$store.dispatch("nodeClick", this.material);
        this.$store.dispatch("uploadMaterials", event.dataTransfer.files)
      } else {
        if (this.data.type == "folder" && !this.data.selecting) {
          var data = event.dataTransfer.getData("text");
          this.$store.dispatch("dragItems", {
            target: this.data,
            data: JSON.parse(data)
          });
        }
      }
    }
  },
  computed: {
    material() {
      return this.data;
    }
  }
}

const menu_ctrl = {
  template: "#menu_ctrl",
  data: function() {
    return {
      opts: [
        {
          name: "Open",
          action: "itemDblClick"
        },
        {
          name: "Delete",
          action: "Delete",
        },
        {
          name: "Rename",
          action: "rename",
        },
        {
          name: "Move",
          action: "Move",
        },
        {
          name: "Copy",
          action: "Copy",
        },
        {
          name: "New Folder",
          action: "NewFolder",
        },
        {
          name: "Order By",
          action: "OrderBy",
          subOperations: [
            {
              name: "Title",
              action: "NewFolder",
            },
            {
              name: "Type",
              action: "NewFolder",
            },
            {
              name: "Create Time",
              action: "NewFolder",
            }
          ]
        },
        {
          name: "Refresh",
          action: "Refresh",
        },
        {
          name: "Paste",
          action: "Paste",
        },
        {
          name: "Property",
          action: "Property",
        }
      ]
    }
  },
  methods: {
    apply: function(operation) {
      //调用弹窗询问或直接执行
      //operation.func(this.data);
      var _this = this;
      this.data.forEach(function(item) {
        _this.$store.dispatch(operation.action, item);
      });
      if (this.data.length == 0) {
        _this.$store.dispatch(operation.action, null);
      }
    }
  },
  computed: {
    data() {
      return this.$store.getters.currentNode.children.filter(item => item.selecting == true);
    },
    position() {
      //如果超出则自动适应根据
      var p = {
        active: this.$store.state.mousePosition.active
      };
      if (p.x + 200 > this.$store.clientWidth) {
        p.x = this.$store.state.mousePosition.x - 200;
      } else {
        p.x = this.$store.state.mousePosition.x;
      }
      p.y = this.$store.state.mousePosition.y;
      return p;
    },
    operations() {
      if (this.data.length > 0) {
        return this.opts.slice(0, 5);
      } else {
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
    nodes() {
      return this.$store.state.nodes;
    }
  }
}
const select_circle_ctrl = {
  template: "#select_circle",
  computed: {
    dragData() {
      var data = this.$store.state.dragData
      return {
        left: data.left + 'px',
        top: data.top + 'px',
        width: data.width + 'px',
        height: data.height + 'px',
      };
    }
  }
}
const header_ctrl = {
  template: "#header_ctrl",
  methods: {
    showTM() {
      this.$store.dispatch("showTM");
    },
    logout() {
      this.$store.dispatch("logout");
    },
    help() {}
  },
  computed: {
    langDic() {
      return this.$store.state.languageDic;
    },
    userInfo() {
      return this.$store.state.userInfo;
    }
  }
}

const msg_ctrl = {
  template: '#dialog-ctrl',
  name: "msg_ctrl",
  methods: {
    close() {
      this.show = false;
    }
  },
  computed: {
    msg() {
      return this.$route.params.msg;
    },
  },
  data: () => {
    return {
      show: true
    }
  }
}

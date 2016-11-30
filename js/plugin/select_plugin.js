const SelectPlugin = store => {
  while(true){
    var l = store.getters.currentNode.children.length;
    var arr = util.getCanSelectedItems(l, store.state.dragData)
    arr.forEach(i=>{
      store.commit({
        type : "selectedItem",
        srcNode : store.getters.currentNode.children[i]
      });
    });
  }
}

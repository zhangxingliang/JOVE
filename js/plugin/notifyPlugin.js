var urlList = ['ws://172.16.173.21:3130'];
const NotifyPlugin = store => {
  if (!('WebSocket' in window)) {
      return;//提示不支持吧
  }

  var Guid ;
  var ws;
  var seek = 0;
  var total = urlList.length;
  var _this = this;
  var Reconnect = function () {
      if (seek < total - 1) {
          seek += 1;
      }
      else {
          seek = 0;
      }
      Init();
  }
  var Init = function () {
      if (total > 0) {
          ws = new WebSocket(urlList[seek]);
          ws.onopen = function (e) {
              if (ws.readyState == 1) {
                  ws.send(JSON.stringify({ GUID: Guid }));
              }
          }
          ws.onmessage = function (e) {
              var data = JSON.parse(e.data);

              if (data.GUID) {
                  Guid = data.GUID;
              }
              else {
                  store.commit(
                    {
                      type : 'receiveData',
                      data : data,
                      srcNode : null
                    });
              }
          }
        //  ws.onclose = ws.onerror = Reconnect;
      }
  }
  var Send = function (data) {
      data.GUID = Guid;
      if (ws.readyState == 1) {
          ws.send(JSON.stringify(data));
          return true;
      }
      else {
          Reconnect();
          return false;
      }
  }
    Init();
    store.subscribe(mutation => {
     if (mutation.type === 'setNodes') {
       //处理payload
       var cNode = mutation.payload.srcNode;
       var msg = {
         ClipFolderGuid: 'dd65d862701442bb9f5a7af921367eb6',
         ClipFolderPath: "global_sobey_defaultclass/MaterialList/Public Material"
       };
       Send(msg);
     }
   });
}

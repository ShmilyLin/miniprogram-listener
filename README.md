# miniprogram-listener
微信小程序的全局广播（通知）扩展。

仿照Vue的$on、$once、$emit、$off写的在小程序中的全局广播通知扩展。

# 安装

将src下的listener.js文件拖进项目即可

未来将支持通过npm安装。

# 使用

需要对Listener初始化:

```js
var Listener = require("./utils/listener.js");

// app.js
App({
  onLaunch: function() {
    Listener.init();
  }
})
```

# API

所有的API均支持两种方式调用

1. `wx.`的方式调用
2. require引入Listener，`Listener.`的方式调用

## on

注册监听函数

`wx.$on(key, callback);`

__参数：__

  * key[String|Number]: 监听的识别字符串
  * callback[Function]: 监听的回调函数

```js
// app.js
App({
  onLaunch: function() {
    Listener.init();
    
    // 回调函数在函数中声明：
    var callback1 = function() {
      // do something
      // 这里的this指向Listener
    }
    
    var callback2 = () => {
      // do something
      // 这里的this指向App
    }
    
    wx.$on("test", callback1); // 这里注意，使用 var functionname = function() {} 形式在函数内声明的回调函数不支持wx.$on("test", callback1.bind(this));方式注册。因为在wx.$off的时候无法被删除。
    wx.$on("test", callback2);
    
    wx.$on("test", callback3);
    wx.$on("test", callback4);
  }
  
  // 回调函数在Object中声明：
  callback3() {
    // do something
    // 这里的this指向App
  }
  
  callback4: function () {
    // do something
    // 这里的this指向App
  }
  
  // 注意：在对象中声明的回调函数不支持使用 functionname: () => {} 方式声明，因为在wx.$off的时候无法被删除。
})
```

## once

注册只监听一次的函数

`wx.$once(key, callback);`

__参数：__

  * key[String|Number]: 监听的识别字符串
  * callback[Function]: 监听的回调函数
  
调用方法同`on`。

## off

删除已注册的监听函数

`wx.$off(key, callback);`

__参数：__

  * key[String|Number]: 监听的识别字符串
  * callback[Function]: 监听的回调函数
  
```js

App({
  onLaunch: function() {
    Listener.init();
    
    // 回调函数在函数中声明：
    var callback1 = function() {
      // do something
      // 这里的this指向Listener
      
      wx.$off("test", callback1);
    }
    
    wx.$on("test", callback1);
  }
})

```

## emit

调用已注册的监听函数

`wx.$emit(key, [...args]);`

__参数：__

  * key[String|Number]: 监听的识别字符串
  * [...args]: 传入的参数
  
```js
// app.js
App({
  onLaunch: function() {
    Listener.init();
    
    // 回调函数在函数中声明：
    var callback1 = function() {
      // do something
      // 这里的this指向Listener
      
      wx.$off("test", callback1);
    }
    
    wx.$on("test", callback1);
  }
})

// index.js
Page({
  data: {
    
  },
  onLoad: function () {
    
  },
  onShow: function () {
    wx.$emit("test", 123, 234, 345, {
      name: "l"
    });
  }
})

```

## clear

删除已注册的监听的识别字符串下的所有回调函数

`wx.$clear(key);`

__参数：__

  * key[String|Number]: 监听的识别字符串
  
```js

App({
  onLaunch: function() {
    Listener.init();
    
    // 回调函数在函数中声明：
    var callback1 = function() {
      // do something
      // 这里的this指向Listener
      
      wx.$clear("test");
    }
    
    wx.$on("test", callback1);
  }
})

```


# 已知问题

同一个回调函数不要重复注册，否则多注册的无法从监听中删除。


# 开源协议

[MIT](./LICENSE)

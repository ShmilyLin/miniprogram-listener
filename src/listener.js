/*
 * 全局广播
 * 
 * 可以广播任何形式的函数，但是只能删除以下形式的广播函数：
 * 
 * 1. Object中可以使用 functionname(){} 和 functionname: function(){}
 *    其中
 *      functionname(){} 的this指向其所在Object。
 *      functionname: function(){} 的this指向其所在Object。
 * 2. 函数中声明的 var functionname = function(){} 和 var functionname = () => {}
 *    其中
 *      var functionname = function(){} 绑定wx.$on的时候不可以用functionname.bind(this)，这个时候调用函数的this指向Listener实例。如果使用functionname.bind(this)该广播将无法被删除。
 *      var functionname = () => {} 的this指向其所在函数的this。
 */

const ListenerManager = {
  Listeners: {}
}

class Listener {
  constructor() {
    this.Keys = {};
  }

  init() {
    wx.$once = this.once.bind(this);
    wx.$on = this.on.bind(this);
    wx.$off = this.off.bind(this);
    wx.$emit = this.emit.bind(this);
    wx.$clear = this.clear.bind(this);
  }

  once(key, callback) {
    if (key && (String === key.constructor || Number === key.constructor)) {
      if (callback && Function === callback.constructor) {
        var tempKey = key + "_$once";
        if (!ListenerManager.Listeners && Object !== ListenerManager.Listeners.constructor) {
          ListenerManager.Listeners = {};
        }

        if (tempKey in ListenerManager.Listeners) {
          if (Array !== ListenerManager.Listeners[tempKey].constructor) {
            ListenerManager.Listeners[tempKey] = [];
          }
        } else {
          ListenerManager.Listeners[tempKey] = [];
        }

        ListenerManager.Listeners[tempKey].push(callback);
      } else {
        console.error("【Listener】 方法once的第二个参数callback只能为Function类型");
      }
    } else {
      console.error("【Listener】 方法once的第一个参数key只能为String或Number类型");
    }
  }

  on(key, callback) {
    if (key && (String === key.constructor || Number === key.constructor)) {
      if (callback && Function === callback.constructor) {
        var tempKey = key + "";
        if (!ListenerManager.Listeners && Object !== ListenerManager.Listeners.constructor) {
          ListenerManager.Listeners = {};
        }
        
        if (tempKey in ListenerManager.Listeners) {
          if (Array !== ListenerManager.Listeners[tempKey].constructor) {
            ListenerManager.Listeners[tempKey] = [];
          }
        }else {
          ListenerManager.Listeners[tempKey] = [];
        }

        ListenerManager.Listeners[tempKey].push(callback);
      }else {
        console.error("【Listener】 方法on的第二个参数callback只能为Function类型");
      }
    }else {
      console.error("【Listener】 方法on的第一个参数key只能为String或Number类型");
    }
  }

  off(key, callback) {
    console.log("【Listener】 off", callback.toString(), ListenerManager.Listeners);
    if (key && (String === key.constructor || Number === key.constructor)) {
      if (callback && Function === callback.constructor) {
        setTimeout(() => {
          var tempKey = key + "";
          var tempOnceKey = key + "_$once";
          if (ListenerManager.Listeners && Object === ListenerManager.Listeners.constructor) {
            if (tempKey in ListenerManager.Listeners && Array === ListenerManager.Listeners[tempKey].constructor && ListenerManager.Listeners[tempKey].length > 0) {
              var tempList = ListenerManager.Listeners[tempKey];
              for (var i = 0; i < tempList.length; i++) {
                if (tempList[i] == callback) {
                  ListenerManager.Listeners[tempKey].splice(i, 1);
                  break;
                }
              }
            }

            if (tempOnceKey in ListenerManager.Listeners && Array === ListenerManager.Listeners[tempOnceKey].constructor && ListenerManager.Listeners[tempOnceKey].length > 0) {
              var tempOnceList = ListenerManager.Listeners[tempOnceKey];
              for (var i = 0; i < tempOnceList.length; i++) {
                if (tempOnceList[i] == callback) {
                  ListenerManager.Listeners[tempOnceKey].splice(i, 1);
                  break;
                }
              }
            }
          }

          console.log("【Listener】 off", ListenerManager.Listeners);
        }, 0);
      } else {
        console.error("【Listener】 方法off的第二个参数callback只能为Function类型");
      }
    } else {
      console.error("【Listener】 方法off的第一个参数key只能为String或Number类型");
    }
  }

  emit(key, params) {
    if (key && (String === key.constructor || Number === key.constructor)) {
      var tempKey = key + "";
      var tempOnceKey = key + "_$once";
      if (ListenerManager.Listeners && Object === ListenerManager.Listeners.constructor) {
        var tempList = [];
        if (tempKey in ListenerManager.Listeners && Array === ListenerManager.Listeners[tempKey].constructor && ListenerManager.Listeners[tempKey].length > 0) {
          tempList = ListenerManager.Listeners[tempKey];
        }

        var tempOnceList = [];
        if (tempOnceKey in ListenerManager.Listeners && Array === ListenerManager.Listeners[tempOnceKey].constructor && ListenerManager.Listeners[tempOnceKey].length > 0) {
          tempOnceList = ListenerManager.Listeners[tempOnceKey];
        }


        if (arguments.length > 1) {
          var tempParams = [];
          for (var i = 1; i < arguments.length; i++) {
            tempParams.push(arguments[i]);
          }

          // tempList.forEach((value) => {
          //   value.apply(this, tempParams);
          // })
          for (var j = 0; j < tempList.length; j++) {
            tempList[j].apply(this, tempParams);
          }

          if (tempOnceList.length > 0) {
            // tempOnceList.forEach((value) => {
            //   value.apply(this, tempParams);
            // })
            for (var j = 0; j < tempOnceList.length; j++) {
              tempOnceList[j].apply(this, tempParams);
            }

            delete ListenerManager.Listeners[tempOnceKey];
          }
        } else {
          for (var j = 0; j < tempList.length; j++) {
            tempList[j].apply(this, tempParams);
          }

          if (tempOnceList.length > 0) {
            for (var j = 0; j < tempOnceList.length; j++) {
              tempOnceList[j].apply(this, tempParams);
            }

            delete ListenerManager.Listeners[tempOnceKey];
          }
        }
      }
    } else {
      console.error("【Listener】 方法emit的第一个参数key只能为String或Number类型");
    }
  }

  clear(key) {
    if (key && (String === key.constructor || Number === key.constructor)) {
      if (callback && Function === callback.constructor) {
        setTimeout(() => {
          var tempKey = key + "";
          var tempOnceKey = key + "_$once";
          if (ListenerManager.Listeners && Object === ListenerManager.Listeners.constructor) {
            if (tempKey in ListenerManager.Listeners && Array === ListenerManager.Listeners[tempKey].constructor && ListenerManager.Listeners[tempKey].length > 0) {
              delete ListenerManager.Listeners[tempKey];
            }

            if (tempOnceKey in ListenerManager.Listeners && Array === ListenerManager.Listeners[tempOnceKey].constructor && ListenerManager.Listeners[tempOnceKey].length > 0) {
              delete ListenerManager.Listeners[tempOnceKey];
            }
          }

          console.log("【Listener】 clear", ListenerManager.Listeners);
        }, 0);
      } else {
        console.error("【Listener】 方法off的第二个参数callback只能为Function类型");
      }
    } else {
      console.error("【Listener】 方法off的第一个参数key只能为String或Number类型");
    }
  }
}

let ListenerInstance = new Listener();

module.exports = ListenerInstance;
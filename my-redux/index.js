/**
 * createStore(reducer, preloadedState, enhancer)
 * { getState, dispatch, subscribe }
 */

function createStore(reducer, preloadedState) {
  // store 中存储的状态
  var currentState = preloadedState
  // 存放订阅函数
  var currentListeners = []

  // 获取状态
  function getState () {
    return currentState
  }
  // 触发 action
  function dispatch (action) {
    currentState = reducer(currentState, action)
    // 调用订阅者
    for (var i = 0; i < currentListeners.length; i++) {
      var listener = currentListeners[i]
      listener()
    }
  }
  // 订阅状态
  function subscribe (listener) {
    currentListeners.push(listener)
  }
  
  return {
    getState,
    dispatch,
    subscribe
  }
}
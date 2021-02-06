/**
 * createStore(reducer, preloadedState, enhancer)
 * { getState, dispatch, subscribe }
 */

function createStore(reducer, preloadedState, enhancer) {
  if (typeof reducer !== 'function') {
    throw new Error('reducer 必须是函数')
  }

  // 判断 enhancer 有没有传参
  if (typeof enhancer !== 'undefined') {
    // 判断 enhancer 是不是函数
    if (typeof enhancer !== 'function') {
      throw new Error('enhancer 必须是函数')
    }
    return enhancer(createStore)(reducer, preloadedState)
  }

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
    // 判断 actions 是否是对象
    if (!isPlainObject(action)) {
      throw new Error('action 必须是对象')
    }
    // 判断 actions 是否有 type 属性
    if (typeof action.type === 'undefined') {
      throw new Error('action 中必须要有 type 属性')
    }

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

function isPlainObject (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }
  // 区分数组和对象，原型对象对比
  var proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(obj) === proto
}

function applyMiddleware (...middlewares) {
  return function (createStore) {
    return function (reducer, preloadedState) {
      // 创建 store
      var store = createStore(reducer, preloadedState)
      var middlewareAPI = {
        getState: store.getState,
        dispatch: store.dispatch
      }
      var chain = middlewares.map(middleware => middleware(middlewareAPI))
      var dispatch = compose(...chain)(store.dispatch)
      return {
        ...store,
        dispatch
      }
    }
  }
}

function compose () {
  var funcs = [...arguments]
  return function (dispatch) {
    for (var i = funcs.length - 1; i >= 0; i--) {
      dispatch = funcs[i](dispatch)
    }
    return dispatch
  }
}
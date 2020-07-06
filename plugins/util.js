import Vue from 'vue'

Vue.prototype.$testsave = async function (thumbnail, rawdata) {
  return new Promise((re, rj) => {
    parent.window.smartclasssave(thumbnail, rawdata).then((data) => {
      console.log(data)
      re(data)
    });
  })
}
Vue.prototype.$testload = async function () {
  return new Promise((re, rj) => {
    parent.window.smartclassload().then((data) => {
      console.log(data)
      re(data)
    });
  })
}
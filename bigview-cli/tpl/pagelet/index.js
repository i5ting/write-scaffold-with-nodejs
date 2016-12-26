'use strict'

const Pagelet = require('biglet')

module.exports = class MyPagelet extends Pagelet {
  constructor () {
    super()
    this.root = __dirname
    this.name = '{{name}}'
    this.data =  {t: "测试" }
    this.selector = '{{name}}'
    this.location = '{{name}}'
    this.tpl = 'index.html'
    this.delay = 0
  }

  fetch () {
    let self = this
    return new Promise(function(resolve, reject){
      setTimeout(function() {
        // self.owner.end()
        resolve(self.data)
      }, self.delay)
    })
  }
}

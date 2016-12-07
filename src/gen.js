#!/usr/bin/env node

var fs = require('fs')
var nunjucks = require('nunjucks')
var argv = process.argv;
var filePath = __dirname;
var currentPath = process.cwd();
//
// console.log(filePath)
// console.log(currentPath)

// cli parse
argv.shift()
argv.shift()
console.log(argv)

var data = {
  model: argv[0],
  attr:{
    
  }
}

for(var i = 1; i < argv.length; i++) {
  var arr = argv[i].split(':')
  var k = arr[0];
  var v = arr[1];
  
  data.attr[k] = v
}
console.log('data = ')
console.dir(data)

// read tpl
var tpl = fs.readFileSync(filePath + '/gen.tpl').toString()

console.dir(data)

// tpl compile
var compiledData = nunjucks.renderString(tpl, data)

console.log(compiledData)

// write file
fs.writeFileSync(currentPath + '/gen.xxx', compiledData)

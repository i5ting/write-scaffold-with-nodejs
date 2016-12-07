# 零基础十分钟教你用Node.js写生成器：你只需要5步

用Node.js写生成器是件非常简单的事儿，原因是

- Node.js模块开发简单，js语法，而且二进制cli模块也极其简单
- Npm发布包是所有开源的包管理器里最简单好用的
- 辅助模块多，将近40万个左右

所以为了让大家零基础十分钟搞定生成器，这里精简一下，你只需要5步

- 初始化模块
- cli二进制模块
- 模板引擎使用
- 解析cli参数和路径
- npm发布

这里假定你已经安装了Node.js，至于是什么版本，如何安装的并不重要。

先要介绍一下，什么是Npm？

https://www.npmjs.com/

npm is the package manager for

  - browsers
  - javascript
  - nodejs
  - io.js
  - mobile
  - bower
  - docpad
  - test

简单理解：NPM（node package manager），通常称为node包管理器。顾名思义，它的主要功能就是管理node包，包括：安装、卸载、更新、查看、搜索、发布等。只要安装了Node.js，它会默认安装的。

它可不只是nodejs package manager，可见其定位是很广的，这从侧面也佐证了大前端和node全栈的机会。

以前nodejs吹牛都是那异步说事儿，现在都是拿生态说事儿

这话不错，在09年谈异步，很多语言性能都很弱，但事情要以发展的眼光看，现在很多语言都支持了，而且性能还不错，所以才显得nodejs性能没那么突出

## 1）初始化模块

确认模块名称

```
$ npm info xxxxxx
```

如果没有找到对应的包，说明你可以使用这个名字，然后在github建立仓库，clone到本地即可

```
$ git clone xxx
$ npm init -y
```

生成package.json文件，此文件为模块的描述文件，非常重要。

```
{
  "name": "a",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

说明

- main是模块的入口文件，即普通代码对外提供调用的api入口。
- scripts是npm scripts非常便利的，只要在package.json所在目录下，你执行npm test就会调用这里的test配置。如果是test，start等内置命令之外的，可以通过`npm run xxx`来定义

## 2）cli二进制模块

Node.js分2种模块

- 普通模块，供代码调用
- 二进制模块，提供cli调用

大家都知道，生成器是cli工具，所以我们应该使用cli二进制模块

手动修改package.json文件

```
{
  "name": "a",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "gen": "gen.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

这里主要增加里一个`bin`的配置，bin里的`gen`为cli的具体命令，它的具体执行的文件gen.js，大家看到这是一个plain old object类型，所以可以配置多个命令的，各位可以按照自己的喜好来。

既然`gen`的执行文件是`gen.js`，我们当然需要创建创建它

```
$ touch gen.js
```

填写

```
  #!/usr/bin/env node

  var argv = process.argv;
  var filePath = __dirname;
  var currentPath = process.cwd();

  console.log(argv)
  console.log(filePath)
  console.log(currentPath)

```

说明

- argv是命令行的参数
- filePath是当前文件的路径，也就是以后安装后文件的路径，用于存放模板文件非常好
- currentPath是当前shell上下文路径，也就是生成器要生成文件的目标位置

至此，二进制模块的代码就写完了，下面我们测一下

1）本地安装此模块

在package.json文件路径下，执行

```
$ npm link

/Users/sang/.nvm/versions/node/v4.4.5/bin/gen -> /Users/sang/.nvm/versions/node/v4.4.5/lib/node_modules/a/gen.js
/Users/sang/.nvm/versions/node/v4.4.5/lib/node_modules/a -> /Users/sang/workspace/github/i5ting/a
```

此时说明已经安装成功了。

2）执行gen测试

```
$ gen
[ '/Users/sang/.nvm/versions/node/v4.4.5/bin/node',
  '/Users/sang/.nvm/versions/node/v4.4.5/bin/gen' ]
/Users/sang/workspace/github/i5ting/a
/Users/sang/workspace/github/i5ting/a
```

可以换不同的目录来测试一下，看看结果的不同，来体会上面3个变量的妙用。

## 3）模板引擎使用

模板引擎是一种复用思想，通过定义模板，用的时候和数据一起编译，生成html，以便浏览器渲染。从这个定义里我们可以找出几个关键点

> 编译(模板 + 数据) => html

模板引擎有好多种，下面介绍2种典型的模板引擎

- ejs：嵌入js语法的模板引擎（e = embed），类似于jsp，asp，erb的，在html里嵌入模板特性，如果熟悉html写起来就非常简单，只要区分哪些地方是可变，哪些地方是不变即可
- jade：缩进式极简写法的模板引擎，发展历史 HAML -> Jade -> Slim -> Slm，最早是ruby里有的，目前以jade用的最多，这种写法虽好，，但需要大脑去转换，这其实是比较麻烦的，如果对html不是特别熟悉，这种思维转换是非常难受的。

更多见 https://github.com/tj/consolidate.js#supported-template-engines

这里我们选一个，目前Node.js里最火的应该也是最好的[Nunjucks](https://mozilla.github.io/nunjucks/)，我感觉它和ejs比较像，但跟jade一样强大，语法据说出自Python的某款模板引擎

```
$ npm install --save nunjucks
```

然后我们修改模板引擎

```
  #!/usr/bin/env node

  // var argv = process.argv;
  // var filePath = __dirname;
  // var currentPath = process.cwd();
  //
  // console.log(argv)
  // console.log(filePath)
  // console.log(currentPath)

  var nunjucks = require('nunjucks')

  var compiledData = nunjucks.renderString('Hello {{ username }}', { username: 'James' });

  console.log(compiledData)
```

注释一下前面说的3个变量，这里我们只看nunjucks代码。这是最简单的demo。

- 1）引入nunjucks模块
- 2）nunjucks.renderString方法是编译模板用的，它有2个参数
  - 第一个是模板字符串
  - 第二个是json数据
- 3）compiledData就是编译后的结果

结合上面说的模板引擎原理，

> 编译(模板 + 数据) => html

再理解一下，效果会更好。

但是这样看来对我们没啥用啊，生成器的内容总不能都写到字符串里吧？所以继续改造，把模板独立出去，然后通过文件读写来获取模板字符串。

创建一个gen.tpl，内容为`Hello {{ username }}`，下面我们看看如何修改gen.js来读取模板。

```
var fs = require('fs')
var nunjucks = require('nunjucks')

var tpl = fs.readFileSync('./gen.tpl').toString()

var compiledData = nunjucks.renderString(tpl, { username: 'James' });

console.log(compiledData)
```

- 1) 引入fs模块，因为要读取文件
- 2）fs.readFileSync('./gen.tpl').toString()，使用了一个读取文件的同步方法，并把文件内容转成字符串，原来是buffer

读文件还是挺简单吧。那么写文件呢？

```
fs.writeFileSync('./gen.xxx', compiledData)
```

至此，一个生成器的模型就出来

```
  #!/usr/bin/env node

  var fs = require('fs')
  var nunjucks = require('nunjucks')

  var tpl = fs.readFileSync('./gen.tpl').toString()

  var compiledData = nunjucks.renderString(tpl, { username: 'James' });

  console.log(compiledData)

  fs.writeFileSync('./gen.xxx', compiledData)
```

思考一下，可变得有哪些？

- './gen.tpl'是输入模板
- { username: 'James' } 要编译的数据
- './gen.xxx'是最终的输出

那么，剩下的事儿就是围绕可变得内容来构造你想要的功能。

## 4）解析cli参数和路径

要说生成器，最经典的是rails的scaffold，曾经缔造了一个15分钟blog的神话

```
$ rails g book name:string coordinates:string 
```

如果我们要实现它，怎么做呢？

- rails g是固定的用于生成的命令
- book是模型名称，俗称表名
- 而name和coordinates都是字段名称，string是表中的类型

可变的只有表名和字段信息。所以只要解析到这些就够了，换成我们的gen命令，大概是这样

```
$ gen book name:string coordinates:string 
```

修改gen.js代码

```
  #!/usr/bin/env node

  var argv = process.argv;
  console.log(argv)
```

执行gen命令的结果是

```
$ gen book name:string coordinates:string 
[ '/Users/sang/.nvm/versions/node/v4.4.5/bin/node',
  '/Users/sang/.nvm/versions/node/v4.4.5/bin/gen',
  'book',
  'name:string',
  'coordinates:string' ]
```

下面构造一个entity对象

```
var argv = process.argv;

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

console.dir(data)

```

执行

```
$ gen book name:string coordinates:string 
[ 'book', 'name:string', 'coordinates:string' ]
data = { 
  model: 'book',
  attr: { 
    name: 'string', 
    coordinates: 'string' 
  } 
}
```

那这里的data可以做什么呢？想想模板引擎里的第二个参数~

```
// tpl compile
var compiledData = nunjucks.renderString(tpl, data)
```

修改模板gen.tpl

```
module.exports = class {{ model }} {
  {% for k,v in attr %}
    {{k}}: {{v}},
  {% else %}
    error
  {% endfor %}
}
```

结果gen.xxx为

```
module.exports = class book {
  
    name: string,
  
    coordinates: string,
  
}
```

这里是只是示意，具体当按照你想要的结果为准。

```
  #!/usr/bin/env node

  var fs = require('fs')
  var nunjucks = require('nunjucks')
  var argv = process.argv;
  // var filePath = __dirname;
  // var currentPath = process.cwd();
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
  var tpl = fs.readFileSync('./gen.tpl').toString()

  console.dir(data)

  // tpl compile
  var compiledData = nunjucks.renderString(tpl, data)

  console.log(compiledData)

  // write file
  fs.writeFileSync('./gen.xxx', compiledData)

```

下面修改一下路径

- tpl从__dirname走
- 而结果需要写到process.cwd()

也就是我们前面说的那2个没有用到的变量filePath和currentPath。

```
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

```

至此，完成了所有代码。此时你在任意目录输入

```
$ gen book name:string coordinates:string 
```

你会发现当前目录下会有一个gen.xxx文件，和我们之前看到的结果一样。

## 5）npm发布

在package.json目录里执行

```
$ npm publish . 
```

就可以了发布成功了。

如果你想增加版本号，再次发布，你需要2步

```
$ npm version patch
$ npm publish .
```

你可以自己测试一下

```
$ npm i -g xxxxxx
```

share给别人吧

## 更多

- 异常：各种可能考虑到并处理
- 测试：按照各位喜好
- 工具模块：比如使用debug模块处理调试信息，日志等
- argv解析模块：commander 或者yargs

## 最后

生成器理论是可以生成一切内容的，那么生成能够生成器模板代码么？自己想想吧

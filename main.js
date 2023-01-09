const fs = require('fs');
var path = require('path');
const request = require('request');
const {urls} = require('./urls');
// console.log(urls)
const itemUrls = urls

function getFileByUrl(url, fileName, dir) {
  let stream = fs.createWriteStream(path.join(dir, fileName));
  request(url).pipe(stream).on('close', function (err) {
    console.log('文件' + fileName + '下载完毕')
  })
}

function downImg() {
  itemUrls.map(url => {
    let fileName = url.split('/')[url.split('/').length-1]
    let dir = 'assets/'
    // console.log(fileName, dir)
    let needMkDir = false;
    if (needMkDir) {
      dir = 'assets/' + fileName.split('/')[0]
      fileName = fileName.split('/')[1]
      fs.mkdir('./' +dir, { recursive: true }, () => {
        getFileByUrl(url, fileName, dir)
      })
    } else {
      getFileByUrl(url, fileName, dir)
    }
  })
}

function deleteAll(deletePath = './assets') {
  var files = [];
  if(fs.existsSync(deletePath)) {
    files = fs.readdirSync(deletePath);
    files.forEach(function(file, index) {
      var curPath = deletePath + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteAll(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
  }
}

// 前两个默认为 全路径，这里不需要，隐藏掉
var arguments = process.argv.splice(2);
// var arguments = process.argv;

// 可以使用循环迭代所有的命令行参数（包括node路径和文件路径）
arguments.forEach((val, index) => {
  // console.log(`${index}: ${val}`);
  switch(val) {
    case 'down': downImg(); break;
    case 'clear': deleteAll(); break;
    default: ;
  }
});
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

/**
 * 批量下载图片
 * @params downUrls: string[] 下载图片的链接数组
 * @params needMkDir: boolean 是否取图片链接名字上一层文件目录
*/
function downImg(downUrls, needMkDir = false) {
  downUrls.map(url => {
    let urlSplits = url.split('/')
    let fileName = urlSplits[urlSplits.length-1]
    let dir = 'assets/'
    if (needMkDir) {
      dir = 'assets/' + urlSplits[urlSplits.length-2]
      fs.mkdir('./' +dir, { recursive: true }, () => {
        getFileByUrl(url, fileName, dir)
      })
    } else {
      getFileByUrl(url, fileName, dir)
    }
  })
}

/**
 * 删除目标目录所有文件文件夹
 * @params deletePath 要删除的目录
 * */ 
function deleteAll(deletePath = './assets') {
  var files = [];
  if(fs.existsSync(deletePath)) {
    files = fs.readdirSync(deletePath);
    files.forEach(function(file, index) {
      var curPath = deletePath + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteAll(curPath);
        fs.rmdirSync(curPath)
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
  }
}

// 前两个默认为 全路径，这里不需要，隐藏掉
var arguments = process.argv.splice(2);

// 可以使用循环迭代所有的命令行参数（包括node路径和文件路径）
arguments.forEach((val, index) => {
  // console.log(`${index}: ${val}`);
  let mkdir = arguments.findIndex(i => i === 'mkdir') >-1;
  
  switch(val) {
    case 'down': downImg(itemUrls, mkdir); break;
    case 'clear': deleteAll(); break;
    default: ;
  }
});
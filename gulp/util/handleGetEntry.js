 var path = require('path');
 var fs = require('fs');

 // 获取多页面的每个 JS 入口文件
 module.exports = function() {
 	var jsDir = path.resolve(process.cwd(), './app/_assets/js/');
 	var dirs = fs.readdirSync(jsDir);
 	var matchs = [];
 	var entryFiles = [];

 	dirs.forEach(function(item) {
 		matchs = item.match(/(.+)\.js$/);
 		if (matchs) {
 			entryFiles.push('./app/_assets/js/' + matchs[1] + '.js');
 		}
 	});

 	return entryFiles;
 };
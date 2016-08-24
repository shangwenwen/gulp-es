var path = require('path');
var fs = require('fs');

// 获取 JS 入口/出口文件路径
module.exports = {
	entryFiles: function() {
		var srcApp = './app/_assets/js/'
		var jsDir = path.resolve(srcApp);
		var dirs = fs.readdirSync(jsDir);
		var entryFiles = [];

		for (var i = 0; i < dirs.length; i++) {
			fs.readdirSync(srcApp + dirs[i]).forEach(function(file) {
				if (file.match(/\.js$/) !== null) {
					entryFiles.push(srcApp + dirs[i] + '/' + file);
				}
			});
		}

		return entryFiles;
	},

	devOut: function(src) {
		var _self = this;

		var devOut = _self.entryFiles('app').map(function(item, index) {
			return item.replace('./app/_assets/js/', './build/' + src + '/_assets/js/');
		});

		return devOut;
	}

}
var path = require('path');
var fs = require('fs');

// 获取 JS 入口/出口文件路径
module.exports = {
	entryFiles: function() {

		var jsDir = path.resolve('./app/_assets/js/');
		var dirs = fs.readdirSync(jsDir);
		var entryFiles = [];

		for (var i = 0; i < dirs.length; i++) {
			fs.readdirSync('./app/_assets/js/' + dirs[i]).forEach(function(file) {
				if (file.match(/\.js$/) !== null && file !== file.match(/\.scss$/)) {
					entryFiles.push('./app/_assets/js/' + dirs[i] + '/' + file);
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
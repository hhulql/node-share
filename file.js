/*读取文件*/
var fs = require('fs');
fs.readFile('data.txt', 'utf-8', function(err, data){
	if (err) throw err;
	//console.log(data);
});

/*读取一个目录，并遍历其中所有的文件*/
var path = 'D:/tec/node';
fs.readdir(path, function(err, files){
	if (err) throw err;
	
	for (var i = files.length - 1; i >= 0; i--) {
		var f = files[i];
		var href = "<a href='" + path + "/" + f + "' >" + f + "</a>";
		//console.log(href);
	};
});

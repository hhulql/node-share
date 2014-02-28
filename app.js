/**
一个简单的web服务器
将指定目录内的文件和目录展示出来
对于目录，可以继续点击，进入目录
对于文件，可以点击下载文件
*/
var http = require('http');
var u = require('url');
var urlencode = require('urlencode');

var path = 'D:/';

http.createServer(function(req, res){
	var url = req.url;
	console.log(url);
	if (url == '/list') {
		console.log('list files');
		list(req, res, path);
	} else if (url.indexOf('/click') != -1) {
		var path = getPath(req);
		click(req, res, path);
	}else if (url.indexOf('/down') != -1) {
		console.log('down file');
		down(req, res, getPath(req));
	} else {
		res.end('');
	}
}).listen(3000, "127.0.0.1");

function getPath(req) {
	var url_parts = u.parse(req.url, true);
	var query = url_parts.query;
	return query.path;
}

function click(req, res, path) {
	console.log('click');
	var exist = fs.existsSync(path);
	if (exist) {
		var stats = fs.statSync(path);
		if (stats.isDirectory(path)) {
			//目录
			console.log(path + ' is directory');
			list(req, res, path);
		} else if (stats.isFile(path)) {
			//文件
			console.log(path + ' is file');
			down(req, res, path);
		}
	}
}

function down(req, res, path) {;
	var filename = path.substring(path.lastIndexOf('/') + 1);
	console.log(filename);
	res.writeHead(200,{
  		'Content-Type':'application/octet-stream;charset=utf8',
  		'Coneten-Length':fs.statSync(path).size,
		'Content-Disposition': "attachment; filename="+urlencode(filename)
 	});

	var opt = {flags:'r'};
	var stream = fs.createReadStream(path, opt);
	stream.pipe(res);
	stream.on('end', function(){
		res.end();
	});
}

function list(req, res, path) {
	res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
	
	fs.readdir(path, function(err, files){
		if (err) throw err;

		var body = '<html><head></head><body>';
		for (var i = files.length - 1; i >= 0; i--) {
			var f = files[i];
			var href = "<a href='click?path=" + path + "/" + f + "' >" + f + "</a><br/>";
			body += href;
			//console.log(href);
		};

		body += '</body></html>';

		res.end(body);
	});
}

/*读取文件*/
var fs = require('fs');
fs.readFile('data.txt', 'utf-8', function(err, data){
	if (err) throw err;
	//console.log(data);
});

/*
var path = 'D:/tec/node';
fs.readdir(path, function(err, files){
	if (err) throw err;
	
	for (var i = files.length - 1; i >= 0; i--) {
		var f = files[i];
		var href = "<a href='" + path + "/" + f + "' >" + f + "</a>";
		//console.log(href);
	};
});
*/


console.log('Server running at http://127.0.0.1:3000/');

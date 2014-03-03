/**
一个简单的web服务器
将指定目录内的文件和目录展示出来
对于目录，可以继续点击，进入目录
对于文件，可以点击下载文件
*/
var http = require('http');
var u = require('url');
var urlencode = require('urlencode');
var fs = require('fs');

/*
创建web服务器，处理来自浏览器的请求
*/
http.createServer(function(req, res){
	var url = req.url;
	console.log('request url : ' + urlencode.decode(url, 'utf-8'));

	if (url == '/' || url == '/list') {
		var disks = getRootDirs();
		var html = createListPage(disks);
		res.end(html);
	} else if (url.indexOf('/click') != -1) {
		var path = getPath(req);
		click(req, res, path);
	}else if (url.indexOf('/down') != -1) {
		down(req, res, getPath(req));
	} else {
		res.end();
	}
}).listen(3000, "127.0.0.1");

/*
通过枚举的方式，确定所有的根目录
*/
function getRootDirs() {
	var allDisks = ['A:/', 'B:/', 'C:/', 'D:/', 'E:/', 'F:/', 'G:/'];
	var existDisks = [];
	var exist = false;

	for (var i = 0; i < allDisks.length; i++) {
		exist = fs.existsSync(allDisks[i]);
		if (exist) {
			var stats = fs.statSync(allDisks[i]);
			if (stats.isDirectory(allDisks[i])) {
				existDisks.push(allDisks[i])
			}
		}
	}

	return existDisks;
}

/*
定义文件共享的根目录
*/
function getRootDir() {
	return 'D:/';
}

/*
从请求中提出参数path
*/
function getPath(req) {
	var url_parts = u.parse(req.url, true);
	var query = url_parts.query;
	return query.path;
}

/*
处理页面中对目录或者文件的点击
*/
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

/*
下载给定的文件
需确保path对应的是文件
*/
function down(req, res, path) {;
	var filename = path.substring(path.lastIndexOf('/') + 1);
	console.log('download file : ' + filename);
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

/*
列出给定目录下的文件和目录
*/
function list(req, res, path) {
	console.log('list directory :' + path);
	res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
	
	fs.readdir(path, function(err, files){
		if (err) throw err;

		var body = createListPage(files, path);

		res.end(body);
	});
}

function createListPage(dirs, path) {
	var body = '<html><head></head><body>';
	for (var i = 0; i <= dirs.length - 1; i++) {
		var f = dirs[i], href = '';
		if (path) {
			href = "<a href='click?path=" + path + "/" + f + "' >" + f + "</a><br/>";
		} else {
			href = "<a href='click?path=" + f + "' >" + f + "</a><br/>";
		}
		 
		body += href;
	};

	body += '</body></html>';

	return body;	
}

console.log('Server running at http://127.0.0.1:3000/');

/**
 * Created by Administrator on 2017/3/15.
 */
let http = require('http');
http.createServer((req,res)=>{
	res.writeHead(200,{'content_Type':'text/html'});
	res.write('<h1>hello word</h1>');
	res.end('<p>end</p>')
}).listen(233);

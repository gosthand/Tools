// import  fs from '../../tools/fs'
require('babel-core/register');
/**
 * 创建TCP服务 接收用户端发过了的埋点数据
 * @type {module:net}
 */
// var net = require('net');
//
// var server = net.createServer();
//
// //聚合所有客户端
// var sockets = [];
//
// //接受新的客户端连接
// server.on('connection', function(socket){
//     console.log('got a new connection');
//     sockets.push(socket);
//     //从连接中读取数据
//     socket.on('data', function(data){
//         var res=new  Buffer(JSON.parse(JSON.stringify(data)));
//         console.log('got data:', res.toString());
//
//         //广播数据
//         //每当一个已连接的用户输入数据，就将这些数据广播给其他所有已连接的用户
//         sockets.forEach(function(otherSocket){
//             if (otherSocket !== socket){
//                 otherSocket.write(data);
//             }
//         });
//
//         //删除被关闭的连接
//         socket.on('close', function(){
//             console.log('connection closed');
//             var index = sockets.indexOf(socket);
//             sockets.splice(index, 1);
//         });
//     });
// });
//
// server.on('error', function(err){
//     console.log('Server error:', err.message);
// });
//
// server.on('close', function(){
//     console.log('Server closed');
// });
//
//
// server.listen(12580);    //监听端口

/**
 * 开启udp服务
 * @type {module:dgram}
 */
// var dgrm = require('dgram');
// var server = dgrm.createSocket('udp4');//udp4为指定UDP通信的协议类型
// server.on('message',function (msg, rinfo) {
//     console.log('已收到客户端发送的数据：'+msg);
//     console.log('客户端地址信息为&j',rinfo);
//     var buf = new Buffer('确认信息：'+msg);
//     //server.sent(Buffer,offset,length,port,address,[callback])
//     server.send(buf,0,buf.length,rinfo.port,rinfo.address);
// });
// //当socket对象开始监听指定的端口和地址时，触发socket端口的listening事件
// /*server.on('listening',function () {
//     var address = server.address();
//     console.log('服务器开始监听。地址信息为&j',address);
// });*/
// server.bind(3002,'localhost',function () {
//     //bind方法中也可以不写回调函数，单独监听listening事件
//     var address = server.address();
//     console.log('服务器开始监听。地址信息为&j',address);
// });


/**
 * 开启http服务
 * @type {number}
 */
var PORT = 12581;

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join("assets", pathname);
    console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);
console.log("   ┌─────────────────────────────────────────────────┐\n" +
    "   │                                                 │\n" +
    "   │   Serving!                                      │\n" +
    "   │                                                 │\n" +
    "   │   - Local:            http://localhost:"+PORT+"    │\n" +
    "   │   - On Your Network:  http://"+getIp()+":"+PORT+"   │\n" +
    "   │                                                 │\n" +
    "   │                                                 │\n" +
    "   │                                                 │\n" +
    "   └─────────────────────────────────────────────────┘");


/**
 * 获取客户端ip
 * @returns {string}
 */
function getIp() {
    let interfaces = require('os').networkInterfaces();
    for(let devName in interfaces){
        let iface = interfaces[devName];
        for(let i=0;i<iface.length;i++){
            let alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}







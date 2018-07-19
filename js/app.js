var app = require('http').createServer();
var io = require('socket.io')(app);
var PORT = 8081;
/*定义用户数组*/
var users = [];

app.listen(PORT);

io.on('connection', function (socket) {
	/*是否是新用户标识*/
	var isNewPerson = true; 
	/*当前登录用户*/
    var username = null;
	/*监听登录*/
	socket.on('login',function(data){
		for(var i=0;i<users.length;i++){
	        if(users[i].username === data.username){
	          	isNewPerson = false;
	          	break;
	        }else{
	          	isNewPerson = true;
	        }
	    }
	    if(isNewPerson){
	        username = data.username;
	        users.push({
	          username:data.username
	        })
	        /*登录成功*/
	        socket.emit('loginSuccess',data);
	        /*向所有连接的客户端广播add事件*/
	        io.sockets.emit('add',data);
	    }else{
	    	/*登录失败*/
	        socket.emit('loginFail','');
	    }  
	})

	/*监听发送消息*/
	socket.on('sendMessage',function(data){
		data.date = new Date().toLocaleTimeString();
        io.sockets.emit('receiveMessage',data);
    })
	socket.on('sendImg',function (data) {
		data.date = new Date().toLocaleTimeString();
		io.sockets.emit('receiveImage',data);
    })
	/*退出登录*/
	socket.on('disconnect',function(){
		/*向所有连接的客户端广播leave事件*/
      	io.sockets.emit('leave',username);
      	users.map(function(val,index){
        if(val.username === username){
          	users.splice(index,1);
        }
      })
    })
})

console.log('app listen at'+PORT);
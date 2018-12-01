/**
 * @file mian file of Chatroom back-end
 * @author muffinfish<muffinzkun@gmail.com>
 */

/* create http server */
const app = require('http').createServer();
/* create WebSocket server */
const io = require('socket.io')(app);

const PORT = 8081;

/* 记录当前在聊天室内的用户的信息 */
let usersInRoom = {};

io.on('connection', function (socket) {

	/* 此次建立WebSocket的用户名 */
	let username = null;

	/* 监听登录 */
	socket.on('login', function (userObject) {
		if (usersInRoom[userObject.username]) {
			/* 登录失败 */
			socket.emit('loginFail', '');
		}
		else {
			/* 登录成功 */
			username = userObject.username;
			usersInRoom[username] = userObject;
			/* 向客户端回传消息 */
			socket.emit('loginSuccess', userObject);
			/* 向所有连接的客户端广播add事件 */
			io.sockets.emit('add', userObject);
		}
	})

	/* 监听发送消息 */
	socket.on('sendMessage', function (messageObject) {
		messageObject.date = new Date().toLocaleTimeString();
		io.sockets.emit('receiveMessage', messageObject);
	})
	socket.on('sendImg', function (imgObject) {
		imgObject.date = new Date().toLocaleTimeString();
		io.sockets.emit('receiveImage', imgObject);
	})

	/* 退出登录 */
	socket.on('disconnect', function () {
		/* 向所有连接的客户端广播leave事件 */
		io.sockets.emit('leave', username);
		delete usersInRoom[username];
	})
});

app.listen(PORT);
console.log('app listen at' + PORT);
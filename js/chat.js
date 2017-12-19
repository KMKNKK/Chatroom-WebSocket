$(function(){
	/*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/
	var socket = io('ws://47.94.86.217:8081');
	/*定义用户名*/
	var uname = null;


	$('.chat-wrap').hide();

	/*登录*/
	$('.login-btn').click(function(){
		uname = $.trim($('#loginName').val());
		if(uname){
			/*向服务端发送登录事件*/
			socket.emit('login',{username:uname})
		}else{
			alert('请输入昵称')
		}
	})

	/*发送消息*/
	$('.sendBtn').click(function(){
		sendMessage()
	});
	$(document).keydown(function(event){            //键盘事件
		if(event.keyCode == 13){                    //回车
			sendMessage()
		}
	})

	/*登录成功*/
	socket.on('loginSuccess',function(data){
		if(data.username === uname){
			checkin(data)
		}else{
			alert('用户名不匹配，请重试')
		}
	})

	/*登录失败*/
	socket.on('loginFail',function(){
		alert('昵称重复')
	})

	/*新人加入提示*/
	socket.on('add',function(data){
		var html = '<p>系统消息:'+data.username+'已加入群聊</p>'+'<br>';
		$('.chat-con').append(html);
	})

	/*接收消息*/
	socket.on('receiveMessage',function(data){
		showMessage(data)
	})

	/*退出群聊提示*/
	socket.on('leave',function(name){
		if(name != null){
			var html = '<p>系统消息:'+name+'已退出群聊</p>'+'<br>';
			$('.chat-con').append(html);
		}
	})

	/*隐藏登录界面 显示聊天界面*/
	function checkin(data){
		$('.login-wrap').hide('slow');
		
		$('.chat-wrap').show('slow');
	}

	

	/*发送消息*/
	function sendMessage(){
		var txt = $('#sendtxt').val();
		$('#sendtxt').val('');
		if(txt){
			socket.emit('sendMessage',{username:uname,message:txt});
		}
	}

	/*显示消息*/
	function showMessage(data){
		var html
		if(data.username === uname){
			html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">'+data.message+'</span></div>'
		}else{
			html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username+'</span><span class="img fl"></span><span class="fl message">'+data.message+'</span></div>'
		}
		$('.chat-con').append(html);
	}

})
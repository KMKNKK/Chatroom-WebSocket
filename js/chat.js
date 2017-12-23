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
		if(event.keyCode == 13 && $('#chat-wrap').css("display")==="none"){                    //回车
			uname = $.trim($('#loginName').val());
		if(uname){
			/*向服务端发送登录事件*/
			socket.emit('login',{username:uname})
		}else{
			alert('请输入昵称')
		}
		}
		else if(event.keyCode == 13 && $('#chat-wrap').css("display")!=="none"){
			sendMessage();
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
	/*接受图片*/
	socket.on('receiveImage',function (data) {
		showImage(data)
		console.log(data);
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
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (let i = 0; i < 23; i++) {
			
            var emojiItem = document.createElement('img');
            emojiItem.src = '../Chatroom-WebScoket/images/emoji/' + i + '.gif';
			emojiItem.title = i;
			emojiItem.num = i;
		
			docFragment.appendChild(emojiItem);
			
        };
		emojiContainer.appendChild(docFragment);
		$('.chat-wrap').show('slow');
	}

	

	/*发送消息*/
	function sendMessage(){
		var txt = $('#sendtxt').val();
		$('#sendtxt').val('');
		if(txt){
			socket.emit('sendMessage',{username:uname,message:txt,date:new Date().toTimeString().substr(0, 8)});
		}
	}

	/*显示消息*/
	function showMessage(data){
		var html
		msg = showEmoji(data.message);
		if(data.username === uname){
			//html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="abs uname">'+ data.date +'</span><span class="message fr">'+ msg +'</span></div>'
			html='<div class="chat-item item-right clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img fr"></span><span class="fr message">'+msg+'</span></div>'
		}else{
			html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img fl"></span><span class="fl message">'+msg+'</span></div>'
		}
		$('.chat-con').append(html);
		if(isNewInWindow()){           //当用户正在界面底端时，实时显示最新消息，当用户在查看历史消息时，不跳转到最新消息
			scrollToEnd();            
		}
									   
	}

	//将页面下拉到最新消息处
	function scrollToEnd(){
		var div = document.getElementsByTagName("div");
		    div_length = div.length-4;
	
		div[div_length].scrollIntoView({behavior: "smooth"});	   //平滑滚动，提高了用户体验

	}

	//判断当有新信息来时，用户是否在页面底端
	function isNewInWindow(){
		var div = document.getElementsByTagName("div");
		div_length = div.length-5;

		if(isInWindow(div[div_length])){
			return true;
		}
		return false;
	}

	//判定元素是否在界面内
	function isInWindow(x){		
		if(x.getBoundingClientRect().top > window.innerHeight){
			console.log("down");
			return false;
		}
		else if(x.getBoundingClientRect().bottom < 0){
			console.log("up");
			return false;
		}
		return true;
	}
	//分析文字并用表情包替换emoji
	function showEmoji(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../Chatroom-WebScoket/images/emoji/' + emojiIndex + '.gif" />');
            };
        };
        return result;
    }

    //显示图片
	function showImage(data){
        var msgToDisplay = document.createElement('p');
        msgToDisplay.style.color = '#000';
        if(data.username === uname){
			html='<div class="chat-item item-right clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img fr"></span><img src="' + data.image + '" style = "margin-top:20px; max-width: 200px;max-height: 200px;float:right"/></div>'
			
        }else{
			html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img fl"></span><img src="' + data.image + '" style = "margin-top:20px; max-width: 200px;max-height: 200px;float: left"/></div>'
			
        }
        $('.chat-con').append(html);
        if(isNewInWindow()){           //当用户正在界面底端时，实时显示最新消息，当用户在查看历史消息时，不跳转到最新消息
            scrollToEnd();
        }
	}

	document.getElementById('toNewMessage').style.display = "none";



	//点击表情按钮时
    document.getElementById('emoji').addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        if(emojiwrapper.style.display != 'block'){
            emojiwrapper.style.display = 'block';
		}else{
        	emojiwrapper.style.display = 'none';
		}
        e.stopPropagation();
    }, false);
    document.body.addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        if (e.target != emojiwrapper) {
            emojiwrapper.style.display = 'none';
        };
    });
    document.getElementById('emojiWrapper').addEventListener('click', function(e) {
        //获取被点击的表情
        var target = e.target;
        console.log(target);
        if (target.nodeName.toLowerCase() == 'img') {
            var sendtxt = document.getElementById('sendtxt');
			sendtxt.focus();
            sendtxt.value = sendtxt.value + '[emoji:' + target.num + ']';
        };
    }, false);
    //页面滚动事件
	window.onscroll = function(){
	
		  if( isNewInWindow() ) { //显示图片
			document.getElementById('toNewMessage').style.display = "none";
		  } else { 				  //隐藏图片
			document.getElementById('toNewMessage').style.display = "inline";
			document.getElementById('toNewMessage').style.marginLeft = "48.5px";
		  }
		
		  var toNewMessage = document.getElementById("toNewMessage"); //获取图片所在的div
		
		  toNewMessage.onclick = function(){ //点击图片时触发的点击事件
			scrollToEnd(); //页面移动到顶部
		  }
		}
    document.getElementById('sendImage').addEventListener('change', function() {
        //检查是否有文件被选中
        if (this.files.length != 0) {
            //获取文件并用FileReader进行读取
            var file = this.files[0],
                reader = new FileReader();
            if (!reader) {
                return;
            };
            reader.onload = function(e) {
                //读取成功，显示到页面并发送到服务器
                socket.emit('sendImg',{username:uname,image: e.target.result,date:new Date().toTimeString().substr(0, 8)});
                
            };
            reader.readAsDataURL(file);
        };
    }, false);

})
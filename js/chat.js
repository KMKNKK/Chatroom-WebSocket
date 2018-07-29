/*聊天界面隐藏*/
$('.chat-wrap').hide();

$(function(){
	
	var socket,
	    ip = '47.94.86.217', // 可自行修改为你的服务端IP
		headnum = 1,         // 用户默认头像
		uname = null;

	/*登录界面函数*/
	login();

	/*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/
	socket = io('ws://' + ip +':8081');
	
	/*主函数*/
	function main(){
			
		//当名字不为空时，去掉两头空格并发给服务端
		uname = $.trim($('#loginName').val());
			if(uname){
				/*向服务端发送登录事件*/
				socket.emit('login',{username:uname})
			}else{
				alert('请输入昵称');
			}
	
		$('.chat-wrap').hide();
		
		/*发送消息*/
		$('.sendBtn').click(function(){
			sendMessage(socket);
		});
	
	
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
			alert('昵称重复');
			socket.close();
			socket = io('ws://' + ip +':8081');
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
		
		/*如果点击的不是头像界面或表情界面，则将其隐藏*/
		document.body.addEventListener('click', function(e) {
			if($('#chat-wrap').css("display")==="none") 				//位于登录界面
			{
				var headportrait = document.getElementById('headportrait');
				if (e.target != headportrait) {
					headportrait.style.display = 'none';
				};
			}
			else{
				var emojiwrapper = document.getElementById('emojiWrapper');
				if (e.target != emojiwrapper) {
					emojiwrapper.style.display = 'none';
				};
			}
		});
		
		//emoji
		document.getElementById('emojiWrapper').addEventListener('click', function(e) {
			//获取被点击的对象
			var target = e.target;
			console.log(target);
			if (target.nodeName.toLowerCase() == 'img') {   //如果是表情图像则发送
				var sendtxt = document.getElementById('sendtxt');
				sendtxt.focus();
				sendtxt.value = sendtxt.value + '[emoji:' + target.num + ']';
			};
		}, false);
		
		//页面滚动事件
		window.onscroll = function(){

			let top = window.pageYOffset || document.documentElement.scrollTop;

			if( isNewInWindow() || top === 0) { 
				//隐藏图片
				document.getElementById('toNewMessage').style.display = "none";
			} 
			else { 				  
				//隐藏图片
				document.getElementById('toNewMessage').style.display = "inline";
			}
		
			var toNewMessage = document.getElementById("toNewMessage"); //获取图片所在的div
		
			toNewMessage.onclick = function(){ //点击向下按钮时触发的点击事件
			scrollToEnd(); //页面移动到顶部
			}
		}
		
		//图片发送
		document.getElementById('sendImage').addEventListener('change', function() {

			var img = new Image();
			var reader = new FileReader();

			// 缩放图片需要的canvas
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');

			// base64地址图片加载完毕后
			img.onload = function () {
				// 图片原始尺寸
				var originWidth = this.width;
				var originHeight = this.height;
				// 最大尺寸限制
				var maxWidth = 400, maxHeight = 400;
				// 目标尺寸
				var targetWidth = originWidth, targetHeight = originHeight;
				// 图片尺寸超过400x400的限制
				if (originWidth > maxWidth || originHeight > maxHeight) {
					if (originWidth / originHeight > maxWidth / maxHeight) {
						// 更宽，按照宽度限定尺寸
						targetWidth = maxWidth;
						targetHeight = Math.round(maxWidth * (originHeight / originWidth));
					} else {
						targetHeight = maxHeight;
						targetWidth = Math.round(maxHeight * (originWidth / originHeight));
					}
				}
					
				// canvas对图片进行缩放
				canvas.width = targetWidth;
				canvas.height = targetHeight;
				// 清除画布
				context.clearRect(0, 0, targetWidth, targetHeight);
				// 图片压缩
				context.drawImage(img, 0, 0, targetWidth, targetHeight);
				var result = canvas.toDataURL('image/jpeg');
				console.log('result done!', result);
				socket.emit('sendImg',{username:uname,image: result,date:new Date().toTimeString().substr(0, 8),headnum:headnum});
			};

			//检查是否有文件被选中
			if (this.files.length != 0) {
				//获取文件并用FileReader进行读取
				for(let i = 0;i<this.files.length;i++){
					var file = this.files[i];

					if (!reader) {
						return;
					};
					reader.onload = function(e) {
						console.log('read')
						img.src = e.target.result;
						// //读取成功，发送到服务器
						// socket.emit('sendImg',{username:uname,image: e.target.result,date:new Date().toTimeString().substr(0, 8),headnum:headnum});
					};
					reader.readAsDataURL(file);
				};
		    };
		}, false);
	
	}
	
	/*登录界面函数*/
	function login(){

		loadHeadPortrait(); //头像初始化
		
		//点击头像按钮时
	    document.getElementById('head-btn').addEventListener('click', function(e) {
			var headportrait = document.getElementById('headportrait');
			if(headportrait.style.display != 'block'){
				headportrait.style.display = 'block';
			}else{
				headportrait.style.display = 'none';
			}
			e.stopPropagation();
		}, false);
		
		/*键盘回车事件*/
		keydown();
		
		document.getElementById('main').addEventListener('click', function(e) {
			//获取被点击的头像
			var target = e.target;
			if (target.nodeName.toLowerCase() == 'img') {
				headnum = e.target.num;
				document.getElementById('defaultHead').setAttribute('src','https://kmknkk.oss-cn-beijing.aliyuncs.com/chat-img/user/user'+ headnum +'.jpg');				
				headportrait.style.display = 'none';
			}
			else {
				headportrait.style.display = 'none';
			};
		}, false);


		//点击登录后，确认IP地址
		$('.login-btn').click(function(){
			main();
		});
	}

	/*头像初始化*/
	function loadHeadPortrait(){
		var headContainer = document.getElementById('headportrait'),    //获取头像容器元素
		headFragment = document.createDocumentFragment();			//创建文档块

		for (let i = 1; i <= 14; i++) {								//将头像存入文档块
				
			var headItem = document.createElement('img');

			headItem.src = 'https://kmknkk.oss-cn-beijing.aliyuncs.com/chat-img/user/user' + i + '.jpg';
		
			headItem.num = i;
		
			headFragment.appendChild(headItem);
			
		};
		headContainer.appendChild(headFragment);					//统一导入头像容器
	}

	/*键盘回车事件*/
	function keydown(){
		
		$(document).keydown(function(event){            
			/*回车事件*/
			if(event.keyCode == 13 && $('#chat-wrap').css("display")==="none"){   //登录界面                
				uname = $.trim($('#loginName').val());
				if(uname){
					main();		
				}else{
					alert('请输入昵称')
				}
			}
			else if(event.keyCode == 13 && $('#chat-wrap').css("display")!=="none"){	//聊天界面
				sendMessage(socket);
			}
		})
	}

	/*隐藏登录界面 显示聊天界面*/
	function checkin(data){
		$('.login-wrap').hide('slow');
		var emojiContainer = document.getElementById('emojiWrapper'),
			docFragment = document.createDocumentFragment();

		// 初始化加载emoji
		for (let i = 0; i < 38; i++) {
			
			var emojiItem = document.createElement('img');
			emojiItem.src = 'https://kmknkk.oss-cn-beijing.aliyuncs.com/chat-img/emoji/' + i + '.gif';
			emojiItem.title = i;
			emojiItem.num = i;
		
			docFragment.appendChild(emojiItem);
			
		};
		emojiContainer.appendChild(docFragment);
		$('.chat-wrap').show('slow');
	}

	/*发送消息*/
	function sendMessage(socket){
			var txt = filterXSS($('#sendtxt').val());
			$('#sendtxt').val('');
			if(txt){
				socket.emit('sendMessage',{username:uname,message:txt,date:new Date().toTimeString().substr(0, 8),headnum:headnum});
			}
	}
	
	/*显示消息*/
	function showMessage(data){
			var html
			msg = showEmoji(data.message);
			if(data.username === uname){
				html='<div class="chat-item item-right clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img'+ headnum +' fr"></span><span class="fr message">'+msg+'</span></div>'
			}else{
				html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img'+ data.headnum +' fl"></span><span class="fl message">'+msg+'</span></div>'
			}
			$('.chat-con').append(html);
			if(isNewInWindow()){           //当用户正在界面底端时，实时显示最新消息，当用户在查看历史消息时，不跳转到最新消息
				scrollToEnd();            
			}
										   
	}
	
	/*将页面下拉到最新消息处*/
	function scrollToEnd(){
			var div = document.getElementsByTagName("div");
				div_length = div.length - 6;
			div[div_length].scrollIntoView({behavior: "smooth"});	   //平滑滚动，提高了用户体验
	
	}
	
	/*判断当有新信息来时，用户是否在页面底端*/
	function isNewInWindow(){
			var div = document.getElementsByTagName("div");
			div_length = div.length-6;
	
			if(isInWindow(div[div_length])){
				return true;
			}
			return false;
	}
	
	/*判定元素是否在界面内*/
	function isInWindow(x){		
			if(x.getBoundingClientRect().top > window.innerHeight){
				// 元素低于当前界面
				return false;
			}
			else if(x.getBoundingClientRect().bottom < 0){
				// 元素高于当前界面
				return false;
			}
			return true;
	}
		
	/*分析文字并用表情包替换emoji*/
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
					result = result.replace(match[0], '<img class="emoji" src="https://kmknkk.oss-cn-beijing.aliyuncs.com/chat-img/emoji/' + emojiIndex + '.gif" />');
				};
			};
			return result;
	}
	
	/*显示图片*/
	function showImage(data){
			var msgToDisplay = document.createElement('p');
			msgToDisplay.style.color = '#000';
			if(data.username === uname){
				html='<div class="chat-item item-right clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img'+headnum+' fr" style="margin-left: 10px;"></span><img src="' + data.image + '" style = "margin-top:20px; max-width: 200px;max-height: 200px;float: right"/></div>'
				
			}else{
				html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username + '&nbsp;'+'&nbsp;'+'&nbsp;' + data.date+'</span><span class="img'+data.headnum+' fl" style="margin-right: 10px;"></span><img src="' + data.image + '" style = "margin-top:20px; max-width: 200px;max-height: 200px;float: left"/></div>'
				
			}
			$('.chat-con').append(html);
			if(isNewInWindow()){           //当用户正在界面底端时，实时显示最新消息，当用户在查看历史消息时，不跳转到最新消息
				scrollToEnd();
			}
	}

})

function clickImageButton() {
    document.getElementById("sendImage").click();
}



$(function(){
//	$("#_content").attr('page', 'profile');
	
	$.loading.show({tips:'正在加载...'});
	
	apiClient({
		url: 'admin/validate',
		data:{reload:1},
		success: function(data){
			if(data && data.code == 0){
				if(data.model){
					$("#profileForm input[name=full_name]").val(data.model.fullName);
					$("#profileForm input[name=email]").val(data.model.email);
				}
			}else{
				alertError(data.message);
			}
		},
		complete: function(){
			$.loading.hide();
		}
	});
	
	$($('#profileForm button[type=button]')[0]).click(function(){
		var fullNameNode = $("#profileForm input[name=full_name]");
		if(fullNameNode && fullNameNode.length && !fullNameNode.val()){
			showToolTip(fullNameNode);
			return false;
		}

		var emailNode = $("#profileForm input[name=email]");
		if(emailNode && emailNode.length && !emailNode.val()){
			showToolTip(emailNode);
			return false;
		}

		$.loading.show({tips:'正在提交...'});
		
		apiClient({
			url: 'user/profile',
			method: 'post',
			data: $("#profileForm").serialize(),
			success: function(data){
				if(data.code == 0){
					alertError('修改成功');
					$("#_fullname").text($("#profileForm input[name=full_name]").val());
				}else{
					alertError(data.message);
				}
			},
			complete: function(){
				$.loading.hide();
			}
		})
	});
	
	// websocket样例
//	doListenBroadcast();
//	doListenUserTopic();
})

/**
 * websocket样例 
 * 监听广播
 */
function doListenBroadcast(){
	var socket = new SockJS(_wsBaseUrl);
    var stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/hello', function (data) {
        	var json = data.body;
        	var view = JSON.parse(json);
        	alert('websocket广播信息：' + view.message);
        });
    });
}

/**
 * websocket样例
 * 监听用户单点消息
 */
function doListenUserTopic(){
	var socket = new SockJS(_wsBaseUrl);
    var stompClient = Stomp.over(socket);
    
    var user = getLocalStorageObject('user');
    if(!user){
    	return;
    }
    
    var userId = user.id;
    
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/user/' + userId + '/hello', function (data) {
        	var json = data.body;
        	var view = JSON.parse(json);
        	alert('websocket单点推送信息：' + view.message);
        });
    });
}

/**
 * 路由地址回调
 */
function routeCallBack(){
	var navMenus = [];
	navMenus.push({text:'个人设置',link:'#profile'});
	return {navMenus:navMenus};
}
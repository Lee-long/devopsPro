$(function(){
	//if('ontouchstart' in document.documentElement) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
	
	$('#_login').click(function(){
		login();
	});
	
	$('input').keyup(function(event){
		if(event.keyCode == 13){
			// 回车
			login();
		}
	});
	
	reloadToken();
	
	$('img[name=token]').click(function(){
		reloadToken();
	});
})

function login(){
	var usernameNode = $($('input[type="text"]')[0]);
	var username = $.trim(usernameNode.val());
	console.log(usernameNode);
    console.log(username);
	if(!username){
		showToolTip(usernameNode);
		return;
	}
	
	var passwordNode = $('input[type="password"]');
	var password = passwordNode.val();
	if(!password){
		showToolTip(passwordNode);
		return;
	}
	
	var imageTokenNode = $($('input[type=text]')[1]);
	var imageToken = imageTokenNode.val();
	if(!imageToken){
		showToolTip(imageTokenNode);
		return;
	}
	
	$.loading.show({tips:'正在登录...'});
	
	apiClient({
		url: 'admin/login',
		type: 'post',
		data: {username:username,password:password,imageToken:imageToken},
		success: function(data){
			if(data.code == 0){
//				recordLogin();
				setLocalStorage('user', JSON.stringify(data.model));
				window.location.href = 'index.html';
			}else if(data.code == 7){
				reloadToken();
				$.loading.hide();
				alertError('验证码错误');
			}else{
				reloadToken();
				$.loading.hide();
				alertError(data.message);
			}
		},
		error: function(){
			$.loading.hide();
		}
	});	
}

function reloadToken(){
	var url = _baseUrl + 'common/token/image?_r=' + Math.random();
	$('img[name=token]').attr('src', url);
	$($('input[type=text]')[1]).val('');
}

//function showLoading(){
//	bootbox.dialog({
//		message: "a",
//		buttons:
//		{
//			"success" :
//			 {
//				"label" : "<i class='ace-icon fa fa-check'></i> Success!",
//				"className" : "btn-sm btn-success",
//				"callback": function() {
//					//Example.show("great success");
//				}
//			},
//			"danger" :
//			{
//				"label" : "Danger!",
//				"className" : "btn-sm btn-danger",
//				"callback": function() {
//					//Example.show("uh oh, look out!");
//				}
//			}, 
//			"click" :
//			{
//				"label" : "Click ME!",
//				"className" : "btn-sm btn-primary",
//				"callback": function() {
//					//Example.show("Primary button");
//				}
//			}, 
//			"button" :
//			{
//				"label" : "Just a button...",
//				"className" : "btn-sm"
//			}
//		}
//	});
//}

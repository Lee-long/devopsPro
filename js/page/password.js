$(function(){
//	$("#_content").attr('page', 'password');
	
	$($('#passwordForm button[type=button]')[0]).click(function(){
		var userOldPasswordNode = $("#passwordForm input[name=old_password]");
		if(userOldPasswordNode && userOldPasswordNode.length && !userOldPasswordNode.val()){
			showToolTip(userOldPasswordNode);
			return false;
		}

		var userNewPasswordNode1 = $("#passwordForm input[name=new_password1]");
		if(userNewPasswordNode1 && userNewPasswordNode1.length && !userNewPasswordNode1.val()){
			showToolTip(userNewPasswordNode1);
			return false;
		}
		
		var userNewPasswordNode2 = $("#passwordForm input[name=new_password2]");
		if(userNewPasswordNode2 && userNewPasswordNode2.length && !userNewPasswordNode2.val()){
			showToolTip(userNewPasswordNode2);
			return false;
		}
		
		if(userNewPasswordNode1.val() != userNewPasswordNode2.val()){
			alertError('两次输入的新密码不一致');
			return false;
		}

		$.loading.show({tips:'正在提交...'});
		
		apiClient({
			url: 'user/password',
			method: 'post',
			data: $("#passwordForm").serialize(),
			success: function(data){
				if(data.code == 0){
					alertError('密码修改成功');
				}else{
					$.loading.hide();
					if(data.code == 500){
						alertError('不能修改密码');
					}else if(data.code == 4){
						alertError('当前密码错误');
					}else{
						alertError(data.message);
					}
				}
			},
			complete: function(){
				$.loading.hide();
			}
		})
	});
})

/**
 * 路由地址回调
 */
function routeCallBack(){
	var navMenus = [];
	navMenus.push({text:'修改密码',link:'#password'});
	return {navMenus:navMenus};
}
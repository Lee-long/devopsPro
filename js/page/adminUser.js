$(function(){
	var pageName = getPageName();
//	$("#_content").attr('page', pageName);
	
	$("#adminUserQueryForm input[ctl-type=date]").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy-mm-dd',
		regional: 'zh-TW'
	});
	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	
	// 取消按钮
	$($('#adminUserAddForm button[type=button]')[1]).click(function(){
		$('#adminUserAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	$($('#adminUserPasswordForm button[type=button]')[1]).click(function(){
		$('#adminUserPasswordForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#adminUserQueryForm button[type="button"]').click(function(){
		doQuery();
	});
	
	// 新增记录提交
	$('#adminUserAddButton').click(function(){
		var valid = true;
		
		var adminUserLoginNameNode = $("#adminUserAddForm input[name=login_name]");
		if(!$.trim(adminUserLoginNameNode.val())){
			showToolTip(adminUserLoginNameNode);
			valid = false;
		}
		var adminUserPasswordNode = $("#adminUserAddForm input[name=password]");
		if(!$.trim(adminUserPasswordNode.val())){
			showToolTip(adminUserPasswordNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
//		var adminUserMobileNode = $("#adminUserAddForm input[name=mobile]");
//		if(adminUserMobileNode && adminUserMobileNode.length && !$.trim(adminUserMobileNode.val())){
//			showToolTip(adminUserMobileNode);
//			return false;
//		}
//		var adminUserEmailNode = $("#adminUserAddForm input[name=email]");
//		if(adminUserEmailNode && adminUserEmailNode.length && !$.trim(adminUserEmailNode.val())){
//			showToolTip(adminUserEmailNode);
//			return false;
//		}
//		var adminUserNickNameNode = $("#adminUserAddForm input[name=nick_name]");
//		if(!$.trim(adminUserNickNameNode.val())){
//			showToolTip(adminUserNickNameNode);
//			return false;
//		}
//		var adminUserFullNameNode = $("#adminUserAddForm input[name=full_name]");
//		if(!$.trim(adminUserFullNameNode.val())){
//			showToolTip(adminUserFullNameNode);
//			return false;
//		}
		
		$.loading.show({tips:'正在保存...'});
		
		apiClient({
			url: 'adminUser/add',
			method: 'post',
			data: $("#adminUserAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					$.loading.hide();
					$("#adminUserQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#adminUserAddForm button[type=reset]').click();
					doQuery();
				}else{
					$.loading.hide();
					alertError(data.message);
				}
			},
			error: function(){
				$.loading.hide();
			}
		})
	});
	
	// 修改密码
	$("#adminUserPasswordButton").click(function(){
		var valid = true;
		
//		var adminUserOldPasswordNode = $("#adminUserPasswordForm input[name=old_password]");
//		if(adminUserOldPasswordNode && adminUserOldPasswordNode.length && !adminUserOldPasswordNode.val()){
//			showToolTip(adminUserOldPasswordNode);
//			valid = false;
//		}
		
		var adminUserNewPasswordNode1 = $("#adminUserPasswordForm input[name=new_password]");
		if(adminUserNewPasswordNode1 && adminUserNewPasswordNode1.length && !adminUserNewPasswordNode1.val()){
			showToolTip(adminUserNewPasswordNode1);
			valid = false;
		}
		
//		var adminUserNewPasswordNode2 = $("#adminUserPasswordForm input[name=new_password2]");
//		if(adminUserNewPasswordNode2 && adminUserNewPasswordNode2.length && !adminUserNewPasswordNode2.val()){
//			showToolTip(adminUserNewPasswordNode2);
//			valid = false;
//		}
		
		if(!valid){
			return valid;
		}
		
//		if(adminUserNewPasswordNode1.val() != adminUserNewPasswordNode2.val()){
//			alertError('两次输入的新密码不一致');
//			return false;
//		}
		
		$.loading.show({tips:'正在提交...'});
		
		var id = Utils.parseUrlParam(window.location.href, 'id');
		$("#adminUserPasswordForm input[name=id]").val(id);
		
		apiClient({
			url: 'adminUser/password/reset',
			method: 'post',
			data: $("#adminUserPasswordForm").serialize(),
			success: function(data){
				if(data.code == 0){
					$.loading.hide();
					$("#adminUserQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#adminUserPasswordForm button[type=reset]').click();
					doQuery();
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
			error: function(){
				$.loading.hide();
			}
		})		
	});
	
	// 导入文件
	$("#adminUserImportExcel").click(function(){
		$("#adminUserExcelFile").val('');
		$("#adminUserExcelFile").click();
	});
	// 同步导入
	$("#adminUserUploadForm").ajaxForm({
		url: _baseUrl + 'adminUser/import',
//		uploadProgress: function(event, position, total, percentComplete){
//			$.loading.hide();
//			$.loading.show({tips:'正在上传' + percentComplete + '% ...'});
//			if(percentComplete >= 100){
//				setTimeout(function(){
//					$.loading.hide();
//					$.loading.show({tips:'正在导入...'});
//				}, 500);
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				$.loading.hide();
				doQuery();
			}else{
				$.loading.hide();
				alertError(data.message);
			}
		},
		error: function(){
			$.loading.hide();
		}
	});
	$("#adminUserExcelFile").change(function(){
		$.loading.show({tips:'正在导入...'});
//		$.loading.show({tips:'正在上传 0% ...'});
		$("#adminUserUploadForm").submit();
	});

/*
	// 异步导入
	$("#adminUserUploadForm").ajaxForm({
		url: _baseUrl + 'adminUser/import',
//		uploadProgress: function(event, position, total, percentComplete){
//			$.loading.hide();
//			$.loading.show({tips:'正在上传' + percentComplete + '% ...'});
//			if(percentComplete >= 100){
//				$.loading.hide();
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				taskHintModel.taskName = '文件导入';
				$("#userAdminAlert").show();
			}else{
				alertError(data.message);
			}
		}
	});
	$("#adminUserExcelFile").change(function(){
		$("#userAdminAlert").hide();
		$('#adminUserUploadForm input[name="async"]').val(1);
//		$.loading.show({tips:'正在上传 0% ...'});
		$("#adminUserUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#userAdminAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	adminUserListModel = new Vue({
		el: '#adminUserTableBlock',
		data: {
			grid: {items:[]}
		},
		methods: {
			formatThirdType: function(value){
				var text = value;
				if(value == 1){
					text = '微信';
				}else if(value == 2){
					text = '微博';
				}else if(value == 3){
					text = 'QQ';
				}
				return text;
			},
			formatGender: function(value){
				var text = value;
				if(value == 0){
					text = '保密';
				}else if(value == 1){
					text = '男';
				}else if(value == 2){
					text = '女';
				}
				return text;
			},
			formatAdminStatus: function(value){
				var text = value;
				if(value == 1){
					text = '管理员';
				}else if(value == 2){
					text = '普通用户';
				}
				return text;
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#adminUserCheckAll").prop('checked', true);
				}else{
					$("#adminUserCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk');
			},
			deleteRow: function(e){
				doDelete([$(e.target).attr('pk')]);
			},
			deleteRows: function(e){
				var ids = [];
				$('input[type=checkbox][pk]:checked').each(function(){
					ids.push($(this).attr('pk'));
				});
				
				doDelete(ids, '是否要删除选中行？');
			},
			goChangePassword: function(e){
				window.location.href = "#" + pageName + "?action=password&id=" + $(e.target).attr('pk');
			},
			turnPage: function(e){
				// 页码翻页
				var page = $(e.target).text();
				if(this.grid.currentPage != page){
					doQuery(page);
				}
			},
			refreshPage: function(e){
				// 行数刷新
				doQuery(this.grid.currentPage);
			},
			firstPage: function(e){
				// 第一页
				if(this.grid.currentPage > 1){
					doQuery(1);
				}
			},
			previousPage: function(e){
				// 上一页
				if(this.grid.currentPage > 1){
					doQuery(this.grid.currentPage - 1);
				}
			},
			nextPage: function(e){
				// 下一页
				if(this.grid.currentPage < this.grid.totalPage){
					doQuery(this.grid.currentPage + 1);
				}
			},
			lastPage: function(e){
				// 最后一页
				if(this.grid.currentPage < this.grid.totalPage){
					doQuery(this.grid.totalPage);
				}
			},
			jumpTo: function(e){
				// 跳转至
				var jumpNode = $('#adminUserJumpNo');
				var regexp = new RegExp(/^\d+$/);
				if(!regexp.test(jumpNode.val())){
					jumpNode.attr('title', '页码格式错误');
					showToolTip(jumpNode);
					return;
				}
				
				if(jumpNode.val() < 1 || jumpNode.val() > this.grid.totalPage){
					jumpNode.attr('title', '无效的页码');
					showToolTip(jumpNode);
					return;
				}
				
				doQuery(jumpNode.val());
			},
			exportQuery: function(e){
				$.loading.show({tips:'正在导出...'});
				apiClient({
					url: 'adminUser/export/query',
					success: function(data){
						if(data.code == 0){
							window.location.href = data.url;
						}else{
							alertError(data.message);
						}
					},
					complete: function(){
						$.loading.hide();
					}
				});
/*
				// 异步导出
				$("#userAdminAlert").hide();
				apiClient({
					url: 'adminUser/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#userAdminAlert").show();
						}else{
							alertError(data.message);
						}
					}
				});
*/
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						$.loading.show({tips:'正在导出...'});
						apiClient({
							url: 'adminUser/export/all',
							success: function(data){
								if(data.code == 0){
									window.location.href = data.url;
								}else{
									alertError(data.message);
								}
							},
							complete: function(){
								$.loading.hide();
							}
						});
					}
				});	
/*
						// 异步导出
						$("#userAdminAlert").hide();
						apiClient({
							url: 'adminUser/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#userAdminAlert").show();
								}else{
									alertError(data.message);
								}
							}
						});
*/
			}
		},
		mounted: function(){
			doQuery();
		}
	});
	
	// 编辑回显model
	adminUserItemModel = new Vue({
		el: '#adminUserEditForm',
		data: {
			model: {}
		},
		methods: {
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#adminUserEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
//				var adminUserLoginNameNode = $("#adminUserEditForm input[name=login_name]");
//				if(!$.trim(adminUserLoginNameNode.val())){
//					showToolTip(adminUserLoginNameNode);
//					return false;
//				}
//				var adminUserPasswordNode = $("#adminUserEditForm input[name=password]");
//				if(!$.trim(adminUserPasswordNode.val())){
//					showToolTip(adminUserPasswordNode);
//					return false;
//				}
//				var adminUserMobileNode = $("#adminUserEditForm input[name=mobile]");
//				if(!$.trim(adminUserMobileNode.val())){
//					showToolTip(adminUserMobileNode);
//					return false;
//				}
//				var adminUserEmailNode = $("#adminUserEditForm input[name=email]");
//				if(!$.trim(adminUserEmailNode.val())){
//					showToolTip(adminUserEmailNode);
//					return false;
//				}
//				var adminUserNickNameNode = $("#adminUserEditForm input[name=nick_name]");
//				if(!$.trim(adminUserNickNameNode.val())){
//					showToolTip(adminUserNickNameNode);
//					return false;
//				}
//				var adminUserFullNameNode = $("#adminUserEditForm input[name=full_name]");
//				if(!$.trim(adminUserFullNameNode.val())){
//					showToolTip(adminUserFullNameNode);
//					return false;
//				}
//				var adminUserAvatarNode = $("#adminUserEditForm input[name=avatar]");
//				if(!$.trim(adminUserAvatarNode.val())){
//					showToolTip(adminUserAvatarNode);
//					return false;
//				}
//				var adminUserLastLoginIpNode = $("#adminUserEditForm input[name=last_login_ip]");
//				if(!$.trim(adminUserLastLoginIpNode.val())){
//					showToolTip(adminUserLastLoginIpNode);
//					return false;
//				}
				$.loading.show({tips:'正在保存...'});
				
				apiClient({
					url: 'adminUser/edit',
					method: 'post',
					data: $("#adminUserEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							$.loading.hide();
							window.location.href = '#' + pageName;
							$('#adminUserEditForm button[type=reset]').click();
							doQuery();
						}else{
							$.loading.hide();
							alertError(data.message);
						}
					},
					error: function(){
						$.loading.hide();
					}
				})
			}
		}
	});
})

var adminUserListModel, adminUserItemModel;

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		$.loading.show({tips:'正在查询...'});
	}
	$("#adminUserQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#adminUserRefreshRows").val();
	$("#adminUserQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'adminUser/search',
		data: $("#adminUserQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#adminUserTable input[type=checkbox]').prop('checked', false);
				adminUserListModel.grid = data;
				$("#adminUserTableBlock").show();
			}else{
				alertError(data.message);
			}
		},
		complete: function(){
			$('input[type=checkbox][pk]').prop('checked', false);
			if(!action){
				$.loading.hide();
			}
		}
	})
}

/**
 * 删除记录
 * @param {Array} ids	记录主键id
 */
function doDelete(ids, message){
	var message = message ? message : '是要否删除当前行？';
	if(ids && ids.length){
		bootbox.confirm(message, function(result){
			if(result){
				$.loading.show({tips:'正在删除...'});
				apiClient({
					url: 'adminUser/delete?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							$.loading.hide();
							doQuery();
						}else{
							alertError(data.message);
							$.loading.hide();
						}
					}
				});
			}
		});	
	}
}

/**
 * 加载明细数据
 */
function loadAdminUserItem(){
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("#div [action=edit]").hide();
		apiClient({
			url: 'adminUser/edit',
			data: {id:id},
			success: function(data){
				if(data.code == 0 && data.model){
					adminUserItemModel.model = data.model;
					$.loading.hide();
				}else{
					$.loading.hide();
					alertError(data.message);
				}
			},
			complete: function(){
				$("#div [action=edit]").show();
				$.loading.hide();
			}
		})
	}
}

/**
 * 路由地址回调
 * @param {String} page 页面名称	
 */
function routeCallBack(){
//	var pageName = getPageName();
//	if(page != pageName){
//		// 跳至主页
//		$('#_content').empty();
//		return;
//	}
	
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			$.loading.show({tips:'正在加载...'});
			apiClient({
				url: 'common/repository/role/find',
				data: {delete_status:1},
				success: function(data){
					if(data.code == 0){
						new Vue({
							el: '#adminUserAddRole',
							data: {model:data.model}
						});
						$.loading.hide();
					}else{
						$.loading.hide();
						alertError(data.message);
					}
				}
			})
		}else if(action == 'edit'){
			$.loading.show({tips:'正在加载...'});
			loadAdminUserItem();
		}
	}else{
//		if($("#_content").attr('page') != pageName){
//			$('#_content').load('adminUser.html');
//		}
		$('div[action]').hide();
		$('div[action="query"]').show();
	}
}


//@ sourceURL=user.js
$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#userQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#userAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#userAddForm input[ctl-type=datetime]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
		icons: {
			time: 'fa fa-clock-o',
			date: 'fa fa-calendar',
			up: 'fa fa-chevron-up',
			down: 'fa fa-chevron-down',
			previous: 'fa fa-chevron-left',
			next: 'fa fa-chevron-right',
			today: 'fa fa-arrows',
			clear: 'fa fa-trash',
			close: 'fa fa-times'
		}
	});
	// 整数输入
	$("#userAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#userAddForm input[ctl-type=decimal]").blur(function(){
		var value = $(this).val().replace(/[^\d\.]/g, '');
		var dotIndex = value.indexOf('.');
		if(dotIndex){
			var other = value.substr(dotIndex + 1);
			other = other.replace(/\./g, '');
			value = value.substr(0, dotIndex + 1) + other;
		}
		$(this).val(value);
	});


	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	//添加是部门选择
	orgIdListModel = new Vue({
		el: '#orgIdList',
		data: {
			items: []
		}
	});
	//检索用部门选择
	searchOrgIdListModel = new Vue({
		el: '#searchOrgIdList',
		data: {
			items: []
		}
	});
	//添加岗位选择
	userPositionListModel = new Vue({
		el: '#positionList',
		data: {
			items: []
		}
	});

	//添加岗位选择
	safetyPositionListModel = new Vue({
		el: '#safetyPositionList',
		data: {
			items: []
		}
	});

	//角色
	roleIdListModel = new Vue({
		el: '#roleIdList',
		data: {
			items: []
		}
	});

	
	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	// 取消按钮
	$('#userCancelButton').click(function(){
		$('#userAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});

	$($('#userPasswordForm button[name=passwordCancel]')).click(function(){
		$('#userPasswordForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	// 查询按钮
	$('#userQueryForm button[type="button"][name=userQueryButton]').click(function(){
		doQuery();
	});

//	$('#userQueryForm button[type="reset"]').click(function(){
//		$("#userQueryForm input[name=login_name]").val("");
//		$("#userQueryForm input[name=org_id]").val("");
//		doQuery(1);
//	});
	// 导出按钮
	$('#userQueryForm button[type="button"][name=userExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#userQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'user/export/all',
					data: $("#userQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							window.location.href = data.url;
						}else{
							alert(data.message);
						}
					},
					complete: function(){
						hideLoading();
					}
				});
/*
				// 异步导出
				$('#userQueryForm input[name=async]').val(1);
				$("#userAlert").hide();
				apiClient({
					url: 'user/export/all',
					data: $("#userQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#userAlert").show();
						}else{
							alert(data.message);
						}
					}
				});
*/
			}
		});
	});
	
	// 新增记录提交
	$('#userAddButton').click(function(){
		var valid = true;
		// 登录账号
		var userLoginNameNode = $("#userAddForm input[name=login_name]");
		if(userLoginNameNode && userLoginNameNode.length && !$.trim(userLoginNameNode.val())){
			showToolTip(userLoginNameNode);
			valid = false;
		}
		// 密码
		var userPasswordNode1 = $("#userAddForm input[name=password1]");
		if(!$.trim(userPasswordNode1.val())){
			showToolTip(userPasswordNode1);
			valid = false;
		}

		var userPasswordNode2 = $("#userAddForm input[name=password2]");
		if(!$.trim(userPasswordNode2.val())){
			userPasswordNode2.attr("title","请输入确认密码");
			showToolTip(userPasswordNode2);
			valid = false;
		}
		// 密码 
		if( userPasswordNode1.val() != userPasswordNode2.val() )
		{ 
			userPasswordNode2.attr("title","两次输入的密码不一致");
			showToolTip(userPasswordNode2);
			valid = false;
		} 
		// 所属组织 
		var userOrgIdNode = $("#userAddForm input[name=org_id]");
		if(userOrgIdNode && userOrgIdNode.length && !$.trim(userOrgIdNode.val())){
			showToolTip(userOrgIdNode);
			valid = false;
		}
		// 工号
		var userJobNoNode = $("#userAddForm input[name=job_no]");
		if(userJobNoNode && userJobNoNode.length && !$.trim(userJobNoNode.val())){
			showToolTip(userJobNoNode);
			valid = false;
		}
		// 身份证号
		var userCardIdNode = $("#userAddForm input[name=card_id]");
		if(userCardIdNode && userCardIdNode.length && !$.trim(userCardIdNode.val())){
			showToolTip(userCardIdNode);
			valid = false;
		}
		// 职位id
		var positionDateNode = $("#userAddForm input[name=position_date]");
		if(positionDateNode && positionDateNode.length && !$.trim(positionDateNode.val())){
			showToolTip(positionDateNode);
			valid = false;
		}
		// 上岗日期
		var positionDateNode = $("#userAddForm input[name=position_date]");
		if(positionDateNode && positionDateNode.length && !$.trim(positionDateNode.val())){
			showToolTip(positionDateNode);
			valid = false;
		} 
		// 入职时间
		var onboardDateNode = $("#userAddForm input[name=onboard_date]");
		if(onboardDateNode && onboardDateNode.length && !$.trim(onboardDateNode.val())){
			showToolTip(onboardDateNode);
			valid = false;
		}  
		// 电子邮件
		var emailNode = $("#userAddForm input[name=email]");
		if(emailNode && emailNode.length && !$.trim(emailNode.val())){
			showToolTip(emailNode);
			valid = false;
		}  
		if(!valid){
			return valid;
		}
		$("#userAddForm input[name=password]").val(userPasswordNode1.val());
		showLoading('正在保存...');
		
		apiClient({
			url: 'user/add',
			method: 'post',
			data: $("#userAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#userQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#userAddForm button[type=reset]').click();
				}else{
					hideLoading();
					alert(data.message);
				}
			},
			error: function(){
				hideLoading();
			}
		})
	});
		// 修改密码
		$("#userPasswordButton").click(function(){
			var valid = true; 
//			var userPasswordNode = $("#userPasswordForm input[name=password]");
//			if(userPasswordNode && userPasswordNode.length && !userPasswordNode.val()){
//				showToolTip(userPasswordNode);
//				valid = false;
//			} 

			var userNewPasswordNode = $("#userPasswordForm input[name=new_password]");
			if(userNewPasswordNode && userNewPasswordNode.length && !userNewPasswordNode.val()){
				showToolTip(userNewPasswordNode);
				valid = false;
			} 
			var userNewPasswordNode2 = $("#userPasswordForm input[name=new_password2]");
			if(userNewPasswordNode2 && userNewPasswordNode2.length && !userNewPasswordNode2.val()){ 
				userNewPasswordNode2.attr("title","请输入确认新密码");
				showToolTip(userNewPasswordNode2);
				valid = false;
			} 
			if(userNewPasswordNode2.val() != userNewPasswordNode.val()){
				userNewPasswordNode2.attr("title","两次输入的新密码不一致！");
				showToolTip(userNewPasswordNode2);
				valid = false;
			}
			if(!valid){
				return valid;
			}
			
//			if(userNewPasswordNode1.val() != userNewPasswordNode2.val()){
//				alertError('两次输入的新密码不一致');
//				return false;
//			}
			
			$.loading.show({tips:'正在提交...'});
			
			var id = Utils.parseUrlParam(window.location.href, 'id');
			$("#userPasswordForm input[name=id]").val(id);
			
			apiClient({
				url: 'user/password/reset',
				method: 'post',
				data: $("#userPasswordForm").serialize(),
				success: function(data){
					if(data.code == 0){
						$.loading.hide();
						$("#userQueryForm button[type=reset]").click();
						window.location.href = '#' + pageName;
						$('#userPasswordForm button[type=reset]').click();
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
	$("#userImportExcel").click(function(){
		$("#userExcelFile").val('');
		$("#userExcelFile").click();
	});
	// 同步导入
	$("#userUploadForm").ajaxForm({
		url: _baseUrl + 'user/import',
		dataType:'json',
		/*dataType:'xml',*/		// 解开此注释以支持ie9
//		uploadProgress: function(event, user, total, percentComplete){
//			hideLoading();
//			showLoading('正在上传' + percentComplete + '% ...');
//			if(percentComplete >= 100){
//				setTimeout(function(){
//					hideLoading();
//					showLoading('正在导入...');
//				}, 500);
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				/**
				 * 当dataType="xml"时,使用该函数获取返回对象中属性对应的value
				 */
				/* var text = parseXml(data, "tagName"); */
				hideLoading();
				doQuery();
			}else{
				hideLoading();
				alert(data.message);
			}
		},
		error: function(){
			hideLoading();
		}
	});
	$("#userExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#userUploadForm").submit();
	});

/*
	// 异步导入
	$("#userUploadForm").ajaxForm({
		url: _baseUrl + 'user/import',
//		uploadProgress: function(event, user, total, percentComplete){
//			hideLoading();
//			showLoading('正在上传' + percentComplete + '% ...');
//			if(percentComplete >= 100){
//				hideLoading();
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				taskHintModel.taskName = '文件导入';
				$("#userAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#userExcelFile").change(function(){
		$("#userAlert").hide();
		$('#userUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#userUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#userAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	userListModel = new Vue({
		el: '#userTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatDate: function(value){ 
				if(value){
					return moment(value).format('YYYY-MM-DD');
				}else{ 
					return ""
				}
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#userCheckAll").prop('checked', true);
				}else{
					$("#userCheckAll").prop('checked', false);
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
			goChangePassword: function(e){
				window.location.href = "#" + pageName + "?action=password&id=" + $(e.target).attr('pk');
			},
			deleteRows: function(e){
				var ids = [];
				$('input[type=checkbox][pk]:checked').each(function(){
					ids.push($(this).attr('pk'));
				});
				
				doDelete(ids, '是否要删除选中行？');
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
				doQuery(1);
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
				var jumpNode = $('#userJumpNo');
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
				// 同步导出
				showLoading('正在导出...');
				apiClient({
					url: 'user/export/query',
					success: function(data){
						if(data.code == 0){
							window.location.href = data.url;
						}else{
							alert(data.message);
						}
					},
					complete: function(){
						hideLoading();
					}
				});
/*
				// 异步导出
				$("#userAlert").hide();
				apiClient({
					url: 'user/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#userAlert").show();
						}else{
							alert(data.message);
						}
					}
				});
*/
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						// 同步导出
						showLoading('正在导出...');
						apiClient({
							url: 'user/export/all',
							success: function(data){
								if(data.code == 0){
									window.location.href = data.url;
								}else{
									alert(data.message);
								}
							},
							complete: function(){
								hideLoading();
							}
						});
/*
						// 异步导出
						$("#userAlert").hide();
						apiClient({
							url: 'user/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#userAlert").show();
								}else{
									alert(data.message);
								}
							}
						});
*/
					}
				});	
			}
		},
		mounted: function(){
			// 这里添加列表初始化后的事件绑定代码
		}
	});
	
	// 编辑回显model
	userItemModel = new Vue({
		el: '#userEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				if(value){
					return moment(value).format('YYYY-MM-DD');
				}else{ 
					return ""
				}
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#userEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;

				// 所属组织id, t_org.id
				var userOrgIdNode = $("#userEditForm input[name=org_id]");
				if(userOrgIdNode && userOrgIdNode.length && !$.trim(userOrgIdNode.val())){
					showToolTip(userOrgIdNode);
					valid = false;
				}
//				// 登录账号
//				var userLoginNameNode = $("#userEditForm input[name=login_name]");
//				if(userLoginNameNode && userLoginNameNode.length && !$.trim(userLoginNameNode.val())){
//					showToolTip(userLoginNameNode);
//					valid = false;
//				} 
//				 
//				// 工号
//				var userJobNoNode = $("#userEditForm input[name=job_no]");
//				if(userJobNoNode && userJobNoNode.length && !$.trim(userJobNoNode.val())){
//					showToolTip(userJobNoNode);
//					valid = false;
//				}
				// 身份证号
				var userCardIdNode = $("#userEditForm input[name=card_id]");
				if(userCardIdNode && userCardIdNode.length && !$.trim(userCardIdNode.val())){
					showToolTip(userCardIdNode);
					valid = false;
				}
				// 职位id
				var userPositionIdNode = $("#userEditForm input[name=position_id]");
				if(userPositionIdNode && userPositionIdNode.length && !$.trim(userPositionIdNode.val())){
					showToolTip(userPositionIdNode);
					valid = false;
				} 
				
				// 上岗日期
				var positionDateNode = $("#userEditForm input[name=position_date]");
				if(positionDateNode && positionDateNode.length && !$.trim(positionDateNode.val())){
					showToolTip(positionDateNode);
					valid = false;
				}  
				// 入职时间
				var onboardDateNode = $("#userEditForm input[name=onboard_date]");
				if(onboardDateNode && onboardDateNode.length && !$.trim(onboardDateNode.val())){
					showToolTip(onboardDateNode);
					valid = false;
				}  
				// 电子邮件
				var emailNode = $("#userEditForm input[name=email]");
				if(emailNode && emailNode.length && !$.trim(emailNode.val())){
					showToolTip(emailNode);
					valid = false;
				}  
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'user/edit',
					method: 'post',
					data: $("#userEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#userEditForm button[type=reset]').click();
						}else{
							hideLoading();
							alert(data.message);
						}
					},
					error: function(){
						hideLoading();
					}
				})
			}
		},
		mounted: function(){
			// 编辑页日期控件
			$("#userEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#userEditForm input[ctl-type=datetime]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN',
				icons: {
					time: 'fa fa-clock-o',
					date: 'fa fa-calendar',
					up: 'fa fa-chevron-up',
					down: 'fa fa-chevron-down',
					previous: 'fa fa-chevron-left',
					next: 'fa fa-chevron-right',
					today: 'fa fa-arrows',
					clear: 'fa fa-trash',
					close: 'fa fa-times'
				}
			});
			// 整数输入
			$("#userEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#userEditForm input[ctl-type=decimal]").blur(function(){
				var value = $(this).val().replace(/[^\d\.]/g, '');
				var dotIndex = value.indexOf('.');
				if(dotIndex){
					var other = value.substr(dotIndex + 1);
					other = other.replace(/\./g, '');
					value = value.substr(0, dotIndex + 1) + other;
				}
				$(this).val(value);
			});
		}
	});

})
function checkPassword(){
	// 密码
	var userPasswordNode1 = $("#userAddForm input[name=password1]"); 
	var userPasswordNode2 = $("#userAddForm input[name=password2]"); 
	if( userPasswordNode1.val() != userPasswordNode2.val() )
	{ 
		alertError("两次输入的密码不一致"); 
	}
}
var userListModel, userItemModel;
var orgIdListModel;
var searchOrgIdListModel;
var safetyPositionListModel;
var userPositionListModel;
var roleIdListModel;
function goAdd(){
	var pageName = getPageName();
	window.location.href = '#' + pageName + '?action=add';
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#userQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#userRefreshRows").val();
	$("#userQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'user/search',
		data: $("#userQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#userTable input[type=checkbox]').prop('checked', false);
				userListModel.grid = data;
				$("#userTableBlock").show();
			}else{
				alert(data.message);
			}
		},
		complete: function(){
			$('input[type=checkbox][pk]').prop('checked', false);
			if(!action){
				hideLoading();
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
				showLoading('正在删除...');
				apiClient({
					url: 'user/delete?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							hideLoading();
							doQuery();
						}else{
							alert(data.message);
							hideLoading();
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
function loadUserItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'user/edit',
			data: {id:id},
			success: function(data){
				$("#userEditBlock").show();
				if(data.code == 0 && data.model){
					userItemModel.model = data.model;
				}else{
					alert(data.message);
				}
			},
			complete: function(){
				$("div[action=edit]").show();
				hideLoading();
			}
		})
	}else{
		hideLoading();
	}
}

/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			apiClient({
				url: 'org/search/hierarchy',
				success: function(data){
					if(data.code == 0 && data.model){
						orgIdListModel.items = data.model;
						$.loading.hide();
					}else{
						$.loading.hide();
						alertError(data.message);
					}
				}
			});
			apiClient({
				url: 'position/search/positons',
				success: function(data){
					if(data.code == 0 && data.model){
						userPositionListModel.items = data.model;
						$.loading.hide();
					}else{
						$.loading.hide();
						alertError(data.message);
					}
				}
			});

			apiClient({
				url: 'role/search/roles',
				success: function(data){
					if(data.code == 0 && data.model){
						roleIdListModel.items = data.model;
						$.loading.hide();
					}else{
						$.loading.hide();
						alertError(data.message);
					}
				}
			});
			apiClient({
				url: 'safetyPosition/search/safetyPositions',
				success: function(data){
					if(data.code == 0 && data.model){
						safetyPositionListModel.items = data.model;
						$.loading.hide();
					}else{
						$.loading.hide();
						alertError(data.message);
					}
				}
			});
			
		}else if(action == 'edit'){
			loadUserItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
 		var page = $("#userQueryForm input[name=page]").val();
		doQuery(page);
		apiClient({
			url: 'org/search/hierarchy',
			success: function(data){
				if(data.code == 0 && data.model){
					searchOrgIdListModel.items = data.model;
					$.loading.hide();
				}else{
					$.loading.hide();
					alertError(data.message);
				}
			}
		}); 
	}
}

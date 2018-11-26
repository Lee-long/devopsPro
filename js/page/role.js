$(function(){
//	debugger;
	var pageName = getPageName();
//	$("#_content").attr('page', pageName);
	
//	$("#roleQueryForm input[name^=update_date]").datepicker({
//		changeMonth: true,
//		changeYear: true,
//		dateFormat: 'yy-mm-dd',
//		regional: 'zh-TW'
//	});

	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	
	// 取消按钮
	$($('#roleAddForm button[type="button"]')[1]).click(function(){
		window.location.href = '#' + pageName;
		$("#roleAddForm button[type='reset']").click();
	});
	
	// 查询按钮
	$('#roleQueryForm button[type="button"]').click(function(){
		doQuery();
	});
	
	// 新增记录提交
	$($('#roleAddForm button[type="button"]')[0]).click(function(){
		var valid = true;
		
		var roleNameNode = $("#roleAddForm input[name='name']");
		if(!$.trim(roleNameNode.val())){
			showToolTip(roleNameNode);
			valid = false;
		}
		
		var roleCodeNode = $("#roleAddForm input[name='code']");
		if(!$.trim(roleCodeNode.val())){
			showToolTip(roleCodeNode);
			valid = false;
		}
		
		var pattern = /^[a-z0-9]+$/;
		if(!pattern.test(roleCodeNode.val())){
			showToolTip(roleCodeNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		$.loading.show({tips:'正在保存...'});
		
		apiClient({
			url: 'role/add',
			method: 'post',
			data: $("#roleAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					$.loading.hide();
					window.location.href = '#' + pageName;
					$('#roleAddForm button[type="reset"]').click();
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
	
	// 导入文件
	$("#roleImportExcel").click(function(){
		$("#roleExcelFile").val('');
		$("#roleExcelFile").click();
	});
	$("#roleUploadForm").ajaxForm({
		url: _baseUrl + 'role/import',
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
	$("#roleExcelFile").change(function(){
		$.loading.show({tips:'正在导入...'});
		$("#roleUploadForm").submit();
	});
	
	// 权限类型与菜单联动
	$("#roleAddForm input[name=admin_status]").click(function(){
		if($(this).val() == '1'){
			$("#menu_tree_add").show();
		}else{
			$("#menu_tree_add").hide();
		}
	});
	
	// 查询结果model
	roleListModel = new Vue({
		el: '#roleTableBlock',
		data: {
			grid: {items:[]}
		},
		methods: {
//			formatAdminStatus: function(value){
//				var text = value;
//				if(value == 1){
//					text = '管理员';
//				}else if(value == 2){
//					text = '普通用户';
//				}
//				return text;
//			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type="checkbox"][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type="checkbox"][pk]').length == $('input[type="checkbox"][pk]:checked').length){
					$("#roleCheckAll").prop('checked', true);
				}else{
					$("#roleCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type="checkbox"][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk');
			},
			goAction: function(e){
				debugger;
				window.location.href = "#" + pageName + "?action=action&id=" + $(e.target).attr('pk') + "&roleName=" + $(e.target).attr('roleName');
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
			turnPage: function(e){
				// 页码翻页
				var page = $(e.target).text();
				if(this.grid.currentPage != page){
					doQuery(page);
				}
			},
			refreshPage: function(e){
				// 每页行数刷新
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
				var jumpNode = $('#roleJumpNo');
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
					url: 'role/export/query',
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
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						$.loading.show({tips:'正在导出...'});
						apiClient({
							url: 'role/export/all',
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
			}
		},
		mounted: function(){
			doQuery();
		}
	});
	
	// 编辑回显model
	roleItemModel = new Vue({
		el: '#roleEditForm',
		data: {
			model: {}
		},
		methods: {
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#roleEditForm button[type='reset']").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				var roleNameNode = $("#roleEditForm input[name='name']");
				if(!$.trim(roleNameNode.val())){
					showToolTip(roleNameNode);
					valid = false;
				}
				
				if(!valid){
					return valid;
				}
				
				$.loading.show({tips:'正在保存...'});
				
				apiClient({
					url: 'role/edit',
					method: 'post',
					data: $("#roleEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
//							apiClient({
//								url: 'admin/validate',
//								data: {reload:1},
//								async: false,
//								success: function(data){
//									if(data && data.code == 0){
//										setLocalStorage('user', JSON.stringify(data.model));
//									}
//								}
//							});
							
							window.location.href = '#' + pageName;
							$('#roleEditForm button[type="reset"]').click();
							doQuery();
						}else{
							alertError(data.message);
						}
					},
					complete: function(){
						$.loading.hide();
					}
				})
			},
			toggleTree: function(e){
				if($(e.target).val() == '1'){
					$("#menu_tree_edit").show();
				}else{
					$("#menu_tree_edit").hide();
				}
			}
		}
	});

	// 权限操作model
	roleActionListModel = new Vue({
		el: '#roleActionBlock',
		data: {
			model: {}
		},
		methods: {
			formatHead: function(text){
				var value = text;
				if(text == 'add'){
					value = '添加';
				}else if(text == 'import'){
					value = '导入';
				}else if(text == 'edit'){
					value = '编辑';
				}else if(text == 'delete'){
					value = '删除';
				}else if(text == 'export'){
					value = '导出';
				}else if(text == 'password'){
					value = '修改密码';
//				}else if(text == 'action'){
//					value = '操作';
				}
				return value;
			},
			selectAll: function(e){
				$("#roleActionTable input[type=checkbox]").prop('checked', $(e.target).prop('checked'));
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
			},
			doSave: function(e){
				// 保存操作权限
				showLoading('正在保存...');
				
				var inputs = $("#roleActionTable input[type=checkbox]");
				var cells = [];
				for(var i = 0; i < inputs.length; i++){
					var input = inputs[i];
					var cell = {};
					cell.menuId = $(input).attr('menuId');
					cell.actionName = $(input).attr('actionName');
					cell.checked = $(input).prop('checked');
					cells.push(cell);
				}
//				console.log(cells);
//				debugger;
				var roleId = Utils.parseUrlParam(window.location.href, 'id');
				apiClient({
					url: 'role/action',
					type: 'post',
					data: {
						id: roleId,
						cells:JSON.stringify(cells)
					},
					success: function(data){
						if(data && data.code == 0){
							// 刷新本地权限缓存
							apiClient({
								url: 'admin/validate',
								data:{reload:1},
								async: false,
								success: function(d){
									debugger;
									if(d && d.code == 0){
										setLocalStorage('user', JSON.stringify(d.model));
									}
								}
							});
							showPrompt('保存成功');
//							window.location.href = '#' + pageName;
						}else{
							alert(data.message);
						}
					},
					complete: function(){
						hideLoading();
					}
				})
			}
		}
	});
})

var roleListModel, roleItemModel, roleActionListModel;

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		$.loading.show({tips:'正在查询...'});
	}
	$("#roleQueryForm input[name='page']").val(page ? page : 1);
	
	var rows = $("#roleRefreshRows").val();
	$("#roleQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'role/search',
		data: $("#roleQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#roleTable input[type=checkbox]').prop('checked', false);
				roleListModel.grid = data;
				$("#roleTableBlock").show();
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
					url: 'role/delete?id=' + ids.join(','),
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
function loadRoleItem(){
	$('#menu_tree_edit').jstree(true).deselect_all(true);
	$("#roleEditForm input[name='selectedMenuId']").val('');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("#div [action=edit]").hide();
		apiClient({
			url: 'role/edit',
			data: {id:id},
			success: function(data){
				if(data.code == 0 && data.model){
					roleItemModel.model = data.model;
					if(data.model.adminStatus == 2){
						$("#menu_tree_edit").hide();
					}else{
						$("#menu_tree_edit").show();
					}
					if(data.model.menuIds && data.model.menuIds.length){
						$('#menu_tree_edit').jstree(true).select_node(data.model.menuIds);
					}
				}else{
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
 * @param {Integer} page	页码
 */
function routeCallBack(){
//	var pageName = getPageName();
//	if(page != pageName){
//		// 跳至主页
//		$('#_content').empty();
//		return;
//	}
	var action = Utils.parseUrlParam(window.location.href, 'action');
	//alert(action);
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			// 树形菜单
			var menuTreeNode = $('#menu_tree_add').jstree(true);
			if(!menuTreeNode){
				$('#menu_tree_add').jstree({
					plugins: ['checkbox'],
					core: {
						data: function(obj, callback){
							apiClient({
								url: 'home/menus/jstree',
								success: function(data){
									if(data.menus && data.menus.length){
										callback.call(this, data.menus);
									}
								}
							});
						}
					}
				}).on("changed.jstree", function(e, data){
					var selectedMenuId = $('#menu_tree_add').jstree(true).get_selected();
					$("#roleAddForm input[name='selectedMenuId']").val(selectedMenuId);
				});
			}else{
				menuTreeNode.deselect_all();
				menuTreeNode.refresh();
			}
		}else if(action == 'edit'){
			$.loading.show({tips:'正在加载...'});
			// 树形菜单
			var menuTreeNode = $('#menu_tree_edit').jstree(true);
			var roleId = Utils.parseUrlParam(window.location.href, 'id');
			if(!menuTreeNode){
				$('#menu_tree_edit').jstree({
					plugins: ['checkbox'],
					core: {
						data: function(obj, callback){
							apiClient({
								url: 'home/menus/jstree',
								data: {roleId:roleId},
								success: function(data){
									if(data.menus && data.menus.length){
										callback.call(this, data.menus);
									}
								}
							});
						}
					}
				}).on("changed.jstree", function(e, data){
					var selectedMenuId = $('#menu_tree_edit').jstree(true).get_selected();
					$("#roleEditForm input[name='selectedMenuId']").val(selectedMenuId);
				}).on("loaded.jstree", function(e, data){
					loadRoleItem();
				}).on('refresh.jstree', function(e, data){
					loadRoleItem();
				});
			}else{
				menuTreeNode.refresh();
			}			
		}else if(action == 'action'){
			showLoading('正在加载...');
			
			$("#roleActionBlock input[type=checkbox]").prop('checked', false);
			
			var roleId = Utils.parseUrlParam(window.location.href, 'id');
			apiClient({
				url: 'role/action',
				data:{id:roleId},
				success: function(data){
					if(data && data.code == 0){
						if(data.model == null) {
							roleActionListModel.model = {};
						} else {
							roleActionListModel.model = data.model;
						}
						var roleName = Utils.parseUrlParam(window.location.href, 'roleName');
						$('#roleNameText').text(roleName);
					}
				},
				complete: function(){
					hideLoading();
				}
			});
		}
	}else{
//		if($("#_content").attr('page') != pageName){
//			$('#_content').load(pageName + '.html');
//		}
		$('div[action]').hide();
		$('div[action="query"]').show();
	}
}

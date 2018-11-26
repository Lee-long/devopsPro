$(function(){
	var pageName = getPageName();
//	$("#_content").attr('page', pageName);

	$("#taskQueryForm input[ctl-type=date]").datepicker({
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
	$($('#taskAddForm button[type=button]')[1]).click(function(){
		$('#taskAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#taskQueryForm button[type="button"]').click(function(){
		doQuery();
	});
	
	// 新增记录提交
	$('#taskAddButton').click(function(){
		var taskNameNode = $("#taskAddForm input[name=name]");
		if(taskNameNode && taskNameNode.length && !$.trim(taskNameNode.val())){
			showToolTip(taskNameNode);
			return false;
		}
		var taskStoragePathNode = $("#taskAddForm input[name=storage_path]");
		if(taskStoragePathNode && taskStoragePathNode.length && !$.trim(taskStoragePathNode.val())){
			showToolTip(taskStoragePathNode);
			return false;
		}
		var taskFileUrlNode = $("#taskAddForm input[name=file_url]");
		if(taskFileUrlNode && taskFileUrlNode.length && !$.trim(taskFileUrlNode.val())){
			showToolTip(taskFileUrlNode);
			return false;
		}
		var taskExceptionNode = $("#taskAddForm input[name=exception]");
		if(taskExceptionNode && taskExceptionNode.length && !$.trim(taskExceptionNode.val())){
			showToolTip(taskExceptionNode);
			return false;
		}
		var taskCreateByNode = $("#taskAddForm input[name=create_by]");
		if(taskCreateByNode && taskCreateByNode.length && !$.trim(taskCreateByNode.val())){
			showToolTip(taskCreateByNode);
			return false;
		}
		var taskUpdateByNode = $("#taskAddForm input[name=update_by]");
		if(taskUpdateByNode && taskUpdateByNode.length && !$.trim(taskUpdateByNode.val())){
			showToolTip(taskUpdateByNode);
			return false;
		}
		
		$.loading.show({tips:'正在保存...'});
		
		apiClient({
			url: 'task/add',
			method: 'post',
			data: $("#taskAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					$.loading.hide();
					$("#taskQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#taskAddForm button[type=reset]').click();
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
	$("#taskImportExcel").click(function(){
		$("#taskExcelFile").val('');
		$("#taskExcelFile").click();
	});
	$("#taskUploadForm").ajaxForm({
		url: _baseUrl + 'task/import',
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
	$("#taskExcelFile").change(function(){
		$.loading.show({tips:'正在导入...'});
		$("#taskUploadForm").submit();
	});
	
	// 查询结果model
	taskListModel = new Vue({
		el: '#taskTableBlock',
		data: {
			grid: {items:[]}
		},
		methods: {
			formatFinishStatus: function(value){
				return getFinishStatus(value);
			},
			formatStatusClass: function(value){
				return getStatusClass(value);
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#taskCheckAll").prop('checked', true);
				}else{
					$("#taskCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk');
			},
			doAbort: function(name){
				bootbox.confirm('是否要中止当前任务？', function(result){
					if(result){
//						$.loading.show({tips:'正在导出...'});
						apiClient({
							url: 'task/abor',
							type: 'post',
							data: {name: name},
							success: function(data){
								if(data.code != 0){
									alertError(data.message);
								}
							},
							complete: function(){
//								$.loading.hide();
							}
						});
					}
				});					
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
				var jumpNode = $('#taskJumpNo');
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
					url: 'task/export/query',
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
							url: 'task/export/all',
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
	taskItemModel = new Vue({
		el: '#taskEditForm',
		data: {
			model: {}
		},
		methods: {
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#taskEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var taskNameNode = $("#taskEditForm input[name=name]");
				if(taskNameNode && taskNameNode.length && !$.trim(taskNameNode.val())){
					showToolTip(taskNameNode);
					return false;
				}
				var taskStoragePathNode = $("#taskEditForm input[name=storage_path]");
				if(taskStoragePathNode && taskStoragePathNode.length && !$.trim(taskStoragePathNode.val())){
					showToolTip(taskStoragePathNode);
					return false;
				}
				var taskFileUrlNode = $("#taskEditForm input[name=file_url]");
				if(taskFileUrlNode && taskFileUrlNode.length && !$.trim(taskFileUrlNode.val())){
					showToolTip(taskFileUrlNode);
					return false;
				}
				var taskExceptionNode = $("#taskEditForm input[name=exception]");
				if(taskExceptionNode && taskExceptionNode.length && !$.trim(taskExceptionNode.val())){
					showToolTip(taskExceptionNode);
					return false;
				}
				var taskCreateByNode = $("#taskEditForm input[name=create_by]");
				if(taskCreateByNode && taskCreateByNode.length && !$.trim(taskCreateByNode.val())){
					showToolTip(taskCreateByNode);
					return false;
				}
				var taskUpdateByNode = $("#taskEditForm input[name=update_by]");
				if(taskUpdateByNode && taskUpdateByNode.length && !$.trim(taskUpdateByNode.val())){
					showToolTip(taskUpdateByNode);
					return false;
				}
				$.loading.show({tips:'正在保存...'});
				
				apiClient({
					url: 'task/edit',
					method: 'post',
					data: $("#taskEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							$.loading.hide();
							window.location.href = '#' + pageName;
							$('#taskEditForm button[type=reset]').click();
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

//	doListening();
})

var taskListModel, taskItemModel;

/**
 * @deprecated
 * 监听进度
 */
function doListening(){
	var socket = new SockJS(_wsBaseUrl);
    var stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/task', function (data) {
        	var json = data.body;
        	var view = JSON.parse(json);
        	if(view.code == 0){
//				try{
        		var items = taskListModel.grid.items;
        		if(items && items.length){
        			for(var i = 0; i < items.length; i++){
	        			if(items[i].id == view.model.id){
	        				items[i].percent = view.model.percent;
	        				
		        			if(view.model.percent == 100){
		        				var text = getFinishStatus(view.model.finishStatus);
		        				
		        				// 状态文字
		        				var finishStatusNode = $('#taskTableBlock tr[pk=' + view.model.id + '] span');
		        				finishStatusNode.text(text);
		        				
		        				var cls = getStatusClass(view.model.finishStatus);
		        				finishStatusNode.removeClass().addClass(cls);
		        				
		        				// 结束日期
		        				var finishTimeNode = $('#taskTableBlock tr[pk=' + view.model.id + '] td[name="finishTime"]');
		        				finishTimeNode.text(moment(view.model.finishTime).format('YYYY-MM-DD HH:mm:ss'));
		        				
		        				// 下载link
		        				items[i].fileUrl = view.model.fileUrl;
		        			}
		        		}
	        		}
	        	}
//      		}catch(e){
//      			debugger;
//      		}
        	}
        });
    });
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		$.loading.show({tips:'正在查询...'});
	}
	$("#taskQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#taskRefreshRows").val();
	$("#taskQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'task/search',
		data: $("#taskQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#taskTable input[type=checkbox]').prop('checked', false);
				taskListModel.grid = data;
				$("#taskTableBlock").show();
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
					url: 'task/delete?id=' + ids.join(','),
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

function getFinishStatus(value){
	var text = value;
	if(value == 1){
		text = '成功';
	}else if(value == 2){
		text = '中止';
	}else if(value == 3){
		text = '异常';
	}else if(value == 4){
		text = '进行中';
	}
	return text;
}

function getStatusClass(value){
	var style = "label label-sm ";
	if(value == 1){
		style += 'label-success';
	}else if(value == 2){
		style += 'label-inverse';
	}else if(value == 3){
		style += 'label-danger';
	}else if(value == 4){
		style += 'label-warning';
	}
	return style;
}

/**
 * 加载明细数据
 */
function loadTaskItem(){
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		apiClient({
			url: 'task/edit',
			data: {id:id},
			success: function(data){
				if(data.code == 0 && data.model){
					taskItemModel.model = data.model;
				}else{
					alertError(data.message);
				}
			},
			complete: function(){
				$.loading.hide();
			}
		})
	}
}

/**
 * 路由地址回调
 * {String} page 页面名称	
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
			
		}else if(action == 'edit'){
			$.loading.show({tips:'正在加载...'});
			loadTaskItem();
		}
	}else{
//		if($("#_content").attr('page') != pageName){
//			$('#_content').load(pageName + '.html');
//		}
		$('div[action]').hide();
		$('div[action="query"]').show();
	}
}

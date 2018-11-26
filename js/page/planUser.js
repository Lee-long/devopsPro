
//@ sourceURL=planUser.js
$(function(){
	var pageName = getPageName();
	// 设置年度默认值
	var myDate = new Date;
    var year = myDate.getFullYear();//获取当前年
    $("#planUserQueryForm input[ctl-type=year]").val(year);
	 
	// 查询条件日期控件
	$("#planUserQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	$("#planUserQueryForm input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});
	// 新增页日期控件
	$("#planUserAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#planUserAddForm input[ctl-type=datetime]").datetimepicker({
		format: 'YYYY-MM-DD HH:mm:ss',
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
	$("#planUserAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#planUserAddForm input[ctl-type=decimal]").blur(function(){
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
	
	// 取消按钮
	$('#planUserCancelButton').click(function(){
		debugger;
		$('#planUserAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#planUserQueryForm button[type="button"][name=planUserQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#planUserQueryForm button[type="button"][name=planUserExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#planUserQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'planUser/export/all',
					data: $("#planUserQueryForm").serialize(),
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
				$('#planUserQueryForm input[name=async]').val(1);
				$("#planUserAlert").hide();
				apiClient({
					url: 'planUser/export/all',
					data: $("#planUserQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#planUserAlert").show();
						}else{
							alert(data.message);
						}
					}
				});
*/
			}
		});
	});
	
	
	// 导入文件
	$("#planUserImportExcel").click(function(){
		$("#planUserExcelFile").val('');
		$("#planUserExcelFile").click();
	});
	// 同步导入
	$("#planUserUploadForm").ajaxForm({
		url: _baseUrl + 'planUser/import',
		dataType:'json',
		/*dataType:'xml',*/		// 解开此注释以支持ie9
//		uploadProgress: function(event, position, total, percentComplete){
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
	$("#planUserExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#planUserUploadForm").submit();
	});

/*
	// 异步导入
	$("#planUserUploadForm").ajaxForm({
		url: _baseUrl + 'planUser/import',
//		uploadProgress: function(event, position, total, percentComplete){
//			hideLoading();
//			showLoading('正在上传' + percentComplete + '% ...');
//			if(percentComplete >= 100){
//				hideLoading();
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				taskHintModel.taskName = '文件导入';
				$("#planUserAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#planUserExcelFile").change(function(){
		$("#planUserAlert").hide();
		$('#planUserUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#planUserUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#planUserAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	planUserListModel = new Vue({
		el: '#planUserTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatDate: function(value){
				if(value){ 
					return moment(value).format('YYYY-MM-DD HH:mm');
				}else{
					return "";
				}
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#planUserCheckAll").prop('checked', true);
				}else{
					$("#planUserCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				window.location.href = "#" + pageName + "?action=courseConfirm&id=" + $(e.target).attr('pk');
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
				var jumpNode = $('#planUserJumpNo');
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
					url: 'planUser/export/query',
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
				$("#planUserAlert").hide();
				apiClient({
					url: 'planUser/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#planUserAlert").show();
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
							url: 'planUser/export/all',
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
						$("#planUserAlert").hide();
						apiClient({
							url: 'planUser/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#planUserAlert").show();
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
	planUserItemModel = new Vue({
		el: '#planUserEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				var completeStatus = $(e.target).parent().attr('completeStatus');
				if(completeStatus==0) {
					node.prop('checked', !node.prop('checked'));
					if($('#planUserEditForm input[type=checkbox][pk]').length == $('#planUserEditForm input[type=checkbox][pk]:checked').length){
						$("#planUserCheckAll").prop('checked', true);
					}else{
						$("#planUserCheckAll").prop('checked', false);
					}
				}
			},
			checkAll: function(e){
				$('#planUserEditForm input[type=checkbox][pk]').each(function(){
					if(!$(this).attr("disabled")){
						$(this).prop('checked', $(e.target).prop('checked'));
					}
				})
			},
			doCancel: function(e){
				debugger;
				window.location.href = '#' + pageName;
				$("#planUserEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				
				var ids = [];
				$('input[type=checkbox][pk]:checked').each(function(){
					ids.push($(this).attr('pk'));
				});
				
				if(ids.length == 0){
					alert('请选择人员！');
					return;
				}

				showLoading('正在保存...');
				
				$("#planUserEditForm input[name=user_id]").val(ids)
				apiClient({
					url: 'planUser/courseConfirm',
					method: 'post',
					data: $("#planUserEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#planUserEditForm button[type=reset]').click();
						}else{
							alert(data.message);
						}
					},
					complete: function(){
						hideLoading();
					}
				})
			}
		},
		mounted: function(){
			
			// 编辑页日期控件
			$("#planUserEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#planUserEditForm input[ctl-type=datetime]").datetimepicker({
				format: 'YYYY-MM-DD HH:mm:ss',
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
			$("#planUserEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#planUserEditForm input[ctl-type=decimal]").blur(function(){
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

var planUserListModel, planUserItemModel;

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#planUserQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#planUserRefreshRows").val();
	$("#planUserQueryForm input[name='rows']").val(rows ? rows : 10);
	var pageName=getPageName();
	
	var urlPath='planUser/search';
	if(pageName=='courseConfirm'){
		urlPath='planUser/searchByCurrentUserId';
	}else	if(pageName=='coursePlanByTeacher'){
		urlPath='planUser/searchByAllPlanDetail';
	}else
	{
		urlPath='planUser/search';
	}
	apiClient({
		url: urlPath,
		data: $("#planUserQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#planUserTable input[type=checkbox]').prop('checked', false);
				planUserListModel.grid = data;
				$("#planUserTableBlock").show();
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
 * 加载明细数据
 */
function loadPlanUserItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'planUser/searchByPeriodId',
			data: {id:id},
			success: function(data){
				if(data.code == 0 && data.model){
					planUserItemModel.model = data.model;
					$('#planUserEditForm input[type=checkbox]').prop('checked', false);
					$("div[name='edit']").hide();
					$("div[name='readOnly']").hide();
					if(data.model.completeStatus == '1'){
						$("div[name='readOnly']").show();
					} else {
						$("div[name='edit']").show();
					}
					$("#planUserEditBlock").show();
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
		loadPlanUserItem();
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

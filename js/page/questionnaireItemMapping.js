
$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#questionnaireItemMappingQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#questionnaireItemMappingAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#questionnaireItemMappingAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#questionnaireItemMappingAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#questionnaireItemMappingAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#questionnaireItemMappingCancelButton').click(function(){
		$('#questionnaireItemMappingAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#questionnaireItemMappingQueryForm button[type="button"][name=questionnaireItemMappingQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#questionnaireItemMappingQueryForm button[type="button"][name=questionnaireItemMappingExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#questionnaireItemMappingQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'questionnaireItemMapping/export/all',
					data: $("#questionnaireItemMappingQueryForm").serialize(),
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
				$('#questionnaireItemMappingQueryForm input[name=async]').val(1);
				$("#questionnaireItemMappingAlert").hide();
				apiClient({
					url: 'questionnaireItemMapping/export/all',
					data: $("#questionnaireItemMappingQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireItemMappingAlert").show();
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
	$('#questionnaireItemMappingAddButton').click(function(){
		var valid = true;
		
		// 问卷id
		var questionnaireItemMappingQuestionnaireIdNode = $("#questionnaireItemMappingAddForm input[name=questionnaire_id]");
		if(questionnaireItemMappingQuestionnaireIdNode && questionnaireItemMappingQuestionnaireIdNode.length && (!$.trim(questionnaireItemMappingQuestionnaireIdNode.val()) || !validator.isNumeric($.trim(questionnaireItemMappingQuestionnaireIdNode.val())))){
			questionnaireItemMappingQuestionnaireIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireItemMappingQuestionnaireIdNode);
			valid = false;
		}
		// 评价项id
		var questionnaireItemMappingItemIdNode = $("#questionnaireItemMappingAddForm input[name=item_id]");
		if(questionnaireItemMappingItemIdNode && questionnaireItemMappingItemIdNode.length && (!$.trim(questionnaireItemMappingItemIdNode.val()) || !validator.isNumeric($.trim(questionnaireItemMappingItemIdNode.val())))){
			questionnaireItemMappingItemIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireItemMappingItemIdNode);
			valid = false;
		}
		// 评分
		var questionnaireItemMappingScoreNode = $("#questionnaireItemMappingAddForm input[name=score]");
		if(questionnaireItemMappingScoreNode && questionnaireItemMappingScoreNode.length && (!$.trim(questionnaireItemMappingScoreNode.val()) || !validator.isNumeric($.trim(questionnaireItemMappingScoreNode.val())))){
			questionnaireItemMappingScoreNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireItemMappingScoreNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'questionnaireItemMapping/add',
			method: 'post',
			data: $("#questionnaireItemMappingAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#questionnaireItemMappingQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#questionnaireItemMappingAddForm button[type=reset]').click();
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
	
	// 导入文件
	$("#questionnaireItemMappingImportExcel").click(function(){
		$("#questionnaireItemMappingExcelFile").val('');
		$("#questionnaireItemMappingExcelFile").click();
	});
	// 同步导入
	$("#questionnaireItemMappingUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireItemMapping/import',
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
	$("#questionnaireItemMappingExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#questionnaireItemMappingUploadForm").submit();
	});

/*
	// 异步导入
	$("#questionnaireItemMappingUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireItemMapping/import',
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
				$("#questionnaireItemMappingAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#questionnaireItemMappingExcelFile").change(function(){
		$("#questionnaireItemMappingAlert").hide();
		$('#questionnaireItemMappingUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#questionnaireItemMappingUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#questionnaireItemMappingAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	questionnaireItemMappingListModel = new Vue({
		el: '#questionnaireItemMappingTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#questionnaireItemMappingCheckAll").prop('checked', true);
				}else{
					$("#questionnaireItemMappingCheckAll").prop('checked', false);
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
				var jumpNode = $('#questionnaireItemMappingJumpNo');
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
					url: 'questionnaireItemMapping/export/query',
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
				$("#questionnaireItemMappingAlert").hide();
				apiClient({
					url: 'questionnaireItemMapping/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireItemMappingAlert").show();
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
							url: 'questionnaireItemMapping/export/all',
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
						$("#questionnaireItemMappingAlert").hide();
						apiClient({
							url: 'questionnaireItemMapping/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#questionnaireItemMappingAlert").show();
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
	questionnaireItemMappingItemModel = new Vue({
		el: '#questionnaireItemMappingEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#questionnaireItemMappingEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 问卷id
				var questionnaireItemMappingQuestionnaireIdNode = $("#questionnaireItemMappingEditForm input[name=questionnaire_id]");
				if(questionnaireItemMappingQuestionnaireIdNode && questionnaireItemMappingQuestionnaireIdNode.length && (!$.trim(questionnaireItemMappingQuestionnaireIdNode.val()) || !validator.isNumeric($.trim(questionnaireItemMappingQuestionnaireIdNode.val())))){
					questionnaireItemMappingQuestionnaireIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireItemMappingQuestionnaireIdNode);
					valid = false;
				}
				// 评价项id
				var questionnaireItemMappingItemIdNode = $("#questionnaireItemMappingEditForm input[name=item_id]");
				if(questionnaireItemMappingItemIdNode && questionnaireItemMappingItemIdNode.length && (!$.trim(questionnaireItemMappingItemIdNode.val()) || !validator.isNumeric($.trim(questionnaireItemMappingItemIdNode.val())))){
					questionnaireItemMappingItemIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireItemMappingItemIdNode);
					valid = false;
				}
				// 评分
				var questionnaireItemMappingScoreNode = $("#questionnaireItemMappingEditForm input[name=score]");
				if(questionnaireItemMappingScoreNode && questionnaireItemMappingScoreNode.length && (!$.trim(questionnaireItemMappingScoreNode.val()) || !validator.isNumeric($.trim(questionnaireItemMappingScoreNode.val())))){
					questionnaireItemMappingScoreNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireItemMappingScoreNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'questionnaireItemMapping/edit',
					method: 'post',
					data: $("#questionnaireItemMappingEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#questionnaireItemMappingEditForm button[type=reset]').click();
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
			$("#questionnaireItemMappingEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#questionnaireItemMappingEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#questionnaireItemMappingEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#questionnaireItemMappingEditForm input[ctl-type=decimal]").blur(function(){
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

var questionnaireItemMappingListModel, questionnaireItemMappingItemModel;

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
	$("#questionnaireItemMappingQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#questionnaireItemMappingRefreshRows").val();
	$("#questionnaireItemMappingQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'questionnaireItemMapping/search',
		data: $("#questionnaireItemMappingQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#questionnaireItemMappingTable input[type=checkbox]').prop('checked', false);
				questionnaireItemMappingListModel.grid = data;
				$("#questionnaireItemMappingTableBlock").show();
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
					url: 'questionnaireItemMapping/delete?id=' + ids.join(','),
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
function loadQuestionnaireItemMappingItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'questionnaireItemMapping/edit',
			data: {id:id},
			success: function(data){
				$("#questionnaireItemMappingEditBlock").show();
				if(data.code == 0 && data.model){
					questionnaireItemMappingItemModel.model = data.model;
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
			
		}else if(action == 'edit'){
			loadQuestionnaireItemMappingItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

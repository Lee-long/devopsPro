
$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#questionnaireRecordQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#questionnaireRecordAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#questionnaireRecordAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#questionnaireRecordAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#questionnaireRecordAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#questionnaireRecordCancelButton').click(function(){
		$('#questionnaireRecordAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#questionnaireRecordQueryForm button[type="button"][name=questionnaireRecordQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#questionnaireRecordQueryForm button[type="button"][name=questionnaireRecordExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#questionnaireRecordQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'questionnaireRecord/export/all',
					data: $("#questionnaireRecordQueryForm").serialize(),
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
				$('#questionnaireRecordQueryForm input[name=async]').val(1);
				$("#questionnaireRecordAlert").hide();
				apiClient({
					url: 'questionnaireRecord/export/all',
					data: $("#questionnaireRecordQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireRecordAlert").show();
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
	$('#questionnaireRecordAddButton').click(function(){
		var valid = true;
		
		// 考生id
		var questionnaireRecordUserIdNode = $("#questionnaireRecordAddForm input[name=user_id]");
		if(questionnaireRecordUserIdNode && questionnaireRecordUserIdNode.length && (!$.trim(questionnaireRecordUserIdNode.val()) || !validator.isNumeric($.trim(questionnaireRecordUserIdNode.val())))){
			questionnaireRecordUserIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireRecordUserIdNode);
			valid = false;
		}
		// 问卷id
		var questionnaireRecordTemplateIdNode = $("#questionnaireRecordAddForm input[name=template_id]");
		if(questionnaireRecordTemplateIdNode && questionnaireRecordTemplateIdNode.length && (!$.trim(questionnaireRecordTemplateIdNode.val()) || !validator.isNumeric($.trim(questionnaireRecordTemplateIdNode.val())))){
			questionnaireRecordTemplateIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireRecordTemplateIdNode);
			valid = false;
		}
		// 1-课程问卷2-讲师问卷
		var questionnaireRecordTypeNode = $("#questionnaireRecordAddForm input[name=type]");
		if(questionnaireRecordTypeNode && questionnaireRecordTypeNode.length && (!$.trim(questionnaireRecordTypeNode.val()) || !validator.isNumeric($.trim(questionnaireRecordTypeNode.val())))){
			questionnaireRecordTypeNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireRecordTypeNode);
			valid = false;
		}
		// 内容契合主题/声音洪亮、表达清楚
		var questionnaireRecordScore1Node = $("#questionnaireRecordAddForm input[name=score1]");
		if(questionnaireRecordScore1Node && questionnaireRecordScore1Node.length && (!$.trim(questionnaireRecordScore1Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore1Node.val())))){
			questionnaireRecordScore1Node.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireRecordScore1Node);
			valid = false;
		}
		// 更新及时不陈旧/易于理解、深入浅出
		var questionnaireRecordScore2Node = $("#questionnaireRecordAddForm input[name=score2]");
		if(questionnaireRecordScore2Node && questionnaireRecordScore2Node.length && (!$.trim(questionnaireRecordScore2Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore2Node.val())))){
			questionnaireRecordScore2Node.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireRecordScore2Node);
			valid = false;
		}
		// 切合实际不空泛/态度认真、讲解细致
		var questionnaireRecordScore3Node = $("#questionnaireRecordAddForm input[name=score3]");
		if(questionnaireRecordScore3Node && questionnaireRecordScore3Node.length && (!$.trim(questionnaireRecordScore3Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore3Node.val())))){
			questionnaireRecordScore3Node.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireRecordScore3Node);
			valid = false;
		}
		// 案例丰富/答疑耐心、鞭辟入里
		var questionnaireRecordScore4Node = $("#questionnaireRecordAddForm input[name=score4]");
		if(questionnaireRecordScore4Node && questionnaireRecordScore4Node.length && (!$.trim(questionnaireRecordScore4Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore4Node.val())))){
			questionnaireRecordScore4Node.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireRecordScore4Node);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'questionnaireRecord/add',
			method: 'post',
			data: $("#questionnaireRecordAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#questionnaireRecordQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#questionnaireRecordAddForm button[type=reset]').click();
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
	$("#questionnaireRecordImportExcel").click(function(){
		$("#questionnaireRecordExcelFile").val('');
		$("#questionnaireRecordExcelFile").click();
	});
	// 同步导入
	$("#questionnaireRecordUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireRecord/import',
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
	$("#questionnaireRecordExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#questionnaireRecordUploadForm").submit();
	});

/*
	// 异步导入
	$("#questionnaireRecordUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireRecord/import',
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
				$("#questionnaireRecordAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#questionnaireRecordExcelFile").change(function(){
		$("#questionnaireRecordAlert").hide();
		$('#questionnaireRecordUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#questionnaireRecordUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#questionnaireRecordAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	questionnaireRecordListModel = new Vue({
		el: '#questionnaireRecordTableBlock',
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
					$("#questionnaireRecordCheckAll").prop('checked', true);
				}else{
					$("#questionnaireRecordCheckAll").prop('checked', false);
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
				var jumpNode = $('#questionnaireRecordJumpNo');
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
					url: 'questionnaireRecord/export/query',
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
				$("#questionnaireRecordAlert").hide();
				apiClient({
					url: 'questionnaireRecord/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireRecordAlert").show();
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
							url: 'questionnaireRecord/export/all',
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
						$("#questionnaireRecordAlert").hide();
						apiClient({
							url: 'questionnaireRecord/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#questionnaireRecordAlert").show();
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
	questionnaireRecordItemModel = new Vue({
		el: '#questionnaireRecordEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#questionnaireRecordEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 考生id
				var questionnaireRecordUserIdNode = $("#questionnaireRecordEditForm input[name=user_id]");
				if(questionnaireRecordUserIdNode && questionnaireRecordUserIdNode.length && (!$.trim(questionnaireRecordUserIdNode.val()) || !validator.isNumeric($.trim(questionnaireRecordUserIdNode.val())))){
					questionnaireRecordUserIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireRecordUserIdNode);
					valid = false;
				}
				// 问卷id
				var questionnaireRecordTemplateIdNode = $("#questionnaireRecordEditForm input[name=template_id]");
				if(questionnaireRecordTemplateIdNode && questionnaireRecordTemplateIdNode.length && (!$.trim(questionnaireRecordTemplateIdNode.val()) || !validator.isNumeric($.trim(questionnaireRecordTemplateIdNode.val())))){
					questionnaireRecordTemplateIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireRecordTemplateIdNode);
					valid = false;
				}
				// 1-课程问卷2-讲师问卷
				var questionnaireRecordTypeNode = $("#questionnaireRecordEditForm input[name=type]");
				if(questionnaireRecordTypeNode && questionnaireRecordTypeNode.length && (!$.trim(questionnaireRecordTypeNode.val()) || !validator.isNumeric($.trim(questionnaireRecordTypeNode.val())))){
					questionnaireRecordTypeNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireRecordTypeNode);
					valid = false;
				}
				// 内容契合主题/声音洪亮、表达清楚
				var questionnaireRecordScore1Node = $("#questionnaireRecordEditForm input[name=score1]");
				if(questionnaireRecordScore1Node && questionnaireRecordScore1Node.length && (!$.trim(questionnaireRecordScore1Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore1Node.val())))){
					questionnaireRecordScore1Node.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireRecordScore1Node);
					valid = false;
				}
				// 更新及时不陈旧/易于理解、深入浅出
				var questionnaireRecordScore2Node = $("#questionnaireRecordEditForm input[name=score2]");
				if(questionnaireRecordScore2Node && questionnaireRecordScore2Node.length && (!$.trim(questionnaireRecordScore2Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore2Node.val())))){
					questionnaireRecordScore2Node.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireRecordScore2Node);
					valid = false;
				}
				// 切合实际不空泛/态度认真、讲解细致
				var questionnaireRecordScore3Node = $("#questionnaireRecordEditForm input[name=score3]");
				if(questionnaireRecordScore3Node && questionnaireRecordScore3Node.length && (!$.trim(questionnaireRecordScore3Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore3Node.val())))){
					questionnaireRecordScore3Node.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireRecordScore3Node);
					valid = false;
				}
				// 案例丰富/答疑耐心、鞭辟入里
				var questionnaireRecordScore4Node = $("#questionnaireRecordEditForm input[name=score4]");
				if(questionnaireRecordScore4Node && questionnaireRecordScore4Node.length && (!$.trim(questionnaireRecordScore4Node.val()) || !validator.isNumeric($.trim(questionnaireRecordScore4Node.val())))){
					questionnaireRecordScore4Node.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireRecordScore4Node);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'questionnaireRecord/edit',
					method: 'post',
					data: $("#questionnaireRecordEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#questionnaireRecordEditForm button[type=reset]').click();
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
			$("#questionnaireRecordEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#questionnaireRecordEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#questionnaireRecordEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#questionnaireRecordEditForm input[ctl-type=decimal]").blur(function(){
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

var questionnaireRecordListModel, questionnaireRecordItemModel;

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
	$("#questionnaireRecordQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#questionnaireRecordRefreshRows").val();
	$("#questionnaireRecordQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'questionnaireRecord/search',
		data: $("#questionnaireRecordQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#questionnaireRecordTable input[type=checkbox]').prop('checked', false);
				questionnaireRecordListModel.grid = data;
				$("#questionnaireRecordTableBlock").show();
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
					url: 'questionnaireRecord/delete?id=' + ids.join(','),
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
function loadQuestionnaireRecordItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'questionnaireRecord/edit',
			data: {id:id},
			success: function(data){
				$("#questionnaireRecordEditBlock").show();
				if(data.code == 0 && data.model){
					questionnaireRecordItemModel.model = data.model;
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
			loadQuestionnaireRecordItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

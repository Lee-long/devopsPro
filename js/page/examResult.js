
$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#examResultQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#examResultAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#examResultAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#examResultAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#examResultAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#examResultCancelButton').click(function(){
		$('#examResultAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#examResultQueryForm button[type="button"][name=examResultQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#examResultQueryForm button[type="button"][name=examResultExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#examResultQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'examResult/export/all',
					data: $("#examResultQueryForm").serialize(),
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
				$('#examResultQueryForm input[name=async]').val(1);
				$("#examResultAlert").hide();
				apiClient({
					url: 'examResult/export/all',
					data: $("#examResultQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#examResultAlert").show();
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
	$('#examResultAddButton').click(function(){
		var valid = true;
		
		// 分类
		var examResultTypeNode = $("#examResultAddForm input[name=type]");
		if(examResultTypeNode && examResultTypeNode.length && (!$.trim(examResultTypeNode.val()) || !validator.isNumeric($.trim(examResultTypeNode.val())))){
			examResultTypeNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examResultTypeNode);
			valid = false;
		}
		// 考试试卷ID(type=1时存值)
		var examResultExamPaperIdNode = $("#examResultAddForm input[name=exam_paper_id]");
		if(examResultExamPaperIdNode && examResultExamPaperIdNode.length && (!$.trim(examResultExamPaperIdNode.val()) || !validator.isNumeric($.trim(examResultExamPaperIdNode.val())))){
			examResultExamPaperIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examResultExamPaperIdNode);
			valid = false;
		}
		// 考生ID
		var examResultUserIdNode = $("#examResultAddForm input[name=user_id]");
		if(examResultUserIdNode && examResultUserIdNode.length && (!$.trim(examResultUserIdNode.val()) || !validator.isNumeric($.trim(examResultUserIdNode.val())))){
			examResultUserIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examResultUserIdNode);
			valid = false;
		}
		// 问题ID
		var examResultQuestionIdNode = $("#examResultAddForm input[name=question_id]");
		if(examResultQuestionIdNode && examResultQuestionIdNode.length && (!$.trim(examResultQuestionIdNode.val()) || !validator.isNumeric($.trim(examResultQuestionIdNode.val())))){
			examResultQuestionIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examResultQuestionIdNode);
			valid = false;
		}
		// 考生答案
		var examResultUserAnswerIdNode = $("#examResultAddForm input[name=user_answer_id]");
		if(examResultUserAnswerIdNode && examResultUserAnswerIdNode.length && (!$.trim(examResultUserAnswerIdNode.val()) || !validator.isNumeric($.trim(examResultUserAnswerIdNode.val())))){
			examResultUserAnswerIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examResultUserAnswerIdNode);
			valid = false;
		}
		// 判卷结果
		var examResultJudgeResultNode = $("#examResultAddForm input[name=judge_result]");
		if(examResultJudgeResultNode && examResultJudgeResultNode.length && (!$.trim(examResultJudgeResultNode.val()) || !validator.isNumeric($.trim(examResultJudgeResultNode.val())))){
			examResultJudgeResultNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examResultJudgeResultNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'examResult/add',
			method: 'post',
			data: $("#examResultAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#examResultQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#examResultAddForm button[type=reset]').click();
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
	$("#examResultImportExcel").click(function(){
		$("#examResultExcelFile").val('');
		$("#examResultExcelFile").click();
	});
	// 同步导入
	$("#examResultUploadForm").ajaxForm({
		url: _baseUrl + 'examResult/import',
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
	$("#examResultExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#examResultUploadForm").submit();
	});

/*
	// 异步导入
	$("#examResultUploadForm").ajaxForm({
		url: _baseUrl + 'examResult/import',
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
				$("#examResultAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#examResultExcelFile").change(function(){
		$("#examResultAlert").hide();
		$('#examResultUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#examResultUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#examResultAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	examResultListModel = new Vue({
		el: '#examResultTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatType: function(value){
				var text = value;
				if(value == 1){
					text = '考试';
				}else if(value == 2){
					text = '练习';
				}
				return text;
			},
			formatJudgeResult: function(value){
				var text = value;
				if(value == 1){
					text = '正确';
				}else if(value == 0){
					text = '错误';
				}
				return text;
			},
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#examResultCheckAll").prop('checked', true);
				}else{
					$("#examResultCheckAll").prop('checked', false);
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
				var jumpNode = $('#examResultJumpNo');
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
					url: 'examResult/export/query',
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
				$("#examResultAlert").hide();
				apiClient({
					url: 'examResult/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#examResultAlert").show();
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
							url: 'examResult/export/all',
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
						$("#examResultAlert").hide();
						apiClient({
							url: 'examResult/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#examResultAlert").show();
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
	examResultItemModel = new Vue({
		el: '#examResultEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#examResultEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 分类
				var examResultTypeNode = $("#examResultEditForm input[name=type]");
				if(examResultTypeNode && examResultTypeNode.length && (!$.trim(examResultTypeNode.val()) || !validator.isNumeric($.trim(examResultTypeNode.val())))){
					examResultTypeNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examResultTypeNode);
					valid = false;
				}
				// 考试试卷ID(type=1时存值)
				var examResultExamPaperIdNode = $("#examResultEditForm input[name=exam_paper_id]");
				if(examResultExamPaperIdNode && examResultExamPaperIdNode.length && (!$.trim(examResultExamPaperIdNode.val()) || !validator.isNumeric($.trim(examResultExamPaperIdNode.val())))){
					examResultExamPaperIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examResultExamPaperIdNode);
					valid = false;
				}
				// 考生ID
				var examResultUserIdNode = $("#examResultEditForm input[name=user_id]");
				if(examResultUserIdNode && examResultUserIdNode.length && (!$.trim(examResultUserIdNode.val()) || !validator.isNumeric($.trim(examResultUserIdNode.val())))){
					examResultUserIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examResultUserIdNode);
					valid = false;
				}
				// 问题ID
				var examResultQuestionIdNode = $("#examResultEditForm input[name=question_id]");
				if(examResultQuestionIdNode && examResultQuestionIdNode.length && (!$.trim(examResultQuestionIdNode.val()) || !validator.isNumeric($.trim(examResultQuestionIdNode.val())))){
					examResultQuestionIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examResultQuestionIdNode);
					valid = false;
				}
				// 考生答案
				var examResultUserAnswerIdNode = $("#examResultEditForm input[name=user_answer_id]");
				if(examResultUserAnswerIdNode && examResultUserAnswerIdNode.length && (!$.trim(examResultUserAnswerIdNode.val()) || !validator.isNumeric($.trim(examResultUserAnswerIdNode.val())))){
					examResultUserAnswerIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examResultUserAnswerIdNode);
					valid = false;
				}
				// 判卷结果
				var examResultJudgeResultNode = $("#examResultEditForm input[name=judge_result]");
				if(examResultJudgeResultNode && examResultJudgeResultNode.length && (!$.trim(examResultJudgeResultNode.val()) || !validator.isNumeric($.trim(examResultJudgeResultNode.val())))){
					examResultJudgeResultNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examResultJudgeResultNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'examResult/edit',
					method: 'post',
					data: $("#examResultEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#examResultEditForm button[type=reset]').click();
							doQuery();
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
			$("#examResultEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#examResultEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#examResultEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#examResultEditForm input[ctl-type=decimal]").blur(function(){
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

var examResultListModel, examResultItemModel;

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
	$("#examResultQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#examResultRefreshRows").val();
	$("#examResultQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'examResult/search',
		data: $("#examResultQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#examResultTable input[type=checkbox]').prop('checked', false);
				examResultListModel.grid = data;
				$("#examResultTableBlock").show();
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
					url: 'examResult/delete?id=' + ids.join(','),
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
function loadExamResultItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'examResult/edit',
			data: {id:id},
			success: function(data){
				$("#examResultEditBlock").show();
				if(data.code == 0 && data.model){
					examResultItemModel.model = data.model;
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
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			
		}else if(action == 'edit'){
			loadExamResultItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

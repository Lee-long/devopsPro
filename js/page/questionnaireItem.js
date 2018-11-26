
$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#questionnaireItemQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#questionnaireItemAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#questionnaireItemAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#questionnaireItemAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#questionnaireItemAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#questionnaireItemCancelButton').click(function(){
		$('#questionnaireItemAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#questionnaireItemQueryForm button[type="button"][name=questionnaireItemQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#questionnaireItemQueryForm button[type="button"][name=questionnaireItemExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#questionnaireItemQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'questionnaireItem/export/all',
					data: $("#questionnaireItemQueryForm").serialize(),
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
				$('#questionnaireItemQueryForm input[name=async]').val(1);
				$("#questionnaireItemAlert").hide();
				apiClient({
					url: 'questionnaireItem/export/all',
					data: $("#questionnaireItemQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireItemAlert").show();
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
	$('#questionnaireItemAddButton').click(function(){
		var valid = true;
		
		// 评价项名称
		var questionnaireItemNameNode = $("#questionnaireItemAddForm input[name=name]");
		if(questionnaireItemNameNode && questionnaireItemNameNode.length && !$.trim(questionnaireItemNameNode.val())){
			showToolTip(questionnaireItemNameNode);
			valid = false;
		}
		// 1-课件评价2-教员评价
		var questionnaireItemTypeNode = $("#questionnaireItemAddForm input[name=type]");
		if(questionnaireItemTypeNode && questionnaireItemTypeNode.length && (!$.trim(questionnaireItemTypeNode.val()) || !validator.isNumeric($.trim(questionnaireItemTypeNode.val())))){
			questionnaireItemTypeNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireItemTypeNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'questionnaireItem/add',
			method: 'post',
			data: $("#questionnaireItemAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#questionnaireItemQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#questionnaireItemAddForm button[type=reset]').click();
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
	$("#questionnaireItemImportExcel").click(function(){
		$("#questionnaireItemExcelFile").val('');
		$("#questionnaireItemExcelFile").click();
	});
	// 同步导入
	$("#questionnaireItemUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireItem/import',
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
	$("#questionnaireItemExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#questionnaireItemUploadForm").submit();
	});

/*
	// 异步导入
	$("#questionnaireItemUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireItem/import',
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
				$("#questionnaireItemAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#questionnaireItemExcelFile").change(function(){
		$("#questionnaireItemAlert").hide();
		$('#questionnaireItemUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#questionnaireItemUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#questionnaireItemAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	questionnaireItemListModel = new Vue({
		el: '#questionnaireItemTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			formatType: function(value){
                var text = value;
                if(value == 1){
                    text = '课件评价';
                }else if(value == 2){
                    text = '教员评价';
                }
                return text;
            },
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#questionnaireItemCheckAll").prop('checked', true);
				}else{
					$("#questionnaireItemCheckAll").prop('checked', false);
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
				var jumpNode = $('#questionnaireItemJumpNo');
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
					url: 'questionnaireItem/export/query',
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
				$("#questionnaireItemAlert").hide();
				apiClient({
					url: 'questionnaireItem/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireItemAlert").show();
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
							url: 'questionnaireItem/export/all',
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
						$("#questionnaireItemAlert").hide();
						apiClient({
							url: 'questionnaireItem/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#questionnaireItemAlert").show();
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
	questionnaireItemItemModel = new Vue({
		el: '#questionnaireItemEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#questionnaireItemEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 评价项名称
				var questionnaireItemNameNode = $("#questionnaireItemEditForm input[name=name]");
				if(questionnaireItemNameNode && questionnaireItemNameNode.length && !$.trim(questionnaireItemNameNode.val())){
					showToolTip(questionnaireItemNameNode);
					valid = false;
				}
				// 1-课件评价2-教员评价
				var questionnaireItemTypeNode = $("#questionnaireItemEditForm input[name=type]");
				if(questionnaireItemTypeNode && questionnaireItemTypeNode.length && (!$.trim(questionnaireItemTypeNode.val()) || !validator.isNumeric($.trim(questionnaireItemTypeNode.val())))){
					questionnaireItemTypeNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireItemTypeNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'questionnaireItem/edit',
					method: 'post',
					data: $("#questionnaireItemEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#questionnaireItemEditForm button[type=reset]').click();
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
			$("#questionnaireItemEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#questionnaireItemEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#questionnaireItemEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#questionnaireItemEditForm input[ctl-type=decimal]").blur(function(){
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

var questionnaireItemListModel, questionnaireItemItemModel;

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
	$("#questionnaireItemQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#questionnaireItemRefreshRows").val();
	$("#questionnaireItemQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'questionnaireItem/search',
		data: $("#questionnaireItemQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#questionnaireItemTable input[type=checkbox]').prop('checked', false);
				questionnaireItemListModel.grid = data;
				$("#questionnaireItemTableBlock").show();
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
					url: 'questionnaireItem/delete?id=' + ids.join(','),
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
function loadQuestionnaireItemItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'questionnaireItem/edit',
			data: {id:id},
			success: function(data){
				$("#questionnaireItemEditBlock").show();
				if(data.code == 0 && data.model){
					questionnaireItemItemModel.model = data.model;
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
			loadQuestionnaireItemItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
 		var page = $("#questionnaireItemQueryForm input[name=page]").val();
		doQuery(page);
	}
}

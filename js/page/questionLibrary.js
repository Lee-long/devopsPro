
//@ sourceURL=questionLibrary.js
$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#questionLibraryQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#questionLibraryAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#questionLibraryAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#questionLibraryAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#questionLibraryAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#questionLibraryCancelButton').click(function(){
		$('#questionLibraryAddForm button[type=reset]').click();
		var page = $("#questionLibraryQueryForm input[name=page]").val();
		window.location.href = '#' + pageName+"?page="+page;
	});
	
	// 查询按钮
	$('#questionLibraryQueryForm button[type="button"][name=questionLibraryQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#questionLibraryQueryForm button[type="button"][name=questionLibraryExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#questionLibraryQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'questionLibrary/export/all',
					data: $("#questionLibraryQueryForm").serialize(),
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
				$('#questionLibraryQueryForm input[name=async]').val(1);
				$("#questionLibraryAlert").hide();
				apiClient({
					url: 'questionLibrary/export/all',
					data: $("#questionLibraryQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionLibraryAlert").show();
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
	$('#questionLibraryAddButton').click(function(){
		var valid = true; 
		// 题库名称
		var questionLibraryNameNode = $("#questionLibraryAddForm input[name=name]");
		if(questionLibraryNameNode && questionLibraryNameNode.length && !$.trim(questionLibraryNameNode.val())){
			showToolTip(questionLibraryNameNode);
			valid = false;
		} 
		// 描述
		var questionLibraryDescriptionNode = $("#questionLibraryAddForm input[name=description]");
		if(questionLibraryDescriptionNode && questionLibraryDescriptionNode.length && !$.trim(questionLibraryDescriptionNode.val())){
			showToolTip(questionLibraryDescriptionNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'questionLibrary/add',
			method: 'post',
			data: $("#questionLibraryAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#questionLibraryQueryForm button[type=reset]").click();
					var page = Utils.parseUrlParam(window.location.href, 'page'); 
					window.location.href = '#' + pageName+"?page="+page;
					$('#questionLibraryAddForm button[type=reset]').click();
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
	$("#questionLibraryImportExcel").click(function(){
		$("#questionLibraryExcelFile").val('');
		$("#questionLibraryExcelFile").click();
	});
	// 同步导入
	$("#questionLibraryUploadForm").ajaxForm({
		url: _baseUrl + 'questionLibrary/import',
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
	$("#questionLibraryExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#questionLibraryUploadForm").submit();
	});

/*
	// 异步导入
	$("#questionLibraryUploadForm").ajaxForm({
		url: _baseUrl + 'questionLibrary/import',
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
				$("#questionLibraryAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#questionLibraryExcelFile").change(function(){
		$("#questionLibraryAlert").hide();
		$('#questionLibraryUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#questionLibraryUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#questionLibraryAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	questionLibraryListModel = new Vue({
		el: '#questionLibraryTableBlock',
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
					$("#questionLibraryCheckAll").prop('checked', true);
				}else{
					$("#questionLibraryCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				var page = $("#questionLibraryQueryForm input[name=page]").val();
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk')+"&page="+page;
			},
			deleteRow: function(e){
				doDelete([$(e.target).attr('pk')]);
			},
			libManage:function(e){
				var name = $("#questionLibraryQueryForm input[name=name]").val();
				var page = $("#questionLibraryQueryForm input[name=page]").val();
				window.location.href = "#question?library_id=" + $(e.target).attr('pk')+"&name="+name+"&page="+page;
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
				var jumpNode = $('#questionLibraryJumpNo');
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
					url: 'questionLibrary/export/query',
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
				$("#questionLibraryAlert").hide();
				apiClient({
					url: 'questionLibrary/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionLibraryAlert").show();
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
							url: 'questionLibrary/export/all',
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
						$("#questionLibraryAlert").hide();
						apiClient({
							url: 'questionLibrary/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#questionLibraryAlert").show();
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
	questionLibraryItemModel = new Vue({
		el: '#questionLibraryEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				$("#questionLibraryEditForm button[type=reset]").click();
				var page = $("#questionLibraryQueryForm input[name=page]").val();
				window.location.href = '#' + pageName+"?page="+page;
			},
			doSubmit: function(e){
				var valid = true;
				
				// 题库名称
				var questionLibraryNameNode = $("#questionLibraryEditForm input[name=name]");
				if(questionLibraryNameNode && questionLibraryNameNode.length && !$.trim(questionLibraryNameNode.val())){
					showToolTip(questionLibraryNameNode);
					valid = false;
				}else{
				    if(libraryName!=questionLibraryNameNode.val()){

				        apiClient({
                             url: 'common/repository/questionLibrary/find',
                             data: {delete_status:1,name:questionLibraryNameNode.val()},
                             async:false,
                             success: function(data){
                                 if(data.model.length>0){
                                     alert("题库名称已存在!")
                                     valid = false;
                                 }

                             }
                         });
				    }

                }

				// 描述
				var questionLibraryDescriptionNode = $("#questionLibraryEditForm input[name=description]");
				if(questionLibraryDescriptionNode && questionLibraryDescriptionNode.length && !$.trim(questionLibraryDescriptionNode.val())){
					showToolTip(questionLibraryDescriptionNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'questionLibrary/edit',
					method: 'post',
					data: $("#questionLibraryEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							var page = Utils.parseUrlParam(window.location.href, 'page'); 
							window.location.href = '#' + pageName+"?page="+page;
							$('#questionLibraryEditForm button[type=reset]').click();
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
			$("#questionLibraryEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#questionLibraryEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#questionLibraryEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#questionLibraryEditForm input[ctl-type=decimal]").blur(function(){
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

var questionLibraryListModel, questionLibraryItemModel;

function goAdd(){
	var pageName = getPageName();
	var page = $("#questionLibraryQueryForm input[name=page]").val();
	window.location.href = '#' + pageName + '?action=add&page='+page;
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
	$("#questionLibraryQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#questionLibraryRefreshRows").val();
	$("#questionLibraryQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'questionLibrary/search',
		data: $("#questionLibraryQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#questionLibraryTable input[type=checkbox]').prop('checked', false);
				questionLibraryListModel.grid = data;
				$("#questionLibraryTableBlock").show();
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
			    $.each(ids,function(index,el){
			        apiClient({
                        url: 'common/repository/question/find',
                        data: {library_id:el},
                        success: function(data){
                            if(data.code == 0){
                                // 查询下拉框
                                if(data.model.length>0){
                                    alert("题库中存在试题，不能删除！");
                                }else{
                                    apiClient({
                                        url: 'questionLibrary/delete?id=' + el,
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
                            }
                        }
                    });
			    })

				//showLoading('正在删除...');

			}
		});	
	}
}
var libraryName;
/**
 * 加载明细数据
 */
function loadQuestionLibraryItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'questionLibrary/edit',
			data: {id:id},
			success: function(data){
				$("#questionLibraryEditBlock").show();
				if(data.code == 0 && data.model){
					questionLibraryItemModel.model = data.model;
					libraryName = data.model.name;
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
 * 加载明细数据
 */
function addQuestionLibraryItem(){
	showLoading('正在加载...');  
	apiClient({
		url: 'questionLibrary/addCondition',
		type: 'get',
		success: function(data){
			var courseOption = "";
			$("#questionLibraryAddForm select[name=course_name]").html(courseOption);
			for(var i=0;i<data.model.length;i++){ 
				if(data.model[i] && 	data.model[i].courseName){ 
					courseOption = courseOption+"<option value='"+data.model[i].courseName+"'>"+data.model[i].courseName+"</option>"; 
				}
				
			};
			$("#questionLibraryAddForm select[name=course_name]").append(courseOption);
		},
		complete: function(){
			$("div[action=add]").show();
			hideLoading();
		}
	}); 
}

/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var name = Utils.parseUrlParam(window.location.href, 'name');
	var page = Utils.parseUrlParam(window.location.href, 'page');

     	// 为安全起见，路由跳转后，再次隐藏查询图层
     	hideLoading();

     	if(action){
     		// 根据用户动作显示相应画面
     		$('div[action]').hide();
     		$('div[action="' + action + '"]').show();

     		if(action == 'add'){ 
     			addQuestionLibraryItem();
     		}else if(action == 'edit'){
     			loadQuestionLibraryItem();
     		}
     	}else{
     		$('div[action]').hide();
     		$('div[action="query"]').show(); 
     		$("#questionLibraryQueryForm input[name=name]").val(name); 
     		doQuery(page);
     	}
}


$(function(){
	var pageName = getPageName();

	coursewareAddModel = new Vue({
		el: '#coursewareAddBlock',
		data: {
			model: {},
		}
	});

	// 查询条件日期控件
	$("#coursewareQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});

	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	
	// 取消按钮
	$('#coursewareCancelButton').click(function(){
		$('#coursewareAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#coursewareQueryForm button[type="button"][name=coursewareQueryButton]').click(function(){
		doQuery();
	});
	
	// 导出按钮
	$('#coursewareQueryForm button[type="button"][name=coursewareExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#coursewareQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'courseware/export/all',
					data: $("#coursewareQueryForm").serialize(),
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
			}
		});
	});

	
	// 上传课件 
	$('#coursewareUploadButton').click(function(){
		$('#coursewareFileForm input').val('');
		$('#coursewareFileForm input').click();
	});

	$('#coursewareFileForm input').change(function(){
		coursewareFile = this.files[0];
		var action = Utils.parseUrlParam(window.location.href, 'action');
		if (action == 'add') {
			$("#coursewareAddForm input[name=showName]").val(coursewareFile.name);
		} else if (action == 'edit'){
			$("#coursewareEditForm input[name=showName]").val(coursewareFile.name);
			$("#coursewareEditForm input[name=fileChanged]").val(true);
		}
	});
	
	// 新增记录提交
	$('#coursewareAddButton').click(function(){
		var valid = true;

		// 课件名称
		var coursewareNameNode = $("#coursewareAddForm input[name=name]");
		if(coursewareNameNode && coursewareNameNode.length && !$.trim(coursewareNameNode.val())){
			showToolTip(coursewareNameNode);
			valid = false;
		}
		// 课件路径地址
		var coursewareFilePathNode = $("#coursewareAddForm input[name=showName]");
		if(coursewareFilePathNode && coursewareFilePathNode.length && !$.trim(coursewareFilePathNode.val())){
			showToolTip(coursewareFilePathNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		// 上传
		$("#coursewareFileForm").ajaxSubmit({
			url: _baseUrl + 'common/file/upload',
			dataType:'json',
			success: function(data, textStatus, jqXHR, form){
				if(data.code == 0){
					$("#coursewareAddForm input[name=filePath]").val(data.url);
					apiClient({
						url: 'courseware/add',
						method: 'post',
						data: $("#coursewareAddForm").serialize(),
						success: function(data){
							if(data.code == 0){
								hideLoading();
								$("#coursewareQueryForm button[type=reset]").click();
								window.location.href = '#' + pageName;
								$('#coursewareAddForm button[type=reset]').click();
							}else{
								hideLoading();
								alert(data.message);
							}
						},
						error: function(){
							hideLoading();
						}
					})
				}else{
					alert(data.message);
				}
			},
			error: function(){
				hideLoading();
			}
		});	
	});
	
	// 导入文件
	$("#coursewareImportExcel").click(function(){
		$("#coursewareExcelFile").val('');
		$("#coursewareExcelFile").click();
	});
	$("#coursewareExcelFile").change(function(){
		showLoading('正在导入...');
		$("#coursewareUploadForm").submit();
	});
	
	
	var taskHintModel = new Vue({
		el: '#coursewareAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	coursewareListModel = new Vue({
		el: '#coursewareTableBlock',
		data: {
			grid: {items:[]},
			orgList: [],
			pageName: pageName
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			showTips: function(e) {
				$(e.target).attr("title",$(e.target).text());
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#coursewareCheckAll").prop('checked', true);
				}else{
					$("#coursewareCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goDownload: function(e){
				doDownload($(e.target).attr('pk'));
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
				var jumpNode = $('#coursewareJumpNo');
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
					url: 'courseware/export/query',
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
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						// 同步导出
						showLoading('正在导出...');
						apiClient({
							url: 'courseware/export/all',
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
					}
				});	
			}
		},
		mounted: function(){
			// 这里添加列表初始化后的事件绑定代码
		}
	});
	
	coursewareQueryModel = new Vue({
		el: '#coursewareQueryForm',
		data: {
			orgList: []
		},
		methods: {
			doQuery: function(){
				doQuery();
			}
		}
	});
	
	// 编辑回显model
	coursewareItemModel = new Vue({
		el: '#coursewareEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doReference: function(e) {
				$('#coursewareFileForm input').val('');
				$('#coursewareFileForm input').click();
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#coursewareEditForm button[type=reset]").click();
			},
			doDownload: function(e) {
				doDownload($(e.target).attr('pk'));
			},
			doSubmit: function(e){
				var valid = true;

				// 课件名称
				var coursewareNameNode = $("#coursewareEditForm input[name=name]");
				if(coursewareNameNode && coursewareNameNode.length && !$.trim(coursewareNameNode.val())){
					showToolTip(coursewareNameNode);
					valid = false;
				}
				
				// 课件路径地址
				var coursewareFilePathNode = $("#coursewareEditForm input[name=showName]");
				if(coursewareFilePathNode && coursewareFilePathNode.length && !$.trim(coursewareFilePathNode.val())){
					showToolTip(coursewareFilePathNode);
					valid = false;
				}
				
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				if($("#coursewareEditForm input[name=fileChanged]").val() == 'true') {
					// 上传
					$("#coursewareFileForm").ajaxSubmit({
						url: _baseUrl + 'common/file/upload',
						dataType:'json',
						success: function(data, textStatus, jqXHR, form){
							if(data.code == 0){
								$("#coursewareEditForm input[name=filePath]").val(data.url)
								apiClient({
									url: 'courseware/edit',
									method: 'post',
									data: $("#coursewareEditForm").serialize(),
									success: function(data){
										if(data.code == 0){
											hideLoading();
											window.location.href = '#' + pageName;
											$('#coursewareEditForm button[type=reset]').click();
										}else{
											hideLoading();
											alert(data.message);
										}
									},
									complete: function(){
										hideLoading();
									}
								})
							}else{
								alert(data.message);
							}
						},
						complete: function() {
							$("#coursewareEditForm input[name=fileChanged]").val(false);
						}
					});	
				} else {
					apiClient({
						url: 'courseware/edit',
						method: 'post',
						data: $("#coursewareEditForm").serialize(),
						success: function(data){
							if(data.code == 0){
								hideLoading();
								window.location.href = '#' + pageName;
								$('#coursewareEditForm button[type=reset]').click();
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
				
				
			}
		},
		mounted: function(){
		}
	});

})

var coursewareListModel, coursewareItemModel,coursewareQueryModel;
var coursewareFile = null;

function goAdd(){
	var pageName = getPageName();
	window.location.href = '#' + pageName + '?action=add';
}

function doDownload(id) {
	showLoading('正在下载...');
	apiClient({
		url: 'courseware/download?id=' + id,
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
	})
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
	$("#coursewareQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#coursewareRefreshRows").val();
	$("#coursewareQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'courseware/search',
		data: $("#coursewareQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#coursewareTable input[type=checkbox]').prop('checked', false);
				coursewareListModel.grid = data;
				$("#coursewareTableBlock").show();
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
					url: 'courseware/delete?id=' + ids.join(','),
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
function loadCoursewareItem(){
	var id = Utils.parseUrlParam(window.location.href, 'id');
	$("#coursewareEditForm input[name=fileChanged]").val(false);
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'courseware/edit',
			data: {id:id},
			success: function(data){
				if(data.code == 0 && data.model){
					coursewareItemModel.model = data.model;
					var showName = data.model.filepath;
					var index = showName.lastIndexOf('/');
					showName = showName.slice(index+1);
					coursewareItemModel.model.showName = showName;
				}else{
					alert(data.message);
				}
				$("#coursewareEditBlock").show();
			},
			complete: function(){
				$("div[action=edit]").show();
				hideLoading();
			}
		});
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
		showLoading('正在加载...');
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			apiClient({
                url: 'courseware/addParam',
                data: {type:1},
                success: function(data){
                    if(data.code == 0){
                    	coursewareAddModel.model = data.model;
                    } else {
                    	alert(data.message);
                    }
                },
                complete: function(e){
                	hideLoading();
                }
            });
		}else if(action == 'edit'){
			loadCoursewareItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		apiClient({
			url: 'common/repository/org/find',
			data: {delete_status:1},
			success: function(data){
				if(data.code == 0 && data.model){
					coursewareQueryModel.orgList = data.model;
				}else{
					alert(data.message);
				}
			},
			complete: function(){
			}
		})
		
		var page = $("#coursewareQueryForm input[name=page]").val();
		doQuery(page);
	}
}

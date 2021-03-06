
$(function(){
	var pageName = getPageName();

	var parentId = Utils.parseUrlParam(window.location.href, 'parentId');
	var cityName = Utils.parseUrlParam(window.location.href, 'name');
	
	$('#regionQueryForm input[name=parent_id]').val(parentId);
	$('#regionAddForm input[name=parent_id]').val(parentId);
	
	// 查询条件日期控件
	$("#regionQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#regionAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#regionAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#regionAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#regionAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#regionCancelButton').click(function(){
		$('#regionAddForm button[type=reset]').click();
		window.location.href = '#' + pageName + '?parentId=' + parentId + '&name=' + cityName;
	});
	
	// 查询按钮
	$('#regionQueryForm button[type="button"][name=regionQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#regionQueryForm button[type="button"][name=regionExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#regionQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'region/export/all',
					data: $("#regionQueryForm").serialize(),
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
				$('#regionQueryForm input[name=async]').val(1);
				$("#regionAlert").hide();
				apiClient({
					url: 'region/export/all',
					data: $("#regionQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#regionAlert").show();
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
	$('#regionAddButton').click(function(){
		var valid = true;
		
		// city
		var regionCityNode = $("#regionAddForm input[name=city]");
		if(regionCityNode && regionCityNode.length && !$.trim(regionCityNode.val())){
			showToolTip(regionCityNode);
			valid = false;
		}
		// 英文名称
		var regionCityEnNode = $("#regionAddForm input[name=city_en]");
		if(regionCityEnNode && regionCityEnNode.length && !$.trim(regionCityEnNode.val())){
			showToolTip(regionCityEnNode);
			valid = false;
		}
		// 区号
		var areaCodeNode = $("#regionAddForm input[name=area_code]");
		if(areaCodeNode && areaCodeNode.length && !$.trim(areaCodeNode.val())){
			showToolTip(areaCodeNode);
			valid = false;
		}
		// 邮编
		var regionPostNode = $("#regionAddForm input[name=post]");
		if(regionPostNode && regionPostNode.length && !$.trim(regionPostNode.val())){
			showToolTip(regionPostNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'region/add',
			method: 'post',
			data: $("#regionAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#regionQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName + '?parentId=' + parentId + '&name=' + cityName;
					$('#regionAddForm button[type=reset]').click();
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
	});
	
	// 导入文件
	$("#regionImportExcel").click(function(){
		$("#regionExcelFile").val('');
		$("#regionExcelFile").click();
	});
	// 同步导入
	$("#regionUploadForm").ajaxForm({
		url: _baseUrl + 'region/import',
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
	$("#regionExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#regionUploadForm").submit();
	});

/*
	// 异步导入
	$("#regionUploadForm").ajaxForm({
		url: _baseUrl + 'region/import',
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
				$("#regionAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#regionExcelFile").change(function(){
		$("#regionAlert").hide();
		$('#regionUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#regionUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#regionAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	regionListModel = new Vue({
		el: '#regionTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName,
			utils: Utils
		},
		methods: {
//			formatRank: function(value){
//				var text = value;
//				if(value == 1){
//					text = '国家';
//				}else if(value == 2){
//					text = '省';
//				}else if(value == 3){
//					text = '市';
//				}else if(value == 4){
//					text = '区';
//				}
//				return text;
//			},
//			formatGovType: function(value){
//				var text = value;
//				if(value == 1){
//					text = '首都';
//				}else if(value == 0){
//					text = '其他';
//				}
//				return text;
//			},
//			formatDate: function(value){
//				return moment(value).format('YYYY-MM-DD');
//			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#regionCheckAll").prop('checked', true);
				}else{
					$("#regionCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goShowDetail: function(e){
				window.location.href = 'index.html#region_district?parentId=' + $(e.target).attr('pk') 
										+ '&name=' + $(e.target).attr('cityName') 
										+ '&name2=' + $(e.target).attr('cityName2')
										+ '&provinceId=' + $(e.target).attr('provinceId');
			},
			goEdit: function(e){
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk') + '&parentId=' + $(e.target).attr('parentId') + '&name=' + $(e.target).attr('parentName');
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
				var jumpNode = $('#regionJumpNo');
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
					url: 'region/export/query',
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
				$("#regionAlert").hide();
				apiClient({
					url: 'region/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#regionAlert").show();
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
							url: 'region/export/all',
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
						$("#regionAlert").hide();
						apiClient({
							url: 'region/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#regionAlert").show();
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
	regionItemModel = new Vue({
		el: '#regionEditForm',
		data: {
			model: {}
		},
		methods: {
			doCancel: function(e){
				window.location.href = '#' + pageName + '?parentId=' + parentId + '&name=' + cityName;
				$("#regionEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// city
				var regionCityNode = $("#regionEditForm input[name=city]");
				if(regionCityNode && regionCityNode.length && !$.trim(regionCityNode.val())){
					showToolTip(regionCityNode);
					valid = false;
				}
				// 英文名称
				var regionCityEnNode = $("#regionEditForm input[name=city_en]");
				if(regionCityEnNode && regionCityEnNode.length && !$.trim(regionCityEnNode.val())){
					showToolTip(regionCityEnNode);
					valid = false;
				}
				// 区号
				var areaCodeNode = $("#regionEditForm input[name=area_code]");
				if(areaCodeNode && areaCodeNode.length && !$.trim(areaCodeNode.val())){
					showToolTip(areaCodeNode);
					valid = false;
				}
				// 邮编
				var regionPostNode = $("#regionEditForm input[name=post]");
				if(regionPostNode && regionPostNode.length && !$.trim(regionPostNode.val())){
					showToolTip(regionPostNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'region/edit',
					method: 'post',
					data: $("#regionEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName + '?parentId=' + parentId + '&name=' + cityName;
							$('#regionEditForm button[type=reset]').click();
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
			$("#regionEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#regionEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#regionEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#regionEditForm input[ctl-type=decimal]").blur(function(){
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

var regionListModel, regionItemModel;

function goAdd(){
	var pageName = getPageName();
	var parentId = Utils.getUrlParam('parentId');
	var cityName = Utils.getUrlParam('name');
	window.location.href = '#' + pageName + '?action=add&parentId=' + parentId + '&name=' + cityName;
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
	$("#regionQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#regionRefreshRows").val();
	$("#regionQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'region/search',
		data: $("#regionQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#regionTable input[type=checkbox]').prop('checked', false);
				regionListModel.grid = data;
				$("#regionTableBlock").show();
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
					url: 'region/delete?id=' + ids.join(','),
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
function loadRegionItem(){
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
//		debugger;
		apiClient({
			url: 'region/edit',
			data: {id:id},
			success: function(data){
				$("#regionEditBlock").show();
				if(data.code == 0 && data.model){
					regionItemModel.model = data.model;
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
			showLoading('正在加载...');
			loadRegionItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
	
	// 导航菜单
	var page = getRouterPage();
	var parentId = Utils.parseUrlParam(window.location.href, 'parentId');
	var cityName = Utils.parseUrlParam(window.location.href, 'name');
	
	var navMenus = [];
	navMenus.push({text:'地区管理',link:'#region'});
	navMenus.push({text:cityName,link:'#' + page + '?parentId=' + parentId + '&name=' + cityName});
	
	return {navMenus:navMenus,currentMenu:'region'};
}

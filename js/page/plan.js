
//@ sourceURL=plan.js
$(function(){
	var pageName = getPageName();
	var myDate = new Date;
    var year = myDate.getFullYear();//获取当前年
	// 查询条件日期控件
	$("#planQueryForm input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});

	$("#planQueryForm input[name=implement_year]").val(year+1);
	// 新增页日期控件
	$("#planAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 查询条件日期控件
	$("#planUploadForm input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});
	// 查询条件日期控件
	$("#planAddForm input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#planAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#planAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#planAddForm input[ctl-type=decimal]").blur(function(){
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
	//重置
	$("#reSetCondition").click(function(){ 
		$("#planQueryForm input[name=plan_name]").val(""); 
		$("#planQueryForm input[name=implement_year]").val(year+1); 
		$("#planQueryForm select[name=type]").val("");
		 
	});
	// 取消按钮
	$('#planCancelButton').click(function(){
		$('#planAddForm button[type=reset]').click();
		var page = Utils.parseUrlParam(window.location.href, 'page');
		window.location.href = '#' + pageName+"?page="+page;
	});
	
	$("#planExcelFile").change(function(){
		var upload_file = $.trim($("#planExcelFile").val());    //获取上传文件
	    $('#fileName').val(upload_file);     //赋值给自定义input框
	})
	 
	// 查询按钮
	$('#planQueryForm button[type="button"][name=planQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#planQueryForm button[type="button"][name=planExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#planQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'plan/export/all',
					data: $("#planQueryForm").serialize(),
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
				$('#planQueryForm input[name=async]').val(1);
				$("#planAlert").hide();
				apiClient({
					url: 'plan/export/all',
					data: $("#planQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#planAlert").show();
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
	$('#planAddButton').click(function(){
		var valid = true;
		
		// 培训班名称
		var planPlanNameNode = $("#planAddForm input[name=plan_name]");
		if(planPlanNameNode && planPlanNameNode.length && !$.trim(planPlanNameNode.val())){
			showToolTip(planPlanNameNode);
			valid = false;
		}
		// 计划实施年度
		var implementYear = $("#planAddForm input[name=implement_year]");
		if(implementYear && implementYear.length && !$.trim(implementYear.val())){ 
			showToolTip(implementYear);
			valid = false;
		}
		// 培训类型
		var planTypeNode = $("#planAddForm input[name=type]");
		if(planTypeNode && planTypeNode.length && (!$.trim(planTypeNode.val()) || !validator.isNumeric($.trim(planTypeNode.val())))){
			planTypeNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(planTypeNode);
			valid = false;
		}

		// 需求来源
		var demandSourcesNode = $("#planAddForm textarea[name=demand_sources]");
		if(demandSourcesNode && demandSourcesNode.length && !$.trim(demandSourcesNode.val())){
			showToolTip(demandSourcesNode);
			valid = false;
		}
		// 安全法规
		var safetyRegulationNode = $("#planAddForm textarea[name=safety_regulation]");
		if(safetyRegulationNode && safetyRegulationNode.length && !$.trim(safetyRegulationNode.val())){
			showToolTip(safetyRegulationNode);
			valid = false;
		}
//		// 联系人
//		var planCallUserNode = $("#planAddForm input[name=call_user]");
//		if(planCallUserNode && planCallUserNode.length && !$.trim(planCallUserNode.val())){
//			showToolTip(planCallUserNode);
//			valid = false;
//		}
//		// 联系方式1
//		var planPhone1Node = $("#planAddForm input[name=phone1]");
//		if(planPhone1Node && planPhone1Node.length && !$.trim(planPhone1Node.val())){
//			showToolTip(planPhone1Node);
//			valid = false;
//		}
//		 
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'plan/add',
			method: 'post',
			data: $("#planAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#planQueryForm button[type=reset]").click();
					var page = Utils.parseUrlParam(window.location.href, 'page'); 
					window.location.href = '#' + pageName+"?page="+page;
					$('#planAddForm button[type=reset]').click();
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
	$("#fileSubmit").click(function(){
		
		var valid = true;
		
		// 培训班名称
		var implementYearNode = $("#planUploadForm input[name=implement_year]");
		if(implementYearNode && implementYearNode.length && !$.trim(implementYearNode.val())){
			showToolTip(implementYearNode);
			valid = false;
		} 
		// 培训班名称
		var planExcelFileNode = $("#planUploadForm input[name=fileName]");
		if(planExcelFileNode && planExcelFileNode.length && !$.trim(planExcelFileNode.val())){
			showToolTip(planExcelFileNode);
			valid = false;
		}
		if(!valid){
			return;
		}
		$("#planUploadForm").submit();
		showLoading('正在上传 ...');
		$("#closeFileSubmimt").click();
//		
//		$("#planExcelFile").val('');
//		$("#planExcelFile").click();
	});
	// 同步导入
	$("#planUploadForm").ajaxForm({
		url: _baseUrl + 'plan/import',
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
/*
	// 异步导入
	$("#planUploadForm").ajaxForm({
		url: _baseUrl + 'plan/import',
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
				$("#planAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#planExcelFile").change(function(){
		$("#planAlert").hide();
		$('#planUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#planUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#planAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	planListModel = new Vue({
		el: '#planTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatType: function(value){
				var text = value;
				if(value == 1){
					text = '内训';
				}else if(value == 2){
					text = '外训';
				}
				return text;
			}, 
			formatReviewStatus: function(value){
				var text = value;
				if(value == 1){
					text = '创建中';
				}else if(value == 4){
					text = '审核中';
				}else if(value == 3){
					text = '已审核';
				}else if(value == 2){
					text = '已实施';
				}
				return text;
			},
			formartColor:function(reviewStatus,remark){ 
				if(remark){
					return "color:#080808 !important;";
				}
				
				if(reviewStatus != 0){ 
					return "color:#A3A3A3 !important;";
				}else if(reviewStatus == 0){ 
					return "color:#080808 !important;";
				}
			},
			goAudit:function(reviewStatus,planId,remark){
				if(reviewStatus == 3 && (remark==null || remark.trim() == '')){
					alert("为给课程分配人员或者未添加备注！");
					return;
				}
				if(remark==null || remark.trim() == ''){ 
					if(reviewStatus == 1){
						alert("科目中未添加课程！");
						return;
					}
					if(reviewStatus==2){ 
						alert("科目中存在没有学员的课程！");
						return;
					}
					 
				}
				var message = message ? message : '是要否送审？'; 
				if(planId){
					bootbox.confirm(message, function(result){
						if(result){ 
							showLoading('正在送审...');
							apiClient({
								url: 'plan/review?id=' + planId,
								type: 'post',
								success: function(data){
									if(data.code == 0){ 
										var page =  $("#planQueryForm input[name=page]").val();
										doQuery(page);
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
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var reviewStatus = $(e.target).parent().attr('reviewStatus');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				if(reviewStatus!=0){ 
					node.prop('checked', !node.prop('checked'));
					
					if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
						$("#planCheckAll").prop('checked', true);
					}else{
						$("#planCheckAll").prop('checked', false);
					}
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').each(function(){
					if(!$(this).attr("disabled")){
						$(this).prop('checked', $(e.target).prop('checked'));
					}
				})
			},
			goEdit: function(e){  
				var page = $("#planQueryForm input[name=page]").val();
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk')+"&page="+page;
			}, 
			courseManager:function(e){
				var page = $("#planQueryForm input[name=page]").val();
				var planName = $("#planQueryForm input[name=plan_name]").val();
				var implementYear = $("#planQueryForm input[name=implement_year]").val();
				var type = $("#planQueryForm select[name=type]").val();
				window.location.href = "#course?course_plan_id=" + $(e.target).attr('pk')+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
			},
			deleteRow: function(e){
				doDelete([$(e.target).attr('pk')]);
			},
			goRemarkEdit:function(id){ 
				var page = $("#planQueryForm input[name=page]").val();
				window.location.href = "#" + pageName + "?action=preview&id=" + id+"&page="+page;
			},
			previewRow: function(e){
				var page = $("#planQueryForm input[name=page]").val();
				window.location.href = "#" + pageName + "?action=preview&id=" + $(e.target).attr('pk')+"&page="+page;
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
				var jumpNode = $('#planJumpNo');
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
					url: 'plan/export/query',
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
				$("#planAlert").hide();
				apiClient({
					url: 'plan/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#planAlert").show();
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
							url: 'plan/export/all',
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
						$("#planAlert").hide();
						apiClient({
							url: 'plan/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#planAlert").show();
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
	planItemModel = new Vue({
		el: '#planEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){ 
				$("#planEditForm button[type=reset]").click();
				var page = Utils.parseUrlParam(window.location.href, 'page');
				window.location.href = '#' + pageName+"?page="+page;
			},
			doSubmit: function(e){
				var valid = true;
				
				// 培训班名称
				var planPlanNameNode = $("#planEditForm input[name=plan_name]");
				if(planPlanNameNode && planPlanNameNode.length && !$.trim(planPlanNameNode.val())){
					showToolTip(planPlanNameNode);
					valid = false;
				}

				// 计划实施年度
				var implementYear = $("#planEditForm input[name=implement_year]");
				if(implementYear && implementYear.length && !$.trim(implementYear.val())){ 
					showToolTip(implementYear);
					valid = false;
				}
			 
				// 培训类型
				var planTypeNode = $("#planEditForm input[name=type]");
				if(planTypeNode && planTypeNode.length && (!$.trim(planTypeNode.val()) || !validator.isNumeric($.trim(planTypeNode.val())))){
					planTypeNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(planTypeNode);
					valid = false;
				}

				// 需求来源
				var demandSourcesNode = $("#planEditForm textarea[name=demand_sources]");
				if(demandSourcesNode && demandSourcesNode.length && !$.trim(demandSourcesNode.val())){
					showToolTip(demandSourcesNode);
					valid = false;
				}
				// 安全法规
				var safetyRegulationNode = $("#planEditForm textarea[name=safety_regulation]");
				if(safetyRegulationNode && safetyRegulationNode.length && !$.trim(safetyRegulationNode.val())){
					showToolTip(safetyRegulationNode);
					valid = false;
				}
//				// 联系人
//				var planCallUserNode = $("#planEditForm input[name=call_user]");
//				if(planCallUserNode && planCallUserNode.length && !$.trim(planCallUserNode.val())){
//					showToolTip(planCallUserNode);
//					valid = false;
//				}
//				// 联系方式1
//				var planPhone1Node = $("#planEditForm input[name=phone1]");
//				if(planPhone1Node && planPhone1Node.length && !$.trim(planPhone1Node.val())){
//					showToolTip(planPhone1Node);
//					valid = false;
//				}
//				// 联系方式2
//				var planPhone2Node = $("#planEditForm input[name=phone2]");
//				if(planPhone2Node && planPhone2Node.length && !$.trim(planPhone2Node.val())){
//					showToolTip(planPhone2Node);
//					valid = false;
//				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'plan/edit',
					method: 'post',
					data: $("#planEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							var page = Utils.parseUrlParam(window.location.href, 'page'); 
							window.location.href = '#' + pageName+"?page="+page;
							$('#planEditForm button[type=reset]').click();
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
			$("#planEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});

			// 查询条件日期控件
			$("#planEditForm input[ctl-type=year]").datetimepicker({
				format: 'YYYY',
				locale: 'zh-CN',
			});
			// 编辑页时间日期控件
			$("#planEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#planEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#planEditForm input[ctl-type=decimal]").blur(function(){
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
	
	// 查询结果model
	planPreviewModel = new Vue({
		el: '#planPreviewBlock',
		data: {
			model: {}
		},
		methods: {
			formatName: function(value){
				if(value == null){
					return '——';
				} else {
					return value;
				}
			},
			formatType: function(value){
				if(value == 1){
					return '内训';
				}else if(value == 2){
					return '外训';
				}
			},
			formatUser: function(value){
				if(value == null) {
					return '';
				} else if(value.length>5){
					return value[0]+'等'+value.length+'人';
				}else if(value.length > 0){
					var text = value[0];
					for (var i = 1; i < value.length; i++){
						text += ',' + value[i]
					}
					return text;
				}
			},
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			turnPage: function(e){
				// 页码翻页
				var page = $(e.target).text();
				if(this.grid.currentPage != page){
					previewPlan(page);
				}
			},
			refreshPage: function(e){
				// 行数刷新
				previewPlan(1);
			},
			firstPage: function(e){
				// 第一页
				if(this.grid.currentPage > 1){
					previewPlan(1);
				}
			},
			previousPage: function(e){
				// 上一页
				if(this.grid.currentPage > 1){
					previewPlan(this.grid.currentPage - 1);
				}
			},
			nextPage: function(e){
				// 下一页
				if(this.grid.currentPage < this.grid.totalPage){
					previewPlan(this.grid.currentPage + 1);
				}
			},
			lastPage: function(e){
				// 最后一页
				if(this.grid.currentPage < this.grid.totalPage){
					previewPlan(this.grid.totalPage);
				}
			},
			jumpTo: function(e){
				// 跳转至
				var jumpNode = $('#planAuditJumpNo');
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
				
				previewPlan(jumpNode.val());
			}
		},
		mounted: function(){
			// 这里添加列表初始化后的事件绑定代码
		}
	});

})

var planListModel, planItemModel, planPreviewModel;

function goAdd(){
	var pageName = getPageName();
	window.location.href = '#' + pageName + '?action=add&page='+$("#planQueryForm input[name=page]").val();
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){ 
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var year = $("#planQueryForm input[name='implement_year']");
	// 计划实施年度  
	if(year && year.length && !$.trim(year.val())){ 
		showToolTip(year);
		return;
	}
	
	if(!action){
		showLoading('正在查询...');
	}
	$("#planQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#planRefreshRows").val();
	$("#planQueryForm input[name='rows']").val(rows ? rows : 20);
	
	apiClient({
		url: 'plan/search',
		data: $("#planQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#planTable input[type=checkbox]').prop('checked', false);
				planListModel.grid = data;
				$("#planTableBlock").show();
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
					url: 'plan/delete?id=' + ids.join(','),
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
 * 计划送审
 * @param {Array} ids	记录主键id
 */
function previewPlan(page){ 
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	$("#planPreviewForm input[name='id']").val(id);
	
//	$("#planPreviewForm input[name=page]").val(page ? page : 1);
//	
//	var rows = $("#planPreviewRefreshRows").val();
//	$("#planPreviewForm input[name='rows']").val(rows ? rows : 10);
	if(id){
		$("div[action=preivew]").hide();
		apiClient({
			url : 'planAudit/goRemark',
			data: $("#planPreviewForm").serialize(),
			success: function(data){ 
				planPreviewModel.model = data.model;
			},
			complete: function(){
				$("div[action=preivew]").show();
				hideLoading();
			}
		})
	}else{
		hideLoading();
	}
}

/**
 * 计划送审
 */
function saveRemark(){ 
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){ 
		showLoading('正在保存...');
		apiClient({
			url: 'plan/saveReMark',
			type: 'post',
			data:  $("#planPreviewForm").serialize(),
			success: function(data){
				if(data.code == 0){ 
					var page = Utils.parseUrlParam(window.location.href, 'page'); 
					window.location.href = '#' + getPageName()+"?page="+page;
				}else{ 
					alert(data.message);
				}
			},
			complete: function(){
				hideLoading();
			}
		});  
	}
}

function auditCancel(){ 
	var page = Utils.parseUrlParam(window.location.href, 'page'); 
	window.location.href = '#' + getPageName()+"?page="+page;
}

/**
 * 加载明细数据
 */
function loadPlanItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'plan/edit',
			data: {id:id},
			success: function(data){
				$("#planEditBlock").show();
				if(data.code == 0 && data.model){
					planItemModel.model = data.model;
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
	var page =  Utils.parseUrlParam(window.location.href, 'page') 
	var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
	var type =  Utils.parseUrlParam(window.location.href, 'type') 
	var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
	if(planName){ 
		$("#planQueryForm input[name=plan_name]").val(planName);
	}
	if(implementYear){ 
		$("#planQueryForm input[name=implement_year]").val(implementYear);
	} 
	if(type){ 
		$("#planQueryForm select[name=type]").val(type);
	}
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			
		} else if(action == 'edit'){
			loadPlanItem();
		} else if(action == 'preview'){
			previewPlan();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		
		doQuery(page?page:1);
	}
}

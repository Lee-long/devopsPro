
$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#coursePlanQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#coursePlanAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 课程下拉框
	courseIdListModel = new Vue({
		el: '#courseIdList',
		data: {
			items: []
		}
	});
	
	// 讲师下拉框
	teacherIdListModel = new Vue({
		el: '#teacherIdList',
		data: {
			items: []
		}
	});
	
	
	// 查询结果model
	courseUserMappingListModel = new Vue({
		el: '#courseUserMappingTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			deleteCoursePlan: function(e){
				deleteCoursePlanRows();
			}
		}
	});
	
	// 新增页时间日期控件
	$("#coursePlanAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#coursePlanAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#coursePlanAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#coursePlanCancelButton').click(function(){
		$('#coursePlanAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#coursePlanQueryForm button[type="button"][name=coursePlanQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#coursePlanQueryForm button[type="button"][name=coursePlanExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#coursePlanQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'coursePlan/export/all',
					data: $("#coursePlanQueryForm").serialize(),
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
				$('#coursePlanQueryForm input[name=async]').val(1);
				$("#coursePlanAlert").hide();
				apiClient({
					url: 'coursePlan/export/all',
					data: $("#coursePlanQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#coursePlanAlert").show();
						}else{
							alert(data.message);
						}
					}
				});
*/
			}
		});
	});
	
	// 新增计划与课程/讲师关系记录
	$('#coursePlanMatchAddButton').click(function(){
		showLoading('正在保存...');
		
		apiClient({
			url: 'courseUserMapping/add',
			method: 'post',
			data: $("#coursePlanMatchAddForm").serialize(),
			success: function(data){
				hideLoading();
				doCourseTeacherQuery();
				/*if(data.code == 0){
					hideLoading();
					$("#coursePlanQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#coursePlanAddForm button[type=reset]').click();
				}else{
					hideLoading();
					alert(data.message);
				}*/
			},
			error: function(){
				hideLoading();
			}
		})
	})
	
	
	// 新增记录提交
	$('#coursePlanAddButton').click(function(){
		var valid = true;
		
		// 培训班名称
		var coursePlanPlanNameNode = $("#coursePlanAddForm input[name=plan_name]");
		if(coursePlanPlanNameNode && coursePlanPlanNameNode.length && !$.trim(coursePlanPlanNameNode.val())){
			showToolTip(coursePlanPlanNameNode);
			valid = false;
		}
		// 开始时间
		var coursePlanStartTimeNode = $("#coursePlanAddForm input[name=start_time]");
		if(coursePlanStartTimeNode && coursePlanStartTimeNode.length && !$.trim(coursePlanStartTimeNode.val())){
			showToolTip(coursePlanStartTimeNode);
			valid = false;
		}
		// 结束时间
		var coursePlanEndTimeNode = $("#coursePlanAddForm input[name=end_time]");
		if(coursePlanEndTimeNode && coursePlanEndTimeNode.length && !$.trim(coursePlanEndTimeNode.val())){
			showToolTip(coursePlanEndTimeNode);
			valid = false;
		}
		// 培训类型
		var coursePlanTypeNode = $("#coursePlanAddForm input[name=type]");
		if(coursePlanTypeNode && coursePlanTypeNode.length && (!$.trim(coursePlanTypeNode.val()) || !validator.isNumeric($.trim(coursePlanTypeNode.val())))){
			coursePlanTypeNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(coursePlanTypeNode);
			valid = false;
		}
		// 培训地点
		var coursePlanAddressNode = $("#coursePlanAddForm input[name=address]");
		if(coursePlanAddressNode && coursePlanAddressNode.length && !$.trim(coursePlanAddressNode.val())){
			showToolTip(coursePlanAddressNode);
			valid = false;
		}
		// 培训内容
		var coursePlanSummaryNode = $("#coursePlanAddForm input[name=summary]");
		if(coursePlanSummaryNode && coursePlanSummaryNode.length && !$.trim(coursePlanSummaryNode.val())){
			showToolTip(coursePlanSummaryNode);
			valid = false;
		}
		// 联系人
		var coursePlanCallUserNode = $("#coursePlanAddForm input[name=call_user]");
		if(coursePlanCallUserNode && coursePlanCallUserNode.length && !$.trim(coursePlanCallUserNode.val())){
			showToolTip(coursePlanCallUserNode);
			valid = false;
		}
		// 联系方式1
		var coursePlanPhone1Node = $("#coursePlanAddForm input[name=phone1]");
		if(coursePlanPhone1Node && coursePlanPhone1Node.length && !$.trim(coursePlanPhone1Node.val())){
			showToolTip(coursePlanPhone1Node);
			valid = false;
		}
		// 联系方式2
		var coursePlanPhone2Node = $("#coursePlanAddForm input[name=phone2]");
		if(coursePlanPhone2Node && coursePlanPhone2Node.length && !$.trim(coursePlanPhone2Node.val())){
			showToolTip(coursePlanPhone2Node);
			valid = false;
		}
		// 培训人数
		var coursePlanStudentNumNode = $("#coursePlanAddForm input[name=student_num]");
		if(coursePlanStudentNumNode && coursePlanStudentNumNode.length && (!$.trim(coursePlanStudentNumNode.val()) || !validator.isNumeric($.trim(coursePlanStudentNumNode.val())))){
			coursePlanStudentNumNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(coursePlanStudentNumNode);
			valid = false;
		}
		// 审批者ID（user_id）
		var coursePlanReviewUserIdNode = $("#coursePlanAddForm input[name=review_user_id]");
		if(coursePlanReviewUserIdNode && coursePlanReviewUserIdNode.length && (!$.trim(coursePlanReviewUserIdNode.val()) || !validator.isNumeric($.trim(coursePlanReviewUserIdNode.val())))){
			coursePlanReviewUserIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(coursePlanReviewUserIdNode);
			valid = false;
		}
		// 审批者登录名（login_name）
		var coursePlanReviewByNode = $("#coursePlanAddForm input[name=review_by]");
		if(coursePlanReviewByNode && coursePlanReviewByNode.length && !$.trim(coursePlanReviewByNode.val())){
			showToolTip(coursePlanReviewByNode);
			valid = false;
		}
		// 审批时间
		var coursePlanReviewDateNode = $("#coursePlanAddForm input[name=review_date]");
		if(coursePlanReviewDateNode && coursePlanReviewDateNode.length && !$.trim(coursePlanReviewDateNode.val())){
			showToolTip(coursePlanReviewDateNode);
			valid = false;
		}
		// 审批意见
		var coursePlanReviewRemarkNode = $("#coursePlanAddForm input[name=review_remark]");
		if(coursePlanReviewRemarkNode && coursePlanReviewRemarkNode.length && !$.trim(coursePlanReviewRemarkNode.val())){
			showToolTip(coursePlanReviewRemarkNode);
			valid = false;
		}
		// 审批状态
		var coursePlanReviewStatusNode = $("#coursePlanAddForm input[name=review_status]");
		if(coursePlanReviewStatusNode && coursePlanReviewStatusNode.length && (!$.trim(coursePlanReviewStatusNode.val()) || !validator.isNumeric($.trim(coursePlanReviewStatusNode.val())))){
			coursePlanReviewStatusNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(coursePlanReviewStatusNode);
			valid = false;
		}
		// course_info
		var coursePlanCourseInfoNode = $("#coursePlanAddForm input[name=course_info]");
		if(coursePlanCourseInfoNode && coursePlanCourseInfoNode.length && !$.trim(coursePlanCourseInfoNode.val())){
			showToolTip(coursePlanCourseInfoNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'coursePlan/add',
			method: 'post',
			data: $("#coursePlanAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#coursePlanQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#coursePlanAddForm button[type=reset]').click();
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
	$("#coursePlanImportExcel").click(function(){
		$("#coursePlanExcelFile").val('');
		$("#coursePlanExcelFile").click();
	});
	// 同步导入
	$("#coursePlanUploadForm").ajaxForm({
		url: _baseUrl + 'coursePlan/import',
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
	$("#coursePlanExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#coursePlanUploadForm").submit();
	});

/*
	// 异步导入
	$("#coursePlanUploadForm").ajaxForm({
		url: _baseUrl + 'coursePlan/import',
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
				$("#coursePlanAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#coursePlanExcelFile").change(function(){
		$("#coursePlanAlert").hide();
		$('#coursePlanUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#coursePlanUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#coursePlanAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	coursePlanListModel = new Vue({
		el: '#coursePlanTableBlock',
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
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#coursePlanCheckAll").prop('checked', true);
				}else{
					$("#coursePlanCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk');
			},
			goMatchCourseTeacher: function(e){
				window.location.href = "#" + pageName + "?action=coursePlanMatchBlock&id=" + $(e.target).attr('pk');
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
				var jumpNode = $('#coursePlanJumpNo');
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
					url: 'coursePlan/export/query',
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
				$("#coursePlanAlert").hide();
				apiClient({
					url: 'coursePlan/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#coursePlanAlert").show();
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
							url: 'coursePlan/export/all',
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
						$("#coursePlanAlert").hide();
						apiClient({
							url: 'coursePlan/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#coursePlanAlert").show();
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
	coursePlanItemModel = new Vue({
		el: '#coursePlanEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#coursePlanEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 培训班名称
				var coursePlanPlanNameNode = $("#coursePlanEditForm input[name=plan_name]");
				if(coursePlanPlanNameNode && coursePlanPlanNameNode.length && !$.trim(coursePlanPlanNameNode.val())){
					showToolTip(coursePlanPlanNameNode);
					valid = false;
				}
				// 开始时间
				var coursePlanStartTimeNode = $("#coursePlanEditForm input[name=start_time]");
				if(coursePlanStartTimeNode && coursePlanStartTimeNode.length && !$.trim(coursePlanStartTimeNode.val())){
					showToolTip(coursePlanStartTimeNode);
					valid = false;
				}
				// 结束时间
				var coursePlanEndTimeNode = $("#coursePlanEditForm input[name=end_time]");
				if(coursePlanEndTimeNode && coursePlanEndTimeNode.length && !$.trim(coursePlanEndTimeNode.val())){
					showToolTip(coursePlanEndTimeNode);
					valid = false;
				}
				// 培训类型
				var coursePlanTypeNode = $("#coursePlanEditForm input[name=type]");
				if(coursePlanTypeNode && coursePlanTypeNode.length && (!$.trim(coursePlanTypeNode.val()) || !validator.isNumeric($.trim(coursePlanTypeNode.val())))){
					coursePlanTypeNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(coursePlanTypeNode);
					valid = false;
				}
				// 培训地点
				var coursePlanAddressNode = $("#coursePlanEditForm input[name=address]");
				if(coursePlanAddressNode && coursePlanAddressNode.length && !$.trim(coursePlanAddressNode.val())){
					showToolTip(coursePlanAddressNode);
					valid = false;
				}
				// 培训内容
				var coursePlanSummaryNode = $("#coursePlanEditForm input[name=summary]");
				if(coursePlanSummaryNode && coursePlanSummaryNode.length && !$.trim(coursePlanSummaryNode.val())){
					showToolTip(coursePlanSummaryNode);
					valid = false;
				}
				// 联系人
				var coursePlanCallUserNode = $("#coursePlanEditForm input[name=call_user]");
				if(coursePlanCallUserNode && coursePlanCallUserNode.length && !$.trim(coursePlanCallUserNode.val())){
					showToolTip(coursePlanCallUserNode);
					valid = false;
				}
				// 联系方式1
				var coursePlanPhone1Node = $("#coursePlanEditForm input[name=phone1]");
				if(coursePlanPhone1Node && coursePlanPhone1Node.length && !$.trim(coursePlanPhone1Node.val())){
					showToolTip(coursePlanPhone1Node);
					valid = false;
				}
				// 联系方式2
				var coursePlanPhone2Node = $("#coursePlanEditForm input[name=phone2]");
				if(coursePlanPhone2Node && coursePlanPhone2Node.length && !$.trim(coursePlanPhone2Node.val())){
					showToolTip(coursePlanPhone2Node);
					valid = false;
				}
				// 培训人数
				var coursePlanStudentNumNode = $("#coursePlanEditForm input[name=student_num]");
				if(coursePlanStudentNumNode && coursePlanStudentNumNode.length && (!$.trim(coursePlanStudentNumNode.val()) || !validator.isNumeric($.trim(coursePlanStudentNumNode.val())))){
					coursePlanStudentNumNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(coursePlanStudentNumNode);
					valid = false;
				}
				// 审批者ID（user_id）
				var coursePlanReviewUserIdNode = $("#coursePlanEditForm input[name=review_user_id]");
				if(coursePlanReviewUserIdNode && coursePlanReviewUserIdNode.length && (!$.trim(coursePlanReviewUserIdNode.val()) || !validator.isNumeric($.trim(coursePlanReviewUserIdNode.val())))){
					coursePlanReviewUserIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(coursePlanReviewUserIdNode);
					valid = false;
				}
				// 审批者登录名（login_name）
				var coursePlanReviewByNode = $("#coursePlanEditForm input[name=review_by]");
				if(coursePlanReviewByNode && coursePlanReviewByNode.length && !$.trim(coursePlanReviewByNode.val())){
					showToolTip(coursePlanReviewByNode);
					valid = false;
				}
				// 审批时间
				var coursePlanReviewDateNode = $("#coursePlanEditForm input[name=review_date]");
				if(coursePlanReviewDateNode && coursePlanReviewDateNode.length && !$.trim(coursePlanReviewDateNode.val())){
					showToolTip(coursePlanReviewDateNode);
					valid = false;
				}
				// 审批意见
				var coursePlanReviewRemarkNode = $("#coursePlanEditForm input[name=review_remark]");
				if(coursePlanReviewRemarkNode && coursePlanReviewRemarkNode.length && !$.trim(coursePlanReviewRemarkNode.val())){
					showToolTip(coursePlanReviewRemarkNode);
					valid = false;
				}
				// 审批状态
				var coursePlanReviewStatusNode = $("#coursePlanEditForm input[name=review_status]");
				if(coursePlanReviewStatusNode && coursePlanReviewStatusNode.length && (!$.trim(coursePlanReviewStatusNode.val()) || !validator.isNumeric($.trim(coursePlanReviewStatusNode.val())))){
					coursePlanReviewStatusNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(coursePlanReviewStatusNode);
					valid = false;
				}
				// course_info
				var coursePlanCourseInfoNode = $("#coursePlanEditForm input[name=course_info]");
				if(coursePlanCourseInfoNode && coursePlanCourseInfoNode.length && !$.trim(coursePlanCourseInfoNode.val())){
					showToolTip(coursePlanCourseInfoNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'coursePlan/edit',
					method: 'post',
					data: $("#coursePlanEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#coursePlanEditForm button[type=reset]').click();
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
			$("#coursePlanEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#coursePlanEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#coursePlanEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#coursePlanEditForm input[ctl-type=decimal]").blur(function(){
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

var coursePlanListModel, coursePlanItemModel;

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
	$("#coursePlanQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#coursePlanRefreshRows").val();
	$("#coursePlanQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'coursePlan/search',
		data: $("#coursePlanQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#coursePlanTable input[type=checkbox]').prop('checked', false);
				coursePlanListModel.grid = data;
				$("#coursePlanTableBlock").show();
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
					url: 'coursePlan/delete?id=' + ids.join(','),
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
function loadCoursePlanItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'coursePlan/edit',
			data: {id:id},
			success: function(data){
				$("#coursePlanEditBlock").show();
				if(data.code == 0 && data.model){
					coursePlanItemModel.model = data.model;
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
 * 查询课程讲师关系信息
 */
function doCourseTeacherQuery(){
	var planId=$("#planId").val();
	apiClient({
		url: 'courseUserMapping/searchCoursePlanMapping',
		data: {plan_id:planId},
		success: function(data){
			courseUserMappingListModel.grid.items = data;
		}
	})
}

/**
 * 批量删除课程讲师关系信息
 */
function deleteCoursePlanRows(){
	var ids = [];
	$('input[type=checkbox][pk]:checked').each(function(){
		ids.push($(this).attr('pk'));
	});
	
	var message = message ? message : '确认要否删除吗？';
	if(ids && ids.length){
		bootbox.confirm(message, function(result){
			if(result){
				showLoading('正在删除...');
				apiClient({
					url: 'courseUserMapping/delete?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							hideLoading();
							doCourseTeacherQuery();
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
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var planId = Utils.parseUrlParam(window.location.href, 'id');
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			
		}else if(action == 'edit'){
			loadCoursePlanItem();
		}else if(action=='coursePlanMatchBlock'){
			$("#planId").val(planId);
			apiClient({
				url: 'course/courseSearch',
//				data: {delete_status:1},
				success: function(data){
						courseIdListModel.items = data;
				}
			});
			apiClient({
				url: 'user/searchTeacher',
				data: {org_id:3},
				success: function(data){
						teacherIdListModel.items = data;
				}
			});
			
			doCourseTeacherQuery();
			
			/*apiClient({
				url: 'common/repository/user/find',
				data: {plan_id: planId},
				success: function(data){
					if(data.code == 0){
						userIdListModel.items = data.model;
					}
				}
			});*/
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

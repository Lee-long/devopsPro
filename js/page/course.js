
//@ sourceURL=course.js
$(function(){
	var pageName = getPageName();

	// 整数输入
	$("input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	
	if(courseAddEditor){
		courseAddEditor.destroy();
	}
    courseAddEditor = UE.getEditor('courseAddEditor', {
    	serverUrl: ueditorServletUrl,
    	autoHeightEnabled: false,
    	enableAutoSave: false,
    	saveInterval: 1000 * 60 * 60 * 24,
    	toolbars: ueditorToolbars
    });

	if(courseEditEditor){
		courseEditEditor.destroy();
	}
    courseEditEditor = UE.getEditor('courseEditEditor', {
    	serverUrl: ueditorServletUrl,
    	autoHeightEnabled: false,
    	enableAutoSave: false,
    	saveInterval: 1000 * 60 * 60 * 24,
    	toolbars: ueditorToolbars
    });

 
 
	// 新增页预览图
	$("#addThumbnailForm").ajaxForm({
		url: _baseUrl + 'common/file/upload',
		dataType:'json',
		success: function(data, textStatus, jqXHR, form){
//			debugger;
			if(data.code == 0){
				$('#courseAddForm img[name=thumbnail]').attr('src', data.url);
				$('#courseAddForm input[name=img_url]').val(data.url);
			}else{
				alert(data.message);
			}
		},
		error: function(){
			hideLoading();
		}
	});	
	$('#addThumbnailForm input').change(function(){
		$("#addThumbnailForm").submit();
	});
	$('#courseAddForm img[name=thumbnail]').click(function(){
		$('#addThumbnailForm input').val('');
		$('#addThumbnailForm input').click();
	});
	
	// 重置按钮
	$("#courseAddForm button[type=reset]").click(function(){
		courseAddEditor.setContent('');
	});
	//  新增页开课时间年月
	$("#courseAddForm input[ctl-type=yearMonth]").datetimepicker({
		format: 'YYYY-MM',
		locale: 'zh-CN',
	});
	
	// 查询条件日期控件
	$("#courseQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});

	// 新增页日期控件
	$("#courseAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#courseAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#courseAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#courseAddForm input[ctl-type=decimal]").blur(function(){
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
		var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');
		window.location.href = '#' + pageName+"?course_plan_id="+planId;
	}); 
 
	// 查询按钮
	$('#courseQueryForm button[type="button"][name=courseQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#courseQueryForm button[type="button"][name=courseExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#courseQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'course/export/all',
					data: $("#courseQueryForm").serialize(),
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
	
	// 课程人员添加
	planUserItemModel = new Vue({
		el: '#planUserEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			formartStatus:function(value){
				if(value ==2){
					return "通过";
				}else if(value==1){
					return "未通过";
				}else{
					return "-";
				}
			},
			shwoModal:function(value){
				//alert(11);
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('#planUserEditForm input[type=checkbox][pk]').length == $('#planUserEditForm input[type=checkbox][pk]:checked').length){
					$("#planUserCheckAll").prop('checked', true);
				}else{
					$("#planUserCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('#planUserEditForm input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			doCancel: function(e){ 
				var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');
				var page =  Utils.parseUrlParam(window.location.href, 'page') 
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var type =  Utils.parseUrlParam(window.location.href, 'type') 
				var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
				
				window.location.href = '#' + pageName+"?course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
				$("#planUserEditForm button[type=reset]").click();
			},
			deleteRows: function(e){
				var ids = [];
				$('#planUserEditForm input[type=checkbox][pk]:checked').each(function(){
					ids.push($(this).attr('pk'));
				}); 
				doPlanUserDelete(ids, '是否要删除选中行？');
			},
			doSubmit: function(e){
				var valid = true; 
				var ids = [];
				$('#planUserEditForm input[type=checkbox][pk]:checked').each(function(){
					ids.push($(this).attr('pk'));
				});  
				apiClient({
					url: 'planUser/edit',
					method: 'post',
					data: $("#planUserEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();

							var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id'); 
							window.location.href = '#' + pageName+"?course_plan_id="+planId;
							$('#planUserEditForm button[type=reset]').click();
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
 
	
	// 课程人员添加
	planUserItemAddModel = new Vue({
		el: '#planUserAddForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			formartStatus:function(value){
				if(value ==2){
					return "通过";
				}else if(value==1){
					return "未通过";
				}else{
					return "-";
				}
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('#planUserAddForm input[type=checkbox][pk]').length == $('#planUserAddForm input[type=checkbox][pk]:checked').length){
					$("#planUserCheckAll").prop('checked', true);
				}else{
					$("#planUserCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('#planUserAddForm input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			doCancel: function(e){  	
				var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');
				var page =  Utils.parseUrlParam(window.location.href, 'page') 
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var type =  Utils.parseUrlParam(window.location.href, 'type') 
				var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
				
				window.location.href = '#' + pageName+"?course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear; 
				$("#planUserAddForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
			 
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'planUser/edit',
					method: 'post',
					data: $("#planUserEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();

							var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id'); 
							window.location.href = '#' + pageName+"?course_plan_id="+planId;
							$('#planUserEditForm button[type=reset]').click();
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

			// 查询条件日期控件
			$("#planUserAddForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN',
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
		}
	});
	// 新增记录提交
	$('#courseCancelButton').click(function(){ 
		var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');
		var page =  Utils.parseUrlParam(window.location.href, 'page') 
		var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
		var type =  Utils.parseUrlParam(window.location.href, 'type') 
		var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
		window.location.href = '#' + pageName+"?course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
	});
	// 新增记录提交
	$('#courseAddButton').click(function(){
		var valid = true;
		
		// 课程名称
		var courseCourseNameNode = $("#courseAddForm input[name=course_name]");
		if(courseCourseNameNode && courseCourseNameNode.length && !$.trim(courseCourseNameNode.val())){
			showToolTip(courseCourseNameNode);
			valid = false;
		}
		// 开课时间
		var trainingMonthNode = $("#courseAddForm input[name=training_month]");
		var coursePlanIdNode = $("#courseAddForm input[name=plan_id]");
		if(trainingMonthNode && trainingMonthNode.length && !$.trim(trainingMonthNode.val())){
			trainingMonthNode.attr("title","请输入开课时间");
			showToolTip(trainingMonthNode);
			valid = false;
			
		}else if($.trim(trainingMonthNode.val()).substring(0,4) != coursePlanIdNode.attr("implementYear") ){
			trainingMonthNode.attr("title","开课时间不在计划实施年度内，计划实施年度为"+coursePlanIdNode.attr("implementYear"));
			showToolTip(trainingMonthNode);
			valid = false;
		}
		// 学时
		var courseTimeNode = $("#courseAddForm input[name=course_time]");
		if(courseTimeNode && courseTimeNode.length && !$.trim(courseTimeNode.val())){
			showToolTip(courseTimeNode);
			valid = false;
		}
		// 是否考试
		var isExamNode = $("#courseAddForm input[name=is_exam]");
		if(isExamNode && isExamNode.length && !$.trim(isExamNode.val())){
			showToolTip(isExamNode);
			valid = false;
		}
//		// 视频上传地址
//		var courseVideoUrlNode = $("#courseAddForm input[name=video_url]");
//		if(courseVideoUrlNode && courseVideoUrlNode.length && !$.trim(courseVideoUrlNode.val())){
//			showToolTip(courseVideoUrlNode);
//			valid = false;
//		}
		// 预览图
//		var courseImgUrlNode = $("#courseAddForm input[name=img_url]");
//		if(courseImgUrlNode && courseImgUrlNode.length && !$.trim(courseImgUrlNode.val())){
//			showToolTip(courseImgUrlNode);
//			valid = false;
//		}
//		// 课程类型
//		var courseTypeNode = $("#courseAddForm input[name=type]");
//		if(courseTypeNode && courseTypeNode.length && (!$.trim(courseTypeNode.val()) || !validator.isNumeric($.trim(courseTypeNode.val())))){
//			courseTypeNode.attr('title', '格式错误').tooltip('fixTitle');
//			showToolTip(courseTypeNode);
//			valid = false;
//		}
//		// 计划ID 
//		if(coursePlanIdNode && coursePlanIdNode.length && (!$.trim(coursePlanIdNode.val()) || !validator.isNumeric($.trim(coursePlanIdNode.val())))){
//			//coursePlanIdNode.attr('title', '格式错误').tooltip('fixTitle');
//			showToolTip(coursePlanIdNode);
//			valid = false;
//		}
		// 课程简介
//		var courseSummaryNode = $("#courseAddEditor");
//		if(courseSummaryNode && courseSummaryNode.length && !$.trim(courseAddEditor.getContent())){
//			alert('请输入内容');
//			return false;
//		}
		$("#courseAddForm textarea[name=summary]").val(courseAddEditor.getContent());
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'course/add',
			method: 'post',
			data: $("#courseAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#courseQueryForm button[type=reset]").click();
					courseAddEditor.setContent('');

					var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id'); 
					var page =  Utils.parseUrlParam(window.location.href, 'page') 
					var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
					var type =  Utils.parseUrlParam(window.location.href, 'type') 
					var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
					
					window.location.href = '#' + pageName+"?course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
					$('#courseAddForm button[type=reset]').click();
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
	$("#courseImportExcel").click(function(){
		$("#courseExcelFile").val('');
		$("#courseExcelFile").click();
	});
	// 同步导入
	$("#courseUploadForm").ajaxForm({
		url: _baseUrl + 'course/import',
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
	$("#courseExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#courseUploadForm").submit();
	});

/*
	// 异步导入
	$("#courseUploadForm").ajaxForm({
		url: _baseUrl + 'course/import',
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
				$("#courseAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#courseExcelFile").change(function(){
		$("#courseAlert").hide();
		$('#courseUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#courseUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#courseAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	courseListModel = new Vue({
		el: '#courseTableBlock',
		data: {
			grid: {items:[]}, 
		},
		methods: {
			formatType: function(value){
				var text = value;
				if(value == 1){
					text = '文档';
				}else if(value == 2){
					text = '视频';
				}
				return text;
			},
			formatIsExamType: function(value){
				var text = value;
				if(value == 1){
					text = '是';
				}else if(value == 2){
					text = '否';
				}else{
					text = "-"
				}
				return text;
			},
			formatSummary: function(value){
				var max = 100;
				var text = value ? value : '';
				return text.length > max ? text.substr(0, max) + '...': text;
			},
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('#courseTableBlock input[type=checkbox][pk=' + pk + ']');
				
				 
				var reviewStatus = $(e.target).parent().attr('reviewStatus');
				if(reviewStatus == 1){ 
					node.prop('checked', !node.prop('checked'));
				}
				
				if($('#courseTableBlock input[type=checkbox][pk]').length == $('#courseTableBlock input[type=checkbox][pk]:checked').length){
					$("#courseCheckAll").prop('checked', true);
				}else{
					$("#courseCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('#courseTableBlock input[type=checkbox][pk]').each(function(){ 
					if(!$(this).attr("disabled")){
						$(this).prop('checked', $(e.target).prop('checked'));
					} 
				})
			},
			goEdit: function(e){ 
				var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');  
				var page =  Utils.parseUrlParam(window.location.href, 'page') 
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var type =  Utils.parseUrlParam(window.location.href, 'type') 
				var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
				
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk')+"&course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
			},
			editPlanUser:function(e){ 
				var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');  
				var page =  Utils.parseUrlParam(window.location.href, 'page') 
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var type =  Utils.parseUrlParam(window.location.href, 'type') 
				var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear')  
				window.location.href = "#" + pageName + "?action=editPlanUser&course_id="+$(e.target).attr('pk')+"&plan_id="+$(e.target).attr('planId')+"&course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
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
				var jumpNode = $('#courseJumpNo');
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
					url: 'course/export/query',
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
				$("#courseAlert").hide();
				apiClient({
					url: 'course/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#courseAlert").show();
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
							url: 'course/export/all',
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
						$("#courseAlert").hide();
						apiClient({
							url: 'course/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#courseAlert").show();
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
	courseItemModel = new Vue({
		el: '#courseEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			clearForm: function(e){
				courseEditEditor.setContent('');
			},
			doCancel: function(e){ 
				var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');
				var page =  Utils.parseUrlParam(window.location.href, 'page') 
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var type =  Utils.parseUrlParam(window.location.href, 'type') 
				var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
				
				window.location.href = '#' + pageName+"?course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;  
				$("#courseEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 课程名称
				var courseCourseNameNode = $("#courseEditForm input[name=course_name]");
				if(courseCourseNameNode && courseCourseNameNode.length && !$.trim(courseCourseNameNode.val())){
					showToolTip(courseCourseNameNode);
					valid = false;
				}
				var trainingMonthNode = $("#courseEditForm input[name=training_month]");
				var coursePlanIdNode = $("#courseEditForm input[name=plan_id]");
				if(trainingMonthNode && trainingMonthNode.length && !$.trim(trainingMonthNode.val())){
					trainingMonthNode.attr("title","请输入开课时间");
					showToolTip(trainingMonthNode);
					valid = false;
					
				}else if($.trim(trainingMonthNode.val()).substring(0,4) != coursePlanIdNode.attr("implementYear") ){
					trainingMonthNode.attr("title","开课时间不在计划实施年度内，计划实施年度为"+coursePlanIdNode.attr("implementYear"));
					showToolTip(trainingMonthNode);
					valid = false;
				}
				// 是否考试
				var isExamNode = $("#courseEditForm input[name=is_exam]");
				if(isExamNode && isExamNode.length && !$.trim(isExamNode.val())){
					showToolTip(isExamNode);
					valid = false;
				}
				// 学时
				var courseTimeNode = $("#courseEditForm input[name=course_time]");
				if(courseTimeNode && courseTimeNode.length && !$.trim(courseTimeNode.val())){
					showToolTip(courseTimeNode);
					valid = false;
				}
				// 视频上传地址
//				var courseVideoUrlNode = $("#courseEditForm input[name=video_url]");
//				if(courseVideoUrlNode && courseVideoUrlNode.length && !$.trim(courseVideoUrlNode.val())){
//					showToolTip(courseVideoUrlNode);
//					valid = false;
//				}
				// 预览图
//				var courseImgUrlNode = $("#courseEditForm input[name=img_url]");
//				if(courseImgUrlNode && courseImgUrlNode.length && !$.trim(courseImgUrlNode.val())){
//					showToolTip(courseImgUrlNode);
//					valid = false;
//				}
//				// 课程类型
//				var courseTypeNode = $("#courseEditForm input[name=type]");
//				if(courseTypeNode && courseTypeNode.length && (!$.trim(courseTypeNode.val()) || !validator.isNumeric($.trim(courseTypeNode.val())))){
//					courseTypeNode.attr('title', '格式错误').tooltip('fixTitle');
//					showToolTip(courseTypeNode);
//					valid = false;
//				}
				// 计划ID 
				if(coursePlanIdNode && coursePlanIdNode.length && (!$.trim(coursePlanIdNode.val()) || !validator.isNumeric($.trim(coursePlanIdNode.val())))){
					coursePlanIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(coursePlanIdNode);
					valid = false;
				}
				// 课程简介
//				var courseSummaryNode = $("#courseEditEditor");
//				if(courseSummaryNode && courseSummaryNode.length && !$.trim(courseEditEditor.getContent())){
//					alert('请输入内容');
//					return false;
//				}
				$("#courseEditForm textarea[name=summary]").val(courseEditEditor.getContent());
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'course/edit',
					method: 'post',
					data: $("#courseEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading(); 
							var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');
							var page =  Utils.parseUrlParam(window.location.href, 'page') 
							var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
							var type =  Utils.parseUrlParam(window.location.href, 'type') 
							var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear')  
							window.location.href = '#' + pageName+"?course_plan_id="+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
							courseEditEditor.setContent('');
							$('#courseEditForm button[type=reset]').click();
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
			//  修改页开课时间年月
			$("#courseEditForm input[ctl-type=yearMonth]").datetimepicker({
				format: 'YYYY-MM',
				locale: 'zh-CN',
			});
			// 编辑页时间日期控件
			$("#courseEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#courseEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#courseEditForm input[ctl-type=decimal]").blur(function(){
				var value = $(this).val().replace(/[^\d\.]/g, '');
				var dotIndex = value.indexOf('.');
				if(dotIndex){
					var other = value.substr(dotIndex + 1);
					other = other.replace(/\./g, '');
					value = value.substr(0, dotIndex + 1) + other;
				}
				$(this).val(value);
			});
			debugger;
			// 预览图
			$("#editThumbnailForm").ajaxForm({
				url: _baseUrl + 'common/file/upload',
				dataType:'json',
				success: function(data, textStatus, jqXHR, form){
		//			debugger;
					if(data.code == 0){
						$('#courseEditForm img[name=thumbnail]').attr('src', data.url);
						$('#courseEditForm input[name=img_url]').val(data.url);
					}else{
						alert(data.message);
					}
				},
				error: function(){
					hideLoading();
				}
			});	
			$('#editThumbnailForm input').change(function(){
				$("#editThumbnailForm").submit();
			});
			$('#courseEditForm img[name=thumbnail]').click(function(){
				$('#editThumbnailForm input').val('');
				$('#editThumbnailForm input').click();
			});
		}
	}); 
	

	$("#userQueryButton").click(function(){
		doUserQuery();
	});
	$("#adUserQueryButton").click(function(){
		doUserAddQuery();
	});
	//點擊添加按鈕
	$("#fileSubmit").click(function(){  
		var idlist = [];
		$('#planUserAddForm  input[type=checkbox][pk]:checked').each(function(){
			idlist.push($(this).attr('pk'));
		});
		if(idlist.length==0){
			alert("请至少选择一个学员！");
			return;
		}
		doPlanUserAdd(idlist);
	});
 
});
var courseListModel, courseItemModel;
var courseAddEditor, courseEditEditor; 
var userIdListModel; 
function goAdd(){
	var pageName = getPageName();
	var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id') 
	var page =  Utils.parseUrlParam(window.location.href, 'page') 
	var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
	var type =  Utils.parseUrlParam(window.location.href, 'type') 
	var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
	
	window.location.href = '#' + pageName + '?action=add&course_plan_id='+planId+"&page="+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){ 
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var planId = Utils.parseUrlParam(window.location.href, 'course_plan_id');
	apiClient({
		url: 'course/getPlanDeatil',
		data: {plan_id:planId},
		success: function(data){
			if(data.code == 0){ 	 
				$("#showPlanName").html(data.model.planName) 
				$("#safety_regulation").html(data.model.safetyRegulation); 
				if(data.model.type==2){
					$("#addCourse").hide();
				}else{ 
					$("#addCourse").show();
				}
			}	 
		}, 	
	});
	
	if(!action){
		showLoading('正在查询...');
	} 
	apiClient({
		url: 'course/search',
		data: $("#courseQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){ 	
				$('#courseTable input[type=checkbox]').prop('checked', false);
				courseListModel.grid.items = data.model; 
				$("#courseTableBlock").show();
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
 * 删除计划学员记录
 * @param {Array} ids	记录主键id
 */
function doPlanUserDelete(ids, message){
	var message = message ? message : '是要否删除当前行？';
	if(ids && ids.length){
		bootbox.confirm(message, function(result){
			if(result){
				showLoading('正在删除...');
				apiClient({
					url: 'planUser/delete?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							hideLoading();
							doUserQuery();
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
					url: 'course/delete?id=' + ids.join(','),
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
function loadCourseItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'course/edit',
			data: {id:id},
			success: function(data){
				$("#courseEditBlock").show();
				if(data.code == 0 && data.model){
					courseItemModel.model = data.model;
					try{
						courseEditEditor.setContent(data.model.summary ? data.model.summary : '');
					}catch(e){
						courseEditEditor.addListener('ready', function(){
							courseEditEditor.setContent(data.model.summary ? data.model.summary : '');
							courseEditEditor.removeListener('ready');
						});
					}
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
 * 查询
 * @param {Integer} page	页码
 */
function doUserQuery(){ 
	showLoading('正在查询...');  
	
	apiClient({
		url: 'planUser/eidtPlanUser',
		data: $("#planUserEditForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#userIdList input[type=checkbox]').prop('checked', false);
				planUserItemModel.model = data.model; 
				planUserItemAddModel.model = data.model; 
				hideLoading();
			}
		}
	});
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doUserAddQuery(){  
	showLoading('正在查询...');  
	apiClient({
		url: 'planUser/eidtPlanUser',
		data: $("#planUserAddForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#userIdList input[type=checkbox]').prop('checked', false);
				planUserItemAddModel.model = data.model; 
				hideLoading();
			}
		}
	});
}


/**
 * 添加計劃用戶
 * @param {Integer} page	页码
 */
function doPlanUserAdd(idList){  
	var course_id = $("#planUserAddForm input[name=course_id]").val();
	var plan_id = $("#planUserAddForm input[name=plan_id]").val();
	apiClient({
		url: 'planUser/add',
		data: {course_id:course_id,plan_id:plan_id,user_id:idList.join(',')},
		type:"post",
		success: function(data){
			if(data.code == 0){
				$('#userIdList input[type=checkbox]').prop('checked', false);
				planUserItemAddModel.model = data.model; 
				planUserItemModel.model = data.model; 
				$("#closeFileSubmimt").click();
				doUserQuery();
			}
		}
	});
}

/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var course_id =  Utils.parseUrlParam(window.location.href, 'course_id');
	var plan_id =  Utils.parseUrlParam(window.location.href, 'plan_id');
	var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');  
	  
	$("#courseQueryForm input[name=plan_id]").val(planId);
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action){
		// 根据用户动作显示相应画面 
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			apiClient({
				url: 'plan/edit',
				data:{id:$("#courseQueryForm input[name=plan_id]").val()},
				success: function(data){
					if(data.code == 0){
						$("#courseAddForm input[name=plan_name]").val(data.model.planName);
						$("#courseAddForm input[name=plan_id]").attr("implementYear",data.model.implementYear);
						$("#courseAddForm input[name=plan_id]").val(data.model.id);
//						palnIdListModel.items = data.model;
					}
				} 
			})
		}else if(action == 'edit'){
			loadCourseItem();
		}else if(action == 'editPlanUser'){ 
			$('#back').show();
			var planId =  Utils.parseUrlParam(window.location.href, 'course_plan_id');
			var page =  Utils.parseUrlParam(window.location.href, 'page') 
			var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
			var type =  Utils.parseUrlParam(window.location.href, 'type') 
			var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
			var url = '#course?course_plan_id='+planId+'&page='+page+'&planName='+planName+'&type='+type+'&implementYear='+implementYear;
			
			$('#back').attr('href',url);
			$('#back').click(function(){
				$('#back').hide();
			});
			
			showLoading('正在加载...');
			$("div[action=eidtPlanUser]").hide();
			apiClient({
				url: 'planUser/eidtPlanUser',
				data: {course_id:course_id,plan_id:plan_id},
				success: function(data){
					$("#planUserEditBlock").show();
					if(data.code == 0 && data.model){
						planUserItemModel.model = data.model;
						planUserItemAddModel.model = data.model;
						
					}else{
						alert(data.message);
					}
				},
				complete: function(){
					$("div[action=eidtPlanUser]").show();
					hideLoading();
				}
			});
		}
	} else {
		$('#back').show();
		var page =  Utils.parseUrlParam(window.location.href, 'page') 
		var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
		var type =  Utils.parseUrlParam(window.location.href, 'type') 
		var implementYear =  Utils.parseUrlParam(window.location.href, 'implementYear') 
		var url = '#plan?page='+page+"&planName="+planName+"&type="+type+"&implementYear="+implementYear;
		
		$('#back').attr('href',url);
		$('#back').click(function(){
			$('#back').hide();
		});
		
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	} 
}

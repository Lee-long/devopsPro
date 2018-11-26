
//@ sourceURL=period.js
$(function(){
	var pageName = getPageName();
	
	// 查询条件日期控件
	$("#periodQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#periodAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#periodAddForm input[ctl-type=datetime]").datetimepicker({
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

	// 点击添加按鈕
	$("#fileSubmit").click(function(){    
		var idlist = [];
		$('#outUserTableForm  input[type=checkbox][pk]:checked').each(function(){
			idlist.push($(this).attr('pk'));
		});
		if(idlist.length == 0){
			alert("请选择至少一个学员！");
			return ;
		}
		doPlanUserAdd(idlist);
	});
	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#periodQueryForm button[type="button"][name=periodQueryButton]').click(function(){
		doQuery();
	});

	// 查询按钮
	$('#periodEditForm button[type="button"][name=userQueryButton]').click(function(){
		doUserQuery(1);
	});
	// 导出按钮
	$('#periodQueryForm button[type="button"][name=periodExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#periodQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'period/export/all',
					data: $("#periodQueryForm").serialize(),
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
	
	// 导入文件
	$("#periodImportExcel").click(function(){
		$("#periodExcelFile").val('');
		$("#periodExcelFile").click();
	});
	// 同步导入
	$("#periodUploadForm").ajaxForm({
		url: _baseUrl + 'period/import',
		dataType:'json', 
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
	$("#periodExcelFile").change(function(){
		showLoading('正在导入...'); 
		$("#periodUploadForm").submit();
	});

 

	var taskHintModel = new Vue({
		el: '#periodAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	periodListModel = new Vue({
		el: '#periodTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatUser: function(value){
				if(value.length>5){
					return value[0].loginName+'等'+value.length+'人';
				}else if(value.length > 0){
					var text = value[0].loginName;
					for (var i = 1; i < value.length; i++){
						text += ',' + value[i].loginName
					}
					return text;
				}
			},
			formatDate: function(value){
				if(value){ 
					return moment(value).format('YYYY-MM-DD HH:mm');
				}else{
					return "";
				}
				
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var implementationStatus = $(e.target).parent().attr('implementationStatus');
				var node = $('#periodTableBlock input[type=checkbox][pk=' + pk + ']');  
				if(implementationStatus!=2){ 
					node.prop('checked', !node.prop('checked'));

					if($('#periodTableBlock  input[type=checkbox][pk]').length == $('#periodTableBlock   input[type=checkbox][pk]:checked').length){
						$("#periodTableBlock    #periodCheckAll").prop('checked', true);
					}else{
						$("#periodTableBlock   #periodCheckAll").prop('checked', false);
					}
				}
			},
			checkAll: function(e){

				$('#periodTableBlock   input[type=checkbox][pk]').each(function(){ 
					if(!$(this).attr("disabled")){
						$(this).prop('checked', $(e.target).prop('checked'));
					} 
				}) 	
			},
			doExecute: function(e){  
				doExecute([$(e.target).attr('course_id')],[$(e.target).attr('pk')],[$(e.target).attr('userdetails')]);
			},
			goEdit: function(e){
				var courseId = Utils.parseUrlParam(window.location.href, 'courseId');
				var page = Utils.parseUrlParam(window.location.href, 'page');
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth') 
				window.location.href = "#" + pageName + "?courseId=" + courseId+"&action=add&periodId=" + $(e.target).attr('pk')+"&page="+page+"&planName="+planName+"&trainingMonth="+trainingMonth;
			},
			addPeriodUser:function(e){
				var courseId = Utils.parseUrlParam(window.location.href, 'courseId'); 
				var page = Utils.parseUrlParam(window.location.href, 'page');
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth') 
				window.location.href = "#" + pageName + "?courseId=" + courseId+"&action=addPeriodUser&periodId=" + $(e.target).attr('pk')+"&page="+page+"&planName="+planName+"&trainingMonth="+trainingMonth;
			
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
				var jumpNode = $('#periodJumpNo');
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
					url: 'period/export/query',
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
				$("#periodAlert").hide();
				apiClient({
					url: 'period/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#periodAlert").show();
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
							url: 'period/export/all',
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
						$("#periodAlert").hide();
						apiClient({
							url: 'period/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#periodAlert").show();
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
	periodItemModel = new Vue({
		el: '#periodForm',
		data: {
			model: {}
		},
		methods: {
			checkRow: function(e){ 
				var pk = $(e.target).parent().attr('pk');
				var node = $('#periodForm input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('#periodForm input[type=checkbox][pk]').length == $('#periodForm input[type=checkbox][pk]:checked').length){
					$("#periodForm #userCheckAll").prop('checked', true);
				}else{
					$("#periodForm #userCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('#periodForm input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			formatDate: function(value){
				if(value){ 
					return moment(value).format('YYYY-MM-DD HH:mm');
				}else{
					return "";
				}
			}
		},
		mounted: function(){
			// 编辑页日期控件
			$("#periodForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#periodForm input[ctl-type=datetime]").datetimepicker({
				format: 'YYYY-MM-DD HH:mm',
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
		}
	});


	// 编辑回显model
	periodAddItemModel = new Vue({
		el: '#periodAddBlock',
		data: {
			model: {}
		},
		methods: {
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('#periodAddForm input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('#periodAddForm input[type=checkbox][pk]').length == $('#periodAddForm input[type=checkbox][pk]:checked').length){
					$("#periodAddForm #userCheckAll").prop('checked', true);
				}else{
					$("#periodAddForm #userCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('#periodAddForm input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			formatDate: function(value){
				if(value){ 
					return moment(value).format('YYYY-MM-DD HH:mm');
				}else{
					return "";
				}
			},
			doSubmit: function(e){
				doSubmit();
			},
			doCancel: function(e){
				var courseId = Utils.parseUrlParam(window.location.href, 'courseId');
				var page = Utils.parseUrlParam(window.location.href, 'page');	 
				var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
				var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth')    
			  	window.location.href = '#' + pageName+'?courseId='+courseId+"&page="+page+"&planName="+planName+"&trainingMonth="+trainingMonth;
				$("#periodAddForm button[type=reset]").click();
			}
		},
		mounted: function(){
			// 编辑页日期控件
			$("#periodAddForm  input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#periodAddForm  input[ctl-type=datetime]").datetimepicker({
				format: 'YYYY-MM-DD HH:mm',
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
		}
	});

	
	// 编辑回显model
	periodOutItemModel = new Vue({
		el: '#periodOutForm',
		data: {
			model: {}
		},  
		methods:{
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('#periodOutForm input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('#periodOutForm input[type=checkbox][pk]').length == $('#periodOutForm input[type=checkbox][pk]:checked').length){
					$("#periodOutForm #userCheckAll").prop('checked', true);
				}else{
					$("#periodOutForm #userCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('#periodOutForm input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
		}
	}); 
	
	$("#searchUserButton").click(function(e){
		doUserQuery(1);
	});

	$("#searchOutUserButton").click(function(e){
		doUserQuery(2);
	});
	
	userTableModel = new Vue({
		el: '#userTableForm',
		data: {
			/*checkedAll: false,
			checkModel: [],*/
			grid: {items:[]}
		},
		methods: {
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('#userTableForm input[type=checkbox][pk=' + pk + ']'); 
				var completeStatus = $(e.target).parent().attr('completeStatus');
				if(completeStatus != 1){ 
					node.prop('checked', !node.prop('checked'));
				} 
				if($('#userTableForm input[type=checkbox][pk]').length == $('#userTableForm input[type=checkbox][pk]:checked').length){
					$("#userTableForm #userCheckAll").prop('checked', true);
				}else{
					$("#userTableForm #userCheckAll").prop('checked', false);
				}
			}, 
			deleteRows: function(e){
				var ids = [];
				$('#userTableForm  input[type=checkbox][pk]:checked').each(function(){
					ids.push($(this).attr('pk'));
				});
				
				doUserDelete(ids, '是否要删除选中行？');
			},
			checkAll: function(e){
				$('#userTableForm input[type=checkbox][pk]:not(:disabled)').prop('checked', $(e.target).prop('checked'));
			},
			formatDate: function(value){
				if(value){ 
					return moment(value).format('YYYY-MM-DD HH:mm');
				}else{
					return "";
				}
			}
		}
		/*,
		watch: {
			checkModel: {
				handler() {
					if(this.checkModel.length = this.grid.items.length) {
						this.checkedAll = true;
					} else {
						this.checkedAll = false;
					}
					deep: true
				}
			}
		}*/
	});
	

	outUserTableModel = new Vue({
		el: '#outUserTableForm',
		data: {
			grid: {items:[]}
		},
		methods: {
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('#outUserTableForm input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('#outUserTableForm input[type=checkbox][pk]').length == $('#outUserTableForm input[type=checkbox][pk]:checked').length){
					$("#outUserTableForm #userCheckAll").prop('checked', true);
				}else{
					$("#outUserTableForm #userCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('#outUserTableForm input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			formatDate: function(value){
				if(value){ 
					return moment(value).format('YYYY-MM-DD HH:mm');
				}else{
					return "";
				}
			}
		}
	})
})

var periodListModel,periodAddItemModel, periodItemModel,periodOutItemModel,userTableModel,outUserTableModel;

/**
 * 实施
 * @param {Array} ids	记录主键id
 */
function doExecute(ids,period_id,userDetails, message){
	if(userDetails==null || userDetails.length==0 || userDetails[0].trim()==''){
		alert("该期次未添加参培人员，不能实施。");
		return;
	}
	
	var message = message ? message : '是要否实施当前计划？';
	if(ids && ids.length){
		bootbox.confirm(message, function(result){
			if(result){
				showLoading('正在实施...');
				apiClient({
					url: 'implementation/execute?id=' + ids.join(',')+"&period_id="+period_id,
					type: 'post',
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
};
function goAdd(){
	var courseId = Utils.parseUrlParam(window.location.href, 'courseId'); 
	var planName =  Utils.parseUrlParam(window.location.href, 'planName') ;
	var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth');  
	var pageName = getPageName();
	window.location.href = '#' + pageName + '?courseId=' + courseId	 + '&action=add'+"&planName="+planName+"&trainingMonth="+trainingMonth;;
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
	
	var courseId = Utils.parseUrlParam(window.location.href, 'courseId'); 
	$("#periodQueryForm input[name=course_id]").val(courseId);
 
	apiClient({
		url: 'period/search',
		data: $("#periodQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#periodTable input[type=checkbox]').prop('checked', false);
				periodListModel.grid.items = data.model;
				if(data.model!=null && data.model.length!=0){
					$("#planCourse").html(data.model[0].planName+" > "+data.model[0].courseName);
				}else{
					apiClient({
						url: 'period/getPlanCourse',
						data: $("#periodQueryForm").serialize(),
						success: function(data){
							if(data.code == 0){ 
								$("#planCourse").html(data.model.planName+" > "+data.model.courseName); 
							}else{
								alert(data.message);
							}
						} 
					});
				}
				$("#periodTableBlock").show();
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
	});
}
 
/**
 * 查询
 * @param {Integer} page	页码
 */
function doUserQuery(searchFLg){ 
	showLoading('正在查询...');  
	
	var periodId = Utils.parseUrlParam(window.location.href, 'periodId');
	var courseId = Utils.parseUrlParam(window.location.href, 'courseId');
	var orgId1 = $("#periodForm [name=org_id]").val();
	var positionId1 = $("#periodForm [name=position_id]").val();
	var	orgId2 = $("#periodOutForm [name=org_id]").val();
	var	positionId2 = $("#periodOutForm [name=position_id]").val();
 
	apiClient({
		url: 'period/getTrainingUser',
		type:"post",
		data:{periodId:periodId,orgId1:orgId1,orgId2:orgId2,positionId1:positionId1,positionId2:positionId2,courseId:courseId,searchFlg:searchFLg},
		success: function(data){
			if(data.code == 0){    
				outUserTableModel.grid.items = data.model.outTrainingUserList;  
				userTableModel.grid.items = data.model.trainingUserList; 
				$('#userTableForm input[type=checkbox]').prop('checked', false);
				$('#outUserTableForm input[type=checkbox]').prop('checked', false);
			} else {
				alert(data.message);
			}
		},
		complete: function(){
			hideLoading();
		}
	});
} 

//新增记录提交
function doSubmit() {
	var valid = true;

	// 期次名称
	var nameNode = $("#periodAddForm input[name=name]");
	if(nameNode && nameNode.length && !$.trim(nameNode.val())){
		showToolTip(nameNode);
		valid = false;
	}
	
	// 受训开始时间
	var trainingTimeStartNode = $("#periodAddForm input[name=training_time_start]");
	if(trainingTimeStartNode && trainingTimeStartNode.length && !$.trim(trainingTimeStartNode.val())){
		showToolTip(trainingTimeStartNode);
		valid = false;
	}
	
	// 受训结束时间
	var trainingTimeEndNode = $("#periodAddForm input[name=training_time_end]");
	if(trainingTimeEndNode && trainingTimeEndNode.length && !$.trim(trainingTimeEndNode.val())){
		showToolTip(trainingTimeEndNode);
		valid = false;
	}
	
	if(trainingTimeStartNode.val() && trainingTimeEndNode.val()) {
		var startDate = new Date(trainingTimeStartNode.val().replace(/-/g,"\/"));
		var endDate = new Date(trainingTimeEndNode.val().replace(/-/g,"\/"));
		if(startDate>=endDate) {
			alert('受训结束时间应该晚于开始时间');
			valid = false;
		}
	} 
	
	if(!valid){
		return valid;
	}
	
	showLoading('正在保存...');
	
	var id = Utils.parseUrlParam(window.location.href, 'periodId');  
	if(id!='') {
		apiClient({
			url: 'period/edit',
			method: 'post',
			data: $("#periodAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$('#periodAddForm button[type=reset]').click();
					var courseId = Utils.parseUrlParam(window.location.href, 'courseId'); 
					var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
					var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth') 
					var pageName = getPageName();
					window.location.href = '#' + pageName + '?courseId=' + courseId+"&planName="+planName+"&trainingMonth="+trainingMonth;
				}else{
					var regExp = new RegExp('rn', 'g'); 
					message = data.message.replace(regExp, '<br>');
					alert(message);
					hideLoading();
				}
			},
			error: function(){
				hideLoading();
			}
		})
	} else {
		apiClient({
			url: 'period/add',
			method: 'post',
			data: $("#periodAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$('#periodAddForm button[type=reset]').click();
					var courseId = Utils.parseUrlParam(window.location.href, 'courseId'); 
					var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
					var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth') 
					var pageName = getPageName();
					window.location.href = '#' + pageName + '?courseId=' + courseId+"&planName="+planName+"&trainingMonth="+trainingMonth;;
				}else{
					var regExp = new RegExp('rn', 'g'); 
					message = data.message.replace(regExp, '<br>');
					alert(message);
					hideLoading();
				}
			},
			error: function(){
				hideLoading();
			}
		})
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
					url: 'period/delete?id=' + ids.join(','),
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
 * 删除记录
 * @param {Array} ids	记录主键id
 */
function doUserDelete(ids, message){
	var message = message ? message : '是要否删除当前行？';
	if(ids && ids.length){
		bootbox.confirm(message, function(result){
			if(result){
				showLoading('正在删除...');
				apiClient({
					url: 'period/deleteUser?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							hideLoading();
							doUserQuery(1);
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
function loadPeriodItem(){
	showLoading('正在加载...'); 
 
	var action = Utils.parseUrlParam(window.location.href, 'action'); 

	var courseId = Utils.parseUrlParam(window.location.href, 'courseId');  
	var periodId = Utils.parseUrlParam(window.location.href, 'periodId');  
	apiClient({
		url: 'period/open?courseId=' + courseId +'&periodId=' + periodId,
		success: function(data){
			if(data.code == 0 && data.model){ 
				debugger;
				//编辑时form
				periodItemModel.model = data.model;
				//新建期次form
				periodAddItemModel.model = data.model;
				
				periodOutItemModel.model = data.model;
				userTableModel.grid.items = data.model.trainingUserList;
				outUserTableModel.grid.items = data.model.outTrainingUserList;
				$('#userTableForm input[type=checkbox]').prop('checked', false);
				$('#outUserTableForm input[type=checkbox]').prop('checked', false);
			}else{
				alert(data.message);
			}
		},
		complete: function(){ 
			$("div[action="+action+"]").show(); 
			hideLoading();
		}
	}); 
	
}
function addPeriodUser(){
	showLoading('正在加载...'); 
	var periodId = Utils.parseUrlParam(window.location.href, 'periodId'); 
	var action = Utils.parseUrlParam(window.location.href, 'action'); 
	apiClient({
		url: 'period/edit',
		data: {id:periodId},
		success: function(data){ 
			if(data.code == 0 && data.model){ 
				periodItemModel.model = data.model;
				periodAddItemModel.model = data.model;
				
				periodOutItemModel.model = data.model;
				userTableModel.grid.items = data.model.trainingUserList;
				outUserTableModel.grid.items = data.model.outTrainingUserList;
				$('#userTableForm input[type=checkbox]').prop('checked', false);
				$('#outUserTableForm input[type=checkbox]').prop('checked', false);
				
			}else{
				alert(data.message);
			}
		},
		complete: function(){
			$("div[action="+action+"]").show();
			hideLoading();
		}
	}); 
}
function doPlanUserAdd(ids){ 
	var periodId = Utils.parseUrlParam(window.location.href, 'periodId'); 
	apiClient({
		url: 'period/addUser',
		data: {period_id:periodId,id:ids.join(',')},
		type:"post",
		success: function(data){
			if(data.code == 0){
				$('#userIdList input[type=checkbox]').prop('checked', false); 
				$("#closeFileSubmimt").click();
				doUserQuery(1);
			}else{
				var regExp = new RegExp('rn', 'g'); 
				message = data.message.replace(regExp, '<br>');
				alert(message);
				hideLoading();
			}
		}
	});
}

/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action=="add"){
		// 根据用户动作显示相应画面
		
		$('#back').show();
		var courseId =  Utils.parseUrlParam(window.location.href, 'courseId');
		var pageName = getPageName();
		$('#back').attr('href','#' + pageName+"?courseId="+courseId);
		
		$('div[action]').hide();   
		$('div[action=add]').show(); 
		loadPeriodItem();
	}else if(action=='addPeriodUser'){  
		
		$('#back').show();
		var courseId =  Utils.parseUrlParam(window.location.href, 'courseId'); 
		var pageName = getPageName();
		var page = Utils.parseUrlParam(window.location.href, 'page'); 
		var planName =  Utils.parseUrlParam(window.location.href, 'planName') 
		var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth')    
		var url = '#' + pageName+"?courseId="+courseId+"&page="+page+"&planName="+planName+"&trainingMonth="+trainingMonth;
		$('#back').attr('href', url);
		
		$('div[action]').hide(); 
		$('div[action=addPeriodUser]').show();  
		addPeriodUser();
		
	}else{
		$('#back').show();
		var page = Utils.parseUrlParam(window.location.href, 'page'); 
		var planName =  Utils.parseUrlParam(window.location.href, 'planName');
		var trainingMonth =  Utils.parseUrlParam(window.location.href, 'trainingMonth');
		var url = "#implementation?page="+page+"&planName="+planName+"&trainingMonth="+trainingMonth;
		
		$('#back').attr('href',url);
		$('#back').click(function(){
			$('#back').hide();
		})
		$('div[action]').hide(); 
		$('div[action=query]').show(); 
		doQuery();
	}
}

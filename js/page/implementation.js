
//@ sourceURL=implementation.js
$(function(){
	var pageName = getPageName();

	ids = new Vue({ 
		　　el:"#ids", 
		　　data:{ 
		　　　　idList:[]//数组类型
		　　} 　
	});
	
	
	// 查询条件日期控件
	$("#implementationQueryForm input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});
	
	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	var myDate = new Date;
    var year = myDate.getFullYear();//获取当前年
//    var month = myDate.getMonth()+1;//获取当前月
//    var traningMonth = year+"-"+(month<10?"0"+month:month);
    $("#implementationQueryForm input[ctl-type=year]").val(year);
    
	// 取消按钮
	$('#implementationCancelButton').click(function(){
		$('#implementationAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
		ids.idList = [];
	});
	// 重置按钮 
	$("#searchReset").click(function(){
		var myDate = new Date;
	    var year = myDate.getFullYear();//获取当前年
//	    var month = myDate.getMonth()+1;//获取当前月
//	    var traningMonth = year+"-"+(month<10?"0"+month:month);
	    $("#implementationQueryForm input[name=plan_name]").val("");
	    $("#implementationQueryForm input[ctl-type=year]").val(year);
	});
	// 查询按钮
	$('#implementationQueryForm button[type="button"][name=implementationQueryButton]').click(function(){
		doQuery();
	});

	// 新增记录提交
	$('#implementationButton').click(function(){
		debugger;
		showLoading('正在保存...');
		
		apiClient({
			url: 'implementation/search',
			method: 'post',
			data: $("#implementationForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#implementationQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#implementationForm button[type=reset]').click();
				}else{
					hideLoading();
					alert(data.message);
				}
			},
			error: function(){
				hideLoading();
			},
			complete: function() {
				ids.idList = [];
			}
		})
	});
	
	// 查询结果model
	implementationListModel = new Vue({
		el: '#implementationTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatName: function(value){
				if(value == null){
					return '——';
				} else {
					return value;
				}
			},
			formatExam: function(value){
				if(value == null){
					return '——';
				} else if(value == 1){
					return "考试";
				}else if(value == 2){
					return "免试";
				}
			},
			formatType: function(value){
				if(value == 1){
					return '内训';
				}else if(value == 2){
					return '外训';
				}
			},
			formartColor:function(implementationStatus,courseStatus){  
				 if(implementationStatus==2){  
					return "color:#080808" //黑色
				}else {
					if(courseStatus == 1 ){
						return "color:#A3A3A3"; //灰色
					}else if(courseStatus == 2){
						return "color:#FF4500"; //红色
					}else{
						return "color:#EE9A00"//黄色
					}
				}
			},
			formartCousrseColor:function(noPeriodUserCount,coursePeriodsStatus,courseStatus){ 
				  if(noPeriodUserCount == 0 && coursePeriodsStatus==1){  
						return "color:	#080808;text-decoration:underline !important;"
					}else{
						if(courseStatus == 1 ){
							return "color:#A3A3A3;text-decoration:underline !important;";
						}else if(courseStatus == 2){
							return "color:#FF4500;text-decoration:underline !important;";
						}else{
							return "color:#EE9A00;text-decoration:underline !important;"
						}
					}
			},

			formartOrgColor:function(noPeriodUserCount,coursePeriodsStatus,courseStatus){ 
				  if(noPeriodUserCount == 0 && coursePeriodsStatus==1){  
						return "color:	#080808 !important;"
					}else{
						if(courseStatus == 1 ){
							return "color:#A3A3A3 !important;";
						}else if(courseStatus == 2){
							return "color:#FF4500 !important;";
						}else{
							return "color:#EE9A00 !important;"
						}
					}
			},
			formatUser: function(value){
				debugger;
				if(value.length>5){
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
				return moment(value).format('YYYY.MM.DD HH:mm');
			},
			goPeriod: function(value){
				debugger;
				var courseId =  value;
				var page = $("#implementationQueryForm input[name=page]").val(); 
				var planName = $("#implementationQueryForm input[name=plan_name]").val(); 
				var trainingMonth = $("#implementationQueryForm input[name=training_month]").val(); 
				window.location.href = "#period?courseId="+courseId+"&page="+page+"&planName="+planName+"&trainingMonth="+trainingMonth;
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#implementationCheckAll").prop('checked', true);
				}else{
					$("#implementationCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			doExecute: function(e){ 
				doExecute([$(e.target).attr('pk')],[$(e.target).attr('period_id')]);
			},
			auditRows: function(e){
				$('input[type=checkbox][pk]:checked').each(function(){
					ids.idList.push($(this).attr('pk'));
				});
				if(ids.idList && ids.idList.length) {
					window.location.href = "#" + pageName + "?action=audit";
					
					// 根据用户动作显示相应画面
					$('div[action]').hide();
					$('div[action="audit"]').show();
				}
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
				var jumpNode = $('#implementationJumpNo');
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
			}
		},
		mounted: function(){ 
		}
	});
//	  vm.$watch('tds',function(val){
//	        vm.$nextTick(function() {
// 
//				$("#implementationTable td[name=indexTd]").width($("#implementationTable th[name=indexTh]").width());
//				$("#implementationTable td[name=planTd]").width($("#implementationTable th[name=planTh]").width());
//				$("#implementationTable td[name=typeTd]").width($("#implementationTable th[name=typeTh]").width());
//				$("#implementationTable td[name=courseTd]").width($("#implementationTable th[name=courseTh]").width());
//				$("#implementationTable td[name=orgTd]").width($("#implementationTable th[name=orgTh]").width());
//				$("#implementationTable td[name=peroidTd]").width($("#implementationTable th[name=peroidTh]").width());
//				$("#implementationTable td[name=doTd]").width($("#implementationTable th[name=doTh]").width());
//	        });
//
//	  });
})

 
var implementationListModel;
var ids;

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	// 计划实施年度 
	var trainingMonth = $("#implementationQueryForm input[name=training_month]");
	if(trainingMonth && trainingMonth.length && !$.trim(trainingMonth.val())){ 
		showToolTip(trainingMonth);
		return;
	}
	
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#implementationQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#implementationRefreshRows").val();
	$("#implementationQueryForm input[name='rows']").val(rows ? rows : 10); 
	
	
	
	apiClient({
		url: 'implementation/search',
		data: $("#implementationQueryForm").serialize(),
		success: function(data){
			debugger;
			if(data.code == 0){
				$('#implementationTable input[type=checkbox]').prop('checked', false);
				implementationListModel.grid = data;
				$("#implementationTableBlock").show();
			}else{
				alert(data.message);
			}
		},
		complete: function(){
			$('#implementationTable input[type=checkbox][pk]').prop('checked', false);
			if(!action){
				hideLoading();
			}
		}
	})
}

/**
 * 实施
 * @param {Array} ids	记录主键id
 */
function doExecute(ids,period_id, message){
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
}
/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var page = Utils.parseUrlParam(window.location.href, 'page');
	
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		var planName = Utils.parseUrlParam(window.location.href, 'planName');
		$("#implementationQueryForm input[name='plan_name']").val(planName);
		
		var trainingMonth = Utils.parseUrlParam(window.location.href, 'trainingMonth');
		if(trainingMonth) {
			$("#implementationQueryForm input[name='training_month']").val(trainingMonth);
		}
		doQuery(page);
	}
}


//@ sourceURL=progressMonitoring.js
$(function(){
	var pageName = getPageName();

	ids = new Vue({ 
		　　el:"#ids", 
		　　data:{ 
		　　　　idList:[]//数组类型
		　　} 　
	});
	
	
	// 查询条件日期控件
	$("#progressMonitoringQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM',
		locale: 'zh-CN',
	});
	
	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	var myDate = new Date;
    var year = myDate.getFullYear();//获取当前年
    var month = myDate.getMonth()+1;//获取当前月
    var traningMonth = year+"-"+(month<10?"0"+month:month);
    $("#progressMonitoringQueryForm input[name=training_month]").val(traningMonth);
    $("#triMonth").html(traningMonth);
	$("#searchReset").click(function(){
		var myDate = new Date;
	    var year = myDate.getFullYear();//获取当前年
	    var month = myDate.getMonth()+1;//获取当前月
	    var traningMonth = year+"-"+(month<10?"0"+month:month);
	    $("#progressMonitoringQueryForm input[name=training_month]").val(traningMonth);
	    $("#progressMonitoringQueryForm input[name=plan_name]").val(""); 
	});
	// 查询按钮
	$('#progressMonitoringQueryForm button[type="button"][name=progressMonitoringQueryButton]').click(function(){
		var training_month = $("#progressMonitoringQueryForm input[name=training_month]");
		if( $("#progressMonitoringQueryForm input[name=training_month]").val()==""){
			showToolTip(training_month);
			return; 
		}  
	    ;
	    $("#triMonth").html($("#progressMonitoringQueryForm input[name=training_month]").val());
		doQuery();
	});
 
	// 查询结果model
	progressMonitoringListModel = new Vue({
		el: '#progressMonitoringTableBlock',
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
			formatRate: function(value){
				if(value == null){
					return '0.00%';
				}else {
					var rate =(value*100).toFixed(2) +"%";
					return rate; 
				}
			},
			formartStyle:function(rate){
				if(rate == null){
					rate = 0;
				}else {
					rate =(rate*100).toFixed(2) ; 
				}
				var style = "position: absolute;font-size:11px;top:0;width:100%;text-align:center";
				if(rate<=25){
					style = style+";color:#DC143C";
				}else if(rate>25 && rate <= 75){
					style=style+";color:navy"
				}else{
					style = style+";color:#00FF7F";
				}
				return style;
			}, 
			formatProcessRate: function(value){
				var rate;
				 if(value == null){
					 rate = 0.00;
				}else {
					 rate =(value*100).toFixed(2);  
				}
				var style = "width:"+rate+"%";
				if(rate<=25){
					style = style+";background-color:#fb6f6f";
				}else if(rate>25 && rate <= 75){
					style=style+";background-color:#66a9bd"
				}else{
					style = style+";background-color:#77ca77";
				}
				return style;
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
			showUncompletePeriodPersion:function(orgId,periodId){
				 $("#unCompleteTable").html("");
				 $("#myModalLabel").html("期次未完成人员列表"); 
				  apiClient({
						url: 'implementation/getPeriodUnCompleteUsers',
						data:{period_id:periodId,org_id:orgId},
						success: function(data){ 
							if(data.code == 0){
								 var th ="<thead> <tr><th>工号</th><th>用户</th><th>部门</th><th>期次名称</th><th>受训开始时间</th><th>受训结束时间</th></tr></thead>";
								 var td = "<tbody>";
								 if(data.model.length==0){
									 td= td+"<tr style='text-align'><td  style='text-align:center' colspan='6'> 没有查询到相对应的有效数据！</td></tr></tbody>"
								  }else{
									  for(var i=0 ;i<data.model.length;i++){
										  td=td+"<tr><td>"+data.model[i].jobNo +"</td>" +"<td>"+data.model[i].loginName +"</td>"+ "<td>"+data.model[i].orgName+ "<td>"+data.model[i].periodName +"</td>"+ "<td>"+data.model[i].trainingTimeStart +"</td>"+"<td>"+data.model[i].trainingTimeEnd +"</td></tr>";
									  }
									 
									  td=td+"</tbody>"
								  }
								 $("#unCompleteTable").append(th).append(td);
							}else{
								alert(data.message);
							}
						} 
					});
			}, 
			showUncompleteOrgPeriod:function(courseId,orgId){
				 $("#unCompleteTable").html("");
				 $("#myModalLabel").html("课程未完成期次列表");
				 var training_month = $("#progressMonitoringQueryForm input[name=training_month]").val();
				  apiClient({
						url: 'implementation/getOrgUnCompletePeriods',
						data:{course_id:courseId,org_id:orgId,training_month:training_month},
						success: function(data){ 
							if(data.code == 0){
								 var th ="<thead> <tr><th>课程名称</th><th>期次名称</th><th>受训开始时间</th><th>受训结束时间</th><th>地点</th></tr></thead>";
								 var td = "<tbody>";
								 if(data.model.length==0){
									 td= td+"<tr style='text-align'><td  style='text-align:center' colspan='5'> 没有查询到相对应的有效数据！</td></tr></tbody>"
									 
								 }else{
									  for(var i=0 ;i<data.model.length;i++){
										  td=td+"<tr><td>"+data.model[i].courseName+"</td><td>"+data.model[i].name+"</td><td>"+moment(data.model[i].trainingTimeStart).format('YYYY.MM.DD HH:mm')  +"</td>"+"<td>"+moment(data.model[i].trainingTimeEnd).format('YYYY.MM.DD HH:mm')  +"</td>";
										  if(data.model[i].planType==1){
											  td = td+"<td>"+data.model[i].boardroomName+"</td></tr>";
										  }else{ 
											  td = td+"<td>"+data.model[i].trainingLocation+"</td></tr>";
										  }
									  }
									  td=td+"</tbody>"
								  }
								 $("#unCompleteTable").append(th).append(td);
							}else{
								alert(data.message);
							}
						} 
					});
			}, 
			showUncompleteOrgPersion:function(courseId,orgId){
				$("#unCompleteTable").html("");
				 $("#myModalLabel").html("部门未完成人员列表");
				 var training_month = $("#progressMonitoringQueryForm input[name=training_month]").val();
				  apiClient({
						url: 'implementation/getOrgUnCompleteUsers',
						data:{course_id:courseId,org_id:orgId,training_month:training_month},
						success: function(data){ 
							if(data.code == 0){
								 var th ="<thead> <tr><th>工号</th><th>用户</th><th>部门</th><th>期次名称</th> <th>受训开始时间</th><th>受训结束时间</th></tr></thead>";
								 var td = "<tbody>";
								 if(data.model.length==0){
									 td= td+"<tr style='text-align'><td  style='text-align:center' colspan='6'> 没有查询到相对应的有效数据！</td></tr></tbody>"
								  }else{
									  for(var i=0 ;i<data.model.length;i++){
										  td=td+"<tr><td>"+data.model[i].jobNo +"</td>" +"<td>"+data.model[i].loginName +"</td>" +"<td>"+data.model[i].orgName +"<td>"+data.model[i].periodName +"</td>"+"<td>"+data.model[i].trainingTimeStart +"</td>"+"<td>"+data.model[i].trainingTimeEnd +"</td></tr>";
									  }
									  td=td+"</tbody>"
								  }
								 $("#unCompleteTable").append(th).append(td);
							}else{
								alert(data.message);
							}
						} 
					});
			},
			showUncompleteCoursePeriod:function(value){
				 $("#unCompleteTable").html("");
				 $("#myModalLabel").html("课程未完成期次列表");
				 var training_month = $("#progressMonitoringQueryForm input[name=training_month]").val();
				  var courseId = value; 
				  apiClient({
						url: 'implementation/showUncompleteCoursePeriod',
						data:{course_id:courseId,training_month:training_month},
						success: function(data){ 
							if(data.code == 0){
								 var th ="<thead> <tr><th>课程名称</th><th>期次名称</th><th>受训开始时间</th><th>受训结束时间</th><th>地点</th></tr></thead>";
								 var td = "<tbody>";
								 if(data.model.length==0){
									 td= td+"<tr style='text-align'><td  style='text-align:center' colspan='5'> 没有查询到相对应的有效数据！</td></tr></tbody>"
									 
								 }else{
									  for(var i=0 ;i<data.model.length;i++){
										  td=td+"<tr><td>"+data.model[i].courseName+"</td><td>"+data.model[i].name+"</td><td>"+moment(data.model[i].trainingTimeStart).format('YYYY.MM.DD HH:mm')  +"</td>"+"<td>"+moment(data.model[i].trainingTimeEnd).format('YYYY.MM.DD HH:mm')  +"</td>";
										  if(data.model[i].planType==1){
											  td = td+"<td>"+data.model[i].boardroomName+"</td></tr>";
										  }else{ 
											  td = td+"<td>"+data.model[i].trainingLocation+"</td></tr>";
										  }
									  }
									  td=td+"</tbody>"
								  }
								 $("#unCompleteTable").append(th).append(td);
							}else{
								alert(data.message);
							}
						} 
					});
			},
			showUncompleteCoursePersion:function(value){
				 $("#unCompleteTable").html("");
				 $("#myModalLabel").html("课程未完成人员列表");
				  var courseId = value; 
				  var training_month = $("#progressMonitoringQueryForm input[name=training_month]").val();
				  apiClient({
						url: 'implementation/getCourseUnCompleteUsers',
						data:{course_id:courseId,training_month:training_month},
						success: function(data){ 
							if(data.code == 0){
								 var th ="<thead> <tr><th>工号</th><th>用户</th><th>部门</th><th>期次名称</th> <th>受训开始时间</th><th>受训结束时间</th></tr></thead>";
								 var td = "<tbody>";
								 if(data.model.length==0){
									 td= td+"<tr style='text-align'><td  style='text-align:center' colspan='6'> 没有查询到相对应的有效数据！</td></tr></tbody>"
								  }else{
									  for(var i=0 ;i<data.model.length;i++){
										  td=td+"<tr><td>"+data.model[i].jobNo +"</td>"  +"<td>"+data.model[i].loginName +"</td>" +"<td>"+data.model[i].orgName+"<td>"+data.model[i].periodName +"</td>"+"<td>"+data.model[i].trainingTimeStart +"</td>"+"<td>"+data.model[i].trainingTimeEnd +"</td></tr>";
									  }
									  td=td+"</tbody>"
								  }
								 $("#unCompleteTable").append(th).append(td);
							}else{
								alert(data.message);
							}
						} 
					});
			},
			showUncompletePlanPeriods:function(value){
				 $("#unCompleteTable").html("");
				 $("#myModalLabel").html("计划未完成课程期次列表");
				 var training_month = $("#progressMonitoringQueryForm input[name=training_month]").val();
				  var planId = value; 
				  apiClient({
						url: 'implementation/getPlanUnCompletePeriods',
						data:{plan_id:planId,training_month:training_month},
						success: function(data){ 
							if(data.code == 0){
								 var th ="<thead> <tr><th>课程名称</th><th>期次名称</th><th>受训开始时间</th><th>受训结束时间</th><th>地点</th></tr></thead>";
								 var td = "<tbody>";
								 if(data.model.length==0){
									 td= td+"<tr style='text-align'><td  style='text-align:center' colspan='5'> 没有查询到相对应的有效数据！</td></tr></tbody>"
									 
								 }else{
									  for(var i=0 ;i<data.model.length;i++){
										  td=td+"<tr><td>"+data.model[i].courseName +"</td>"+"<td>"+data.model[i].name +"</td>"+"<td>"+moment(data.model[i].trainingTimeStart).format('YYYY.MM.DD HH:mm')  +"</td>"+"<td>"+moment(data.model[i].trainingTimeEnd).format('YYYY.MM.DD HH:mm')  +"</td>";
										  if(data.model[i].planType==1){
											  td = td+"<td>"+data.model[i].boardroomName+"</td></tr>";
										  }else{ 
											  td = td+"<td>"+data.model[i].trainingLocation+"</td></tr>";
										  }
									  }
									  td=td+"</tbody>"
								  }
								 $("#unCompleteTable").append(th).append(td);
							}else{
								alert(data.message);
							}
						} 
					});
			},
			showUncompletePlanPersion:function(value){ 
				 $("#unCompleteTable").html("");
				 $("#myModalLabel").html("计划未完成人员列表");
				 var training_month = $("#progressMonitoringQueryForm input[name=training_month]").val();
				  var planId =value;
				  apiClient({
						url: 'implementation/getPlanUnCompleteUsers',
						data:{plan_id:planId,training_month:training_month},
						success: function(data){ 
							if(data.code == 0){
								 var th ="<thead> <tr><th>工号</th><th>用户</th><th>部门</th><th>课程名</th><th>期次名称</th><th>受训开始时间</th><th>受训结束时间</th></tr></thead>";
								 var td = "<tbody>";
								 if(data.model.length==0){
									 td= td+"<tr style='text-align'><td  style='text-align:center' colspan='7'> 没有查询到相对应的有效数据！</td></tr></tbody>"
								  }else{
									  for(var i=0 ;i<data.model.length;i++){
										  td=td+"<tr><td>"+data.model[i].jobNo+"</td>"+"<td>"+data.model[i].loginName +"</td>"+"<td>"+data.model[i].orgName +"</td>" +"<td>"+data.model[i].courseName +"</td>"+"<td>"+data.model[i].periodName +"</td>"+"<td>"+data.model[i].trainingTimeStart +"</td>"+"<td>"+data.model[i].trainingTimeEnd +"</td></tr>";
									  }
									  td=td+"</tbody>"
								  }
								 $("#unCompleteTable").append(th).append(td);
							}else{
								alert(data.message);
							}
						} 
					});
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#progressMonitoringCheckAll").prop('checked', true);
				}else{
					$("#progressMonitoringCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			doExecute: function(e){ 
				doExecute([$(e.target).attr('pk')]);
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
				var jumpNode = $('#progressMonitoringJumpNo');
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
})

 
var progressMonitoringListModel;
var ids;

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#progressMonitoringQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#progressMonitoringRefreshRows").val();
	$("#progressMonitoringQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'implementation/getProgressMonitoring',
		data: $("#progressMonitoringQueryForm").serialize(),
		success: function(data){
			debugger;
			if(data.code == 0){
				$('#progressMonitoringTable input[type=checkbox]').prop('checked', false);
				progressMonitoringListModel.grid = data;
				$("#progressMonitoringTableBlock").show();
			}else{
				alert(data.message);
			}
		},
		complete: function(){
			$('#progressMonitoringTable input[type=checkbox][pk]').prop('checked', false);
			if(!action){
				hideLoading();
			}
//			setTimeout(function(){
//				$("#progressMonitoringTable td[name=indexTd]").width($("#progressMonitoringTable th[name=indexTh]").width());
//				$("#progressMonitoringTable td[name=planTd]").width($("#progressMonitoringTable th[name=planTh]").width());
//				$("#progressMonitoringTable td[name=typeTd]").width($("#progressMonitoringTable th[name=typeTh]").width());
//				$("#progressMonitoringTable td[name=courseTd]").width($("#progressMonitoringTable th[name=courseTh]").width());
//				$("#progressMonitoringTable td[name=orgTd]").width($("#progressMonitoringTable th[name=orgTh]").width());
//				$("#progressMonitoringTable td[name=peroidTd]").width($("#progressMonitoringTable th[name=peroidTh]").width()); 
//            },100)
		}
	})
}

/**
 * 实施
 * @param {Array} ids	记录主键id
 */
function doExecute(ids, message){
	var message = message ? message : '是要否实施当前课程？';
	if(ids && ids.length){
		bootbox.confirm(message, function(result){
			if(result){
				showLoading('正在实施...');
				apiClient({
					url: 'implementation/execute?id=' + ids.join(','),
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
	
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

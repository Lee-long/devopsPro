

//@ sourceURL=statistics.js
$(function(){
	 
	var pageName = getPageName();
	$("#peopleStatisticsQueryButton").click(function(){
		doQuery();
	});
	apiClient({
		url: 'peopleStatistics/getQueryCondition', 
		success: function(data){ 
			if(data.code == 0 && data.model){
				var orgOptions = "<option value=''>全部</option>";
				for(var i=0;i<data.model.orgList.length;i++){ 
					orgOptions = orgOptions+"<option value='"+data.model.orgList[i].id+"'>"+data.model.orgList[i].orgName+"</option>";
				};
				$("#peopleStatisticsQueryForm select[name=org_id]").append(orgOptions); 
			}else{
				alert(data.message);
			}
		},
		complete: function(){
			$("div[action=edit]").show();
			hideLoading();
		}
	});
	
	userBasicTable = new Vue({
		el: '#userBasicTable',
		data: {
			grid: {items:[]},  
		},
		methods:{ 
			formartFloat:function(score){
				if(score){
					return (score/1).toFixed(2);
				}else{
					return "0";
				 
				}
			}  
		}
	});

	userDetailsTable = new Vue({
		el: '#userDetailsTable',
		data: {
			grid: {items:[]},  
		},
		methods: {
			formartType:function(value){
				if(value == 1){
					text = '内训';
				}else if(value == 2){
					text = '外训';
				}
				return text;
			},
			formartRate: function(value){
				if(value == null){
					return '0.00%';
				}else {
					var rate =(value*100).toFixed(2) +"%";
					return rate; 
				}
			},
			formartNumber: function(value){
				if(value == null){
					return '0.00';
				}else {
					var rate =(value*1).toFixed(2);
					return rate; 
				}
			},
			formartSummary: function(sumTime,avgScore,avgTeacherScore){
				if(sumTime == null || avgScore== null || avgTeacherScore == null){
					return '0.00';
				}else {
					var rate =(sumTime*avgScore*avgTeacherScore).toFixed(2);
					return rate; 
				}
			},
			formartDate: function(value){
				 return  moment(value).format('YYYY-MM-DD HH:mm');
			},
		}
	});
	// 查询结果model
	peopleStatisticsListModel = new Vue({
		el: '#peopleStatisticsTableBlock',
		data: {
			grid: {items:[]}, 
		},
		methods: {
			getTeacherDetails:function(e){
				var id = $(e.target).attr('pk'); 
				window.location.href = "#" + pageName + "?action=details&id=" + $(e.target).attr('pk'); 
			}, 
			formartNumber: function(value){
				if(value == null){
					return '0.00';
				}else {
					var rate =(value*1).toFixed(2);
					return rate; 
				}
			},
			sortScore:function(e){ 
				var value = $(e.target).attr("pk");
				if(value==undefined){
					return;
				}
				var order = 0;
				var isDesc = $(e.target).find("i").hasClass("fa fa-sort-desc");
				$("#underTitle i").removeClass("fa fa-sort-desc");
				$("#underTitle i").removeClass("fa fa-sort-asc");
				$("#underTitle i").addClass("fa fa-sort");
				if(isDesc)
				{
					$(e.target).find("i").removeClass("fa fa-sort-desc");
					$(e.target).find("i").addClass("fa fa-sort-asc");
					order =1;
				}else{ 
					$(e.target).find("i").removeClass("fa fa-sort-asc");
					$(e.target).find("i").addClass("fa fa-sort-desc");
					order =2;
				}
				var list = peopleStatisticsListModel.grid.items;
				if(list) { 
					list.sort(compare(value,order));
				}
			},
			sortScoreIcon:function(e){
				$(e.target).parent().click();
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
				var jumpNode = $('#peopleStatisticsJumpNo');
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
		},
		mounted: function(){
			// 这里添加列表初始化后的事件绑定代码
		}
	});
	
	// 查询结果model
	orgStatisticsListModel = new Vue({
		el: '#orgStatisticsBlock',
		data: {
			grid: {items:[]}, 
		},  
		methods: { 
			formartAvgScore:function(score,count){
				if(count==0){
					return "0";
				}else{
					return (score/count).toFixed(2);
				 
				}
			}, 
			formartNumber: function(value){
				if(value == null){
					return '0.00';
				}else {
					var rate =(value*1).toFixed(2);
					return rate; 
				}
			},
			sortScore:function(e){ 
				var value = $(e.target).attr("pk"); 
				if(value==undefined){
					return;
				}
				var order = 0;
				var isDesc = $(e.target).find("i").hasClass("fa fa-sort-desc");
				$("#underTitle1 i").removeClass("fa fa-sort-desc");
				$("#underTitle1 i").removeClass("fa fa-sort-asc");
				$("#underTitle1 i").addClass("fa fa-sort");
				if(isDesc)
				{
					$(e.target).find("i").removeClass("fa fa-sort-desc");
					$(e.target).find("i").addClass("fa fa-sort-asc");
					order =1;
				}else{ 
					$(e.target).find("i").removeClass("fa fa-sort-asc");
					$(e.target).find("i").addClass("fa fa-sort-desc");
					order =2;
				}
				var list = orgStatisticsListModel.grid.items;
				if(list) { 
					list.sort(compare1(value,order));
				}
			},
			sortScoreIcon:function(e){
				$(e.target).parent().click();
			},
			formartFloat:function(score){
				if(score){
					return (score/1).toFixed(2);
				}else{
					return "0";
				 
				}
			} 
		}
	});
})

var peopleStatisticsListModel,userBasicTable,userDetailsTable,orgStatisticsListModel;
 
/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){ 
	$("#orgStattistic").show();
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#peopleStatisticsQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#peopleStatisticsRefreshRows").val();
	$("#peopleStatisticsQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'peopleStatistics/searchTeacher',
		data: $("#peopleStatisticsQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){ 
				peopleStatisticsListModel.grid = data;
				$("#peopleStatisticsTableBlock").show();
				$("#orgStatisticsBlock").hide();
				$("#orgCheckbox").show()
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
};
var compare1  = function (prop,order) {
    return function (obj1, obj2) {
    	var val1=0;
    	var val2 =0;
    	//平均成绩
    	if(prop==1){ 
    	  val1 = obj1.curYearAvgScore==null?0:obj1.curYearAvgScore;
    	  val2 = obj2.curYearAvgScore==null?0:obj2.curYearAvgScore;
    	}else if(prop==2){ 
      	  val1 = obj1.lastYearAvgScore==null?0:obj1.lastYearAvgScore;
      	  val2 = obj2.lastYearAvgScore==null?0:obj2.lastYearAvgScore;
    	}else if(prop==3){
      	  val1 = obj1.beforeYearAvgScore==null?0:obj1.beforeYearAvgScore;
      	  val2 = obj2.beforeYearAvgScore==null?0:obj2.beforeYearAvgScore;
    	} 
    	//总课时
    	else if(prop==4){ 
      	  val1 = obj1.curYearTimeAvg==null?0:obj1.curYearTimeAvg;
      	  val2 = obj2.curYearTimeAvg==null?0:obj2.curYearTimeAvg;
		} else if(prop==5){
      	  val1 = obj1.lastYearTimeAvg==null?0:obj1.lastYearTimeAvg;
      	  val2 = obj2.lastYearTimeAvg==null?0:obj2.lastYearTimeAvg;
		} else if(prop==6){
      	  val1 = obj1.beforeYearTimeAvg==null?0:obj1.beforeYearTimeAvg;
      	  val2 = obj2.beforeYearTimeAvg==null?0:obj2.beforeYearTimeAvg;
		}
    	//反馈平均分
		else if(prop==7){
      	  val1 = obj1.curYearAvgTeacherScore==null?0:obj1.curYearAvgTeacherScore;
      	  val2 = obj2.curYearAvgTeacherScore==null?0:obj2.curYearAvgTeacherScore;
		} else if(prop==8){
      	  val1 = obj1.lastYearAvgTeacherScore==null?0:obj1.lastYearAvgTeacherScore;
      	  val2 = obj2.lastYearAvgTeacherScore==null?0:obj2.lastYearAvgTeacherScore;
		} else if(prop==9){
      	  val1 = obj1.beforeYearAvgTeacherScore==null?0:obj1.beforeYearAvgTeacherScore;
      	  val2 = obj2.beforeYearAvgTeacherScore==null?0:obj2.beforeYearAvgTeacherScore;
		} 
		
		else if(prop==10){
			if(obj1.curYearAvgScore == null || obj1.curYearTimeAvg == null || obj1.curYearAvgTeacherScore == null){
				val1 = 0;
			}else{
				val1 =  obj1.curYearAvgScore*obj1.curYearTimeAvg*obj1.curYearAvgTeacherScore
			}
			if(obj2.curYearAvgScore == null || obj2.curYearTimeAvg == null || obj2.curYearAvgTeacherScore == null){
				val2 = 0;
			}else{
				val2 =  obj2.curYearAvgScore*obj2.curYearTimeAvg*obj2.curYearAvgTeacherScore
			} 
		} else if(prop==11){
			if(obj1.lastYearAvgScore == null || obj1.lastYearTimeAvg == null || obj1.lastYearAvgTeacherScore == null){
				val1 = 0;
			}else{
				val1 =  obj1.lastYearAvgScore*obj1.lastYearTimeAvg*obj1.lastYearAvgTeacherScore
			}
			if(obj2.lastYearAvgScore == null || obj2.lastYearTimeAvg == null || obj2.lastYearAvgTeacherScore == null){
				val2 = 0;
			}else{
				val2 =  obj2.lastYearAvgScore*obj2.lastYearTimeAvg*obj2.lastYearAvgTeacherScore
			} 
		} else if(prop==12){

			if(obj1.beforeYearAvgScore == null || obj1.beforeYearTimeAvg == null || obj1.beforeYearAvgTeacherScore == null){
				val1 = 0;
			}else{
				val1 =  obj1.beforeYearAvgScore*obj1.beforeYearTimeAvg*obj1.beforeYearAvgTeacherScore
			}
			if(obj2.beforeYearAvgScore == null || obj2.beforeYearTimeAvg == null || obj2.beforeYearAvgTeacherScore == null){
				val2 = 0;
			}else{
				val2 =  obj2.beforeYearAvgScore*obj2.beforeYearTimeAvg*obj2.beforeYearAvgTeacherScore
			} 
		} 
		if (val1 > val2) {
			if(order==1){ 
				return 1;
			}else{
				return -1;
			}
		} else if (val1 < val2) { 
			if(order==1){ 
				return -1;
			}else{
				return 1;
			}
		} else {
			return 0;
		}
	} 
};
var compare = function (prop,order) {
    return function (obj1, obj2) {
    	var val1=0;
    	var val2 =0;
    	//平均成绩
    	if(prop==1){ 
    	  val1 = obj1.curYearAvgScore==null?0:obj1.curYearAvgScore;
    	  val2 = obj2.curYearAvgScore==null?0:obj2.curYearAvgScore;
    	}else if(prop==2){ 
      	  val1 = obj1.lastYearAvgScore==null?0:obj1.lastYearAvgScore;
      	  val2 = obj2.lastYearAvgScore==null?0:obj2.lastYearAvgScore;
    	}else if(prop==3){
      	  val1 = obj1.beforeYearAvgScore==null?0:obj1.beforeYearAvgScore;
      	  val2 = obj2.beforeYearAvgScore==null?0:obj2.beforeYearAvgScore;
    	} 
    	//总课时
    	else if(prop==4){ 
      	  val1 = obj1.curYearSumTime==null?0:obj1.curYearSumTime;
      	  val2 = obj2.curYearSumTime==null?0:obj2.curYearSumTime;
		} else if(prop==5){
      	  val1 = obj1.lastYearSumTime==null?0:obj1.lastYearSumTime;
      	  val2 = obj2.lastYearSumTime==null?0:obj2.lastYearSumTime;
		} else if(prop==6){
      	  val1 = obj1.beforeYearSumTime==null?0:obj1.beforeYearSumTime;
      	  val2 = obj2.beforeYearSumTime==null?0:obj2.beforeYearSumTime;
		}
    	//反馈平均分
		else if(prop==7){
      	  val1 = obj1.curYearAvgTeacherScore==null?0:obj1.curYearAvgTeacherScore;
      	  val2 = obj2.curYearAvgTeacherScore==null?0:obj2.curYearAvgTeacherScore;
		} else if(prop==8){
      	  val1 = obj1.lastYearAvgTeacherScore==null?0:obj1.lastYearAvgTeacherScore;
      	  val2 = obj2.lastYearAvgTeacherScore==null?0:obj2.lastYearAvgTeacherScore;
		} else if(prop==9){
      	  val1 = obj1.beforeYearAvgTeacherScore==null?0:obj1.beforeYearAvgTeacherScore;
      	  val2 = obj2.beforeYearAvgTeacherScore==null?0:obj2.beforeYearAvgTeacherScore;
		} 
		
		else if(prop==10){
			if(obj1.curYearAvgScore == null || obj1.curYearSumTime == null || obj1.curYearAvgTeacherScore == null){
				val1 = 0;
			}else{
				val1 =  obj1.curYearAvgScore*obj1.curYearSumTime*obj1.curYearAvgTeacherScore
			}
			if(obj2.curYearAvgScore == null || obj2.curYearSumTime == null || obj2.curYearAvgTeacherScore == null){
				val2 = 0;
			}else{
				val2 =  obj2.curYearAvgScore*obj2.curYearSumTime*obj2.curYearAvgTeacherScore
			} 
		} else if(prop==11){
			if(obj1.lastYearAvgScore == null || obj1.lastYearSumTime == null || obj1.lastYearAvgTeacherScore == null){
				val1 = 0;
			}else{
				val1 =  obj1.lastYearAvgScore*obj1.lastYearSumTime*obj1.lastYearAvgTeacherScore
			}
			if(obj2.lastYearAvgScore == null || obj2.lastYearSumTime == null || obj2.lastYearAvgTeacherScore == null){
				val2 = 0;
			}else{
				val2 =  obj2.lastYearAvgScore*obj2.lastYearSumTime*obj2.lastYearAvgTeacherScore
			} 
		} else if(prop==12){

			if(obj1.beforeYearAvgScore == null || obj1.beforeYearSumTime == null || obj1.beforeYearAvgTeacherScore == null){
				val1 = 0;
			}else{
				val1 =  obj1.beforeYearAvgScore*obj1.beforeYearSumTime*obj1.beforeYearAvgTeacherScore
			}
			if(obj2.beforeYearAvgScore == null || obj2.beforeYearSumTime == null || obj2.beforeYearAvgTeacherScore == null){
				val2 = 0;
			}else{
				val2 =  obj2.beforeYearAvgScore*obj2.beforeYearSumTime*obj2.beforeYearAvgTeacherScore
			} 
		}

    	

		if (val1 > val2) {
			if(order==1){ 
				return 1;
			}else{
				return -1;
			}
		} else if (val1 < val2) { 
			if(order==1){ 
				return -1;
			}else{
				return 1;
			}
		} else {
			return 0;
		}
	} 
}
function orgCheckedChanged(){
	debugger;
	var ischecked = $("#orgStattistic").is(':checked')
	if(ischecked){ 
		$("#peopleStatisticsTableBlock").hide();
		$("#orgStatisticsBlock").show(); 
		apiClient({
			url: 'peopleStatistics/getOrgDetails', 
			success: function(data){
				debugger;
				if(data.code == 0){ 
					orgStatisticsListModel.grid.items = data.model; 
				}else{
					alert(data.message);
				}
			} 
		});
	}else{ 
		$("#peopleStatisticsTableBlock").show();
		$("#orgStatisticsBlock").hide();
	}
}
/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action'); 
	var id = Utils.parseUrlParam(window.location.href, 'id'); 
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();

	if(action){
		var pageName = getPageName();
		$('#back').show(); 
		$('#back').attr('href','#' + pageName);
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		apiClient({
			url: 'peopleStatistics/getTeacherDetails',
			data: {id : id},
			success: function(data){
				if(data.code == 0){ 
					userBasicTable.grid.items = data.model.userList;
					userDetailsTable.grid.items = data.model.statisticList;
				}else{
					alert(data.message);
				}
			} 
		}); 

	} else{  
		$('div[action]').hide();
		$('div[action="query"]').show(); 
		var page = $("#peopleStatisticsQueryBlock input[name=page]").val();
		if(page){ 
			doQuery(page);
		}
	}
}
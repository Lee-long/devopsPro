 
//@ sourceURL=peopleStatistics.js
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
				
				var levelOptions = "<option value=''>全部</option>";
				for(var i=0;i<data.model.levelList.length;i++){ 
					levelOptions = levelOptions+"<option value='"+data.model.levelList[i].id+"'>"+data.model.levelList[i].name+"</option>";
				};
				$("#peopleStatisticsQueryForm select[name=level_id]").append(levelOptions);
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
			formartScore:function(score,isPass,userCompleteStatus,isExam){
				if(isExam == 1){ 
					//出勤状态：是
					if(userCompleteStatus == 1){
						if(isPass == 0){
							return "未考试";
						}else if(isPass==1){
							return score+ " (未通过)";
						}else{
							return score +" (通过)";
						} 
					}else{
						return "未出勤";
					}
				}else{
					return "免试";
				}
			},
			formartRate: function(value){
				if(value == null){
					return '0.00%';
				}else {
					var rate =(value*100).toFixed(2) +"%";
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
			getUserDetails:function(e){
				var id = $(e.target).attr('pk'); 
				window.location.href = "#" + pageName + "?action=details&id=" + $(e.target).attr('pk'); 
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
	

})

var peopleStatisticsListModel,userBasicTable,userDetailsTable;
 
/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){ 
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#peopleStatisticsQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#peopleStatisticsRefreshRows").val();
	$("#peopleStatisticsQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'peopleStatistics/search',
		data: $("#peopleStatisticsQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){ 
				peopleStatisticsListModel.grid = data;
				$("#peopleStatisticsTableBlock").show();
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
			url: 'peopleStatistics/getUserDetails',
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

	}else{ 
		$('div[action]').hide();
		$('div[action="query"]').show();
		var page = $("#peopleStatisticsQueryBlock input[name=page]").val();
		if(page){ 
			doQuery(page);
		}
	}
}
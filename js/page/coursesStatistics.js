/**
 * 
 */

$(function(){

	queryListModel = new Vue({
		el: '#queryForm',
		data: {
			monthList: [{'id':'01','name':'一月'},{'id':'02','name':'二月'},{'id':'03','name':'三月'},{'id':'04','name':'四月'}
			,{'id':'05','name':'五月'},{'id':'06','name':'六月'},{'id':'07','name':'七月'},{'id':'08','name':'八月'},{'id':'09','name':'九月'},{'id':'10','name':'十月'}
			,{'id':'11','name':'十一月'},{'id':'12','name':'十二月'}],
			levelItems: [],
			orgItems: [],
			courseItems: []
		},
		methods: {
			doQuery: function() {
				doCourseStatisticsQuery();
			},
			checkAll: function(e) {
				if($(e.target).prop('checked')) {
					$("#queryForm input[name=org_id]").each(function(){
						if($(this).val() != $(e.target).val()) {
							$(this).prop('checked',false);
						}
					});
					$("#queryForm label[name=orgList]").hide();
				} else {
					$("#queryForm label[name=orgList]").show();
				}
			}
		}
	
	});
	
	courseListModel = new Vue({
		el: '#courseStatistics',
		data: {
			userList: [],
			courseList: [],
			courseAverageSort: 0,
			userAverageSort: 0,
			noDataColSpan: 5
		},
		methods: {
			formatData: function(value) {
				var text = '--'
				if(value != null){
					text = value.toFixed(2);
				}
				return text;
			},
			order: function(e) {
				var userList = courseListModel.userList;
				if(userList) {
					var orderBy = $(e.target).val();
					userList.sort(compare(orderBy));
				}
			},
			sort: function(orderBy) {
				var order = 1;
				if(orderBy == 'average') {
					if(this.userAverageSort==0 || this.userAverageSort==1){
						this.userAverageSort = -1;
						order = -1;
					} else {
						this.userAverageSort = 1;
					}
					for(var index in this.courseList) {
						this.courseList[index].sort = 0;
					}
				} else {
					this.userAverageSort = 0;
					for(var index in this.courseList) {
						if(orderBy != this.courseList[index].id) {
							this.courseList[index].sort = 0;
						} else {
							if(this.courseList[index].sort==0 || this.courseList[index].sort==1){
								this.courseList[index].sort = -1;
								order = -1
							} else {
								this.courseList[index].sort = 1;
							}
						}
					}
				}
				this.userList.sort(compare(orderBy,order));
				
			},
			sortCourse: function(orderBy) {
				var order = 1;
				if('average'==orderBy) {
					if(this.courseAverageSort==0 || this.courseAverageSort==1){
						this.courseAverageSort = -1;
						order = -1
					} else {
						this.courseAverageSort = 1;
					}
					for(var index in this.userList) {
						this.userList[index].sort = 0;
					}
					var orderList = courseListModel.courseList;
					orderList.sort(compare(orderBy,order));
				} else {
					this.courseAverageSort = 0;
					for(var index in this.userList) {
						if(orderBy != this.userList[index].loginName) {
							this.userList[index].sort = 0;
						} else {
							if(this.userList[index].sort==0 || this.userList[index].sort==1){
								this.userList[index].sort = -1;
								order = -1;
							} else {
								this.userList[index].sort = 1;
							}
						}
					}
					doSortCourse(orderBy,order);
				}
				
			},
			showTips: function(e) {
				$(e.target).attr("title",$(e.target).text());
			}
		}
	});
	
	// 查询条件日期控件
	$("#queryForm input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});
	
	// 设置年度默认值
	var myDate = new Date;
    var year = myDate.getFullYear();//获取当前年
    $("#queryForm input[ctl-type=year]").val(year);
    
    // 设置月份默认值
    var month = myDate.getMonth()+1;//获取当月
    if(month<10) {
    	month = '0' + month;
    }
    $("#queryForm select[name=training_month]").val(month);
})

var queryListModel,courseListModel;

// 排序比较
var compare = function (orderBy,order) {
    return function (obj1, obj2) {
    	var val1 = 0;
    	var val2 = 0;
    	if(orderBy == 'average') {
    		val1 = obj1.average;
    		val2 = obj2.average;
    	}else if(orderBy == 'score'){
    		val1 = obj1.score;
    		val2 = obj2.score;
    	}else {
    		for(var index in obj1.courseList) {
        		var course = obj1.courseList[index];
        		if(course.id == orderBy) {
        			val1 = course.score;
        			break;
        		}
        	}
        	for(var index in obj2.courseList) {
        		var course = obj2.courseList[index];
        		if(course.id == orderBy) {
        			val2 = course.score;
        			break;
        		}
        	}
    	}
    	if ((val1 > val2) || (val1 != null && val2 == null)) {
            return order;
        } else if ((val1 < val2) || (val1 == null && val2 != null)) {
            return -order;
        } else {
            return 0;
        } 
    } 
}

// 排序初期化为0（不排序）
function resetOrder(userList,courseList){
	var i = 0;
    while (i < userList.length) {
    	userList[i]['sort'] = 0;
    	i++;
    }
    
    var j = 0;
    while (j < courseList.length) {
    	courseList[j]['sort'] = 0;
    	j++;
    }
}

// 根据用户的课程成绩排序
function doSortCourse(orderBy,order){
	var orderList;
	for(var index in courseListModel.userList) {
		if(courseListModel.userList[index].loginName == orderBy) {
			orderList = courseListModel.userList[index].courseList;
			orderList.sort(compare('score',order));
			break;
		}
	}
	var orderCourseList = [];
	var courseList = courseListModel.courseList;
	for(var index1 in orderList) {
		for(var index2 in courseList) {
			if(courseList[index2].id == orderList[index1].id) {
				orderCourseList.push(courseList[index2]);
				courseList.splice(index2,1);
				continue;
			}
		}
	}
	courseListModel.courseList = orderCourseList;
}

// 检索查询条件
function loadingQueryCondition() {
	showLoading('加载中...');
	apiClient({
		url: 'course/searchQueryCondition',
		success: function(data){
			if(data.code == 0) {
				queryListModel.levelItems = data.model.levelList;
				queryListModel.orgItems = data.model.orgList;
				queryListModel.courseItems = data.model.courseList;
			} else {
				alert(data.message);
			}
		},
		complete: function(){
			hideLoading();// 当页面加载完成后将loading页隐藏
			$('#wrap').show();
		}
	});
}

function doCourseStatisticsQuery(){
	var valid = true;
	// 年度
	var yearNode = $("#queryForm input[ctl-type=year]");
	if(yearNode && yearNode.length && !$.trim(yearNode.val())){
		alert('请选择年度！')
		return;
	}
	
	showLoading('正在分析数据...');
	var year = $("#queryForm input[ctl-type=year]").val();
	var month = $("#queryForm select[name=training_month]").val();
	var ids = [];
	$('input[name=org_id]:checked').each(function(){
		ids.push($(this).val());
	});
	if(ids.length == 0) {
		ids.push('all');
	}
	apiClient({
		url: 'course/statistics',
		data: {'implement_year':$("#queryForm input[ctl-type=year]").val(),
				'training_month':year+'-'+month,
				'level_id':$("#queryForm input[name=level_id]:checked").val(),
				'org_id':ids.join(',')},
		success: function(data){
			if(data.code == 0) {
				debugger;
				courseListModel.courseList = data.model.courseList;
				courseListModel.userList = data.model.userList;
				courseListModel.courseAverageSort = 0;
				courseListModel.userAverageSort = 0;
				resetOrder(courseListModel.userList,courseListModel.courseList);
				if(data.model.userList.length == 0) {
					courseListModel.noDataColSpan = 5+data.model.courseList.length
				}	
			} else {
				alert(data.message);
			}
		},
		complete: function(){
			$('#courseStatistics').show();
			hideLoading();
		}
	});
}

/**
 * 路由地址回调
 */
function routeCallBack(){
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();

	loadingQueryCondition();
}
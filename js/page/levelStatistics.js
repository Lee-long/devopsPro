/**
 * 
 */

$(function(){
	companyLevelListModel = new Vue({
		el: '#companyLevelStatistics',
		data: {
			items: []
		},
		methods: {
			formatData: function(value) {
				var text = '0.00'
				if(value != null){
					text = value.toFixed(2);
				}
				return text;
			},
			formatRate: function(value){
				if(value == null){
					return '0.00%';
				}else {
					var rate =(value*100).toFixed(2) +"%";
					return rate; 
				}
			},
			doQuery: function() {
				doStatistics();
			},
			sort: function(orderBy) {
				var order = 1;
				$('th[name=sort]').each(function(index,val){
					var value = $(val).attr("value");
					if(orderBy != value) {
						$(val).find("i").removeClass("fa-sort-asc");
						$(val).find("i").removeClass("fa-sort-desc");
						$(val).find("i").addClass("fa-sort");
					} else {
						var isDesc = $(val).find("i").hasClass("fa-sort-desc");
						if(isDesc) {
							$(val).find("i").removeClass("fa-sort-desc");
							$(val).find("i").addClass("fa-sort-asc");
							order = 1
						} else {
							$(val).find("i").removeClass("fa-sort-asc");
							$(val).find("i").addClass("fa-sort-desc");
							order = -1
						}
					}
				});
				var levelList = companyLevelListModel.items;
				levelList.sort(compare(orderBy,order));
			}
		}
	
	});
	
	orgLevelListModel = new Vue({
		el: '#orgLevelStatistics',
		data: {
			items: [],
			monthList: [{'id':'01','name':'一月'},{'id':'02','name':'二月'},{'id':'03','name':'三月'},{'id':'04','name':'四月'}
			,{'id':'05','name':'五月'},{'id':'06','name':'六月'},{'id':'07','name':'七月'},{'id':'08','name':'八月'},{'id':'09','name':'九月'},{'id':'10','name':'十月'}
			,{'id':'11','name':'十一月'},{'id':'12','name':'十二月'}]
		},
		methods: {
			formatData: function(value) {
				var text = '0.00'
				if(value != null){
					text = value.toFixed(2);
				}
				return text;
			},
			formatRate: function(value){
				if(value == null){
					return '0.00%';
				}else {
					var rate =(value*100).toFixed(2) +"%";
					return rate; 
				}
			},
			doQuery: function() {
				doOrgStatisticsQuery();
			},
			sort: function(orderBy) {
				var order = 1;
				for(var index in orgLevelListModel.items) {
					var level = orgLevelListModel.items[index];
					if(orderBy.indexOf(level.levelName) != -1) {
						$("#orgStatisticsTable th").each(function(index,val){
							var value = $(val).attr("value");
							var name = $(val).attr("name");
							if(orderBy.indexOf(name) != -1) {
								if(orderBy.indexOf(value) == -1) {
									$(val).find("i").removeClass("fa-sort-asc");
									$(val).find("i").removeClass("fa-sort-desc");
									$(val).find("i").addClass("fa-sort");
								} else {
									var isDesc = $(val).find("i").hasClass("fa-sort-desc");
									if(isDesc) {
										$(val).find("i").removeClass("fa-sort-desc");
										$(val).find("i").addClass("fa-sort-asc");
										order = 1
									} else {
										$(val).find("i").removeClass("fa-sort-asc");
										$(val).find("i").addClass("fa-sort-desc");
										order = -1
									}
									var orgList = level.orgList;
									orgList.sort(compare(value,order));
								}
								
							}
						});
					}
				}
			}
		},
		mounted: function(){
	    }
	});
	
	// 查询条件日期控件
	$("#companyLevelStatistics input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#orgLevelStatistics input[ctl-type=month]").datetimepicker({
		format: 'YYYY-MM',
		locale: 'zh-CN',
	});

	// 设置年度默认值
	var myDate = new Date;
    var year = myDate.getFullYear();//获取当前年
    $("#companyLevelStatistics input[ctl-type=year]").val(year);
    
    // 设置月份默认值
    var month = myDate.getMonth()+1;//获取当月
    if(month<10) {
    	month = '0' + month;
    }
    $("#orgLevelStatistics select[name=training_month]").val(month);
    
})

var companyLevelListModel,orgLevelListModel;

function doStatistics(){
	// 年度
	var yearNode = $("#companyLevelStatistics input[ctl-type=year]");
	if(yearNode && yearNode.length && !$.trim(yearNode.val())){
		alert('请选择年度！')
		return;
	}
	
	showLoading('正在分析数据...');
	var year = $("#companyLevelStatistics input[ctl-type=year]").val();
	var month = $("#orgLevelStatistics select[name=training_month]").val();
	
	apiClient({
		url: 'administrativeLevel/statistics',
		data: {'implement_year':$("#companyLevelStatistics input[ctl-type=year]").val(),'training_month':year+'-'+month},
		success: function(data){
			if(data.code == 0) {
				companyLevelListModel.items = data.model[0];
				var orgLevelList = data.model[1];
				orgLevelListModel.items = orgLevelList;
			} else {
				alert(data.message);
			}
		},
		complete: function(){
			hideLoading();
			$('#wrap').show();
		}
	});
}

function doOrgStatisticsQuery(){
	// 年度
	var yearNode = $("#companyLevelStatistics input[ctl-type=year]");
	if(yearNode && yearNode.length && !$.trim(yearNode.val())){
		alert('请选择年度！')
		return;
	}
	
	showLoading('正在分析数据...');
	orgLevelListModel.items = null;
	var year = $("#companyLevelStatistics input[ctl-type=year]").val();
	var month = $("#orgLevelStatistics select[name=training_month]").val();
	
	apiClient({
		url: 'administrativeLevel/orgStatistics',
		data: {'training_month':year+'-'+month},
		success: function(data){
			if(data.code == 0) {
				combineCell(data.model);
				orgLevelListModel.items = data.model;
			} else {
				alert(data.message);
			}
		},
		complete: function(){
            hideLoading();
		}
	});
}

var compare = function (orderBy,order) {
    return function (obj1, obj2) {
    	var val1 = 0;
    	var val2 = 0;
    	if(orderBy == '1') {
    		val1 = obj1.trainingCoverage;
    		val2 = obj2.trainingCoverage;
    	} else if(orderBy == '2') {
    		val1 = obj1.passRate;
    		val2 = obj2.passRate;
    	} else {
    		val1 = obj1.average;
    		val2 = obj2.average;
    	}
    	if (val1 > val2) {
            return order;
        } else if (val1 < val2) {
            return -order;
        } else {
            return 0;
        } 
    } 
}

function combineCell(list) {
	var field = 'levelName';
    var k = 0;
    while (k < list.length) {
        list[k][field + 'Span'] = 1;
        list[k][field + 'Dis'] = false;
        for (var i = k + 1; i <= list.length - 1; i++) {
            if (list[k][field] == list[i][field] && list[k][field] != '') {
                list[k][field + 'Span']++;
                list[k][field + 'Dis'] = false;
                list[i][field + 'Span'] = 1;
                list[i][field + 'Dis'] = true;
            } else {
                break;
            }
        }
        k = i;
    }

    return list;
}



/**
 * 路由地址回调
 */
function routeCallBack(){
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	doStatistics();
}
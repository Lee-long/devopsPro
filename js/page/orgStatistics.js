/**
 * 
 */

$(function(){
	
	companyLevelListModel = new Vue({
		el: '#companyLevelStatistics',
		data: {
			model: {}
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
				loadingOrgStatistics();
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
				var orgList = orgLevelListModel.items;
				orgList.sort(compare(orderBy,order));
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
var implementationRateChart,trainingCoverageChart,passRateChart;

function doStatistics() {
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
		url: 'org/statistics',
		data: {'implement_year':year,
			'training_month':year + '-' + month,
		},
		success: function(data){
			if(data.code == 0) {
				companyLevelListModel.model = data.model[0];
				createChart()
				orgLevelListModel.items = data.model[1];
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

function loadingOrgStatistics() {
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
		url: 'org/orgStatistics',
		data: {'training_month':year +'-'+ month,'order_by':$("#orgLevelStatistics select[name=order_by]").val()},
		success: function(data){
			if(data.code == 0) {
				orgLevelListModel.items = data.model;
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

var compare = function (orderBy,order) {
    return function (obj1, obj2) {
    	var val1 = 0;
    	var val2 = 0;
    	if(orderBy == '1') {
    		val1 = obj1.implementationRate;
    		val2 = obj2.implementationRate;
    	} else if(orderBy == '2') {
    		val1 = obj1.trainingCoverage;
    		val2 = obj2.trainingCoverage;
    	} else if(orderBy == '3') {
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

function createChart(){
	var model = companyLevelListModel.model;
	var implementationRateChartTips = '已完成期次数: ' + model.periodDoneCount + '<br/>未完成期次数: ' + model.periodUndoneCount;
	implementationRateChart = chart('implementationRateChart',"执行率",model.implementationRate,implementationRateChartTips);
	var trainingCoverageChartTips = '完成人员数: ' + model.userCompleteCount + '<br/>未完成人员数: ' + model.userUnCompleteCount;
	trainingCoverageChart = chart('trainingCoverageChart',"覆盖率",model.trainingCoverage,trainingCoverageChartTips);  
	var passRateChartTips = '合格人数: ' + model.passCount + '<br/>不合格人数: ' + model.unpassCount;
	passRateChart = chart('passRateChart',"合格率",model.passRate,passRateChartTips);
}
 
function chart(item,label,data,tips) { 
	if(data == null){
		data = '0.00';
	}else {
		data =(data*100).toFixed(2); 
	}
	var myChart = echarts.init(document.getElementById(item));
	option = {
		tooltip : {
			formatter : tips
		},
		series : [ {
			name : label,
			type : 'gauge',
			detail : {
				formatter:'{value}%', 
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontWeight: 'bolder',
                    fontSize: "18"
                }
			}, // 仪表盘显示数据
			axisLine : { // 仪表盘轴线样式
				lineStyle : {
					color: [[0.2, '#ff4500'],[0.8, '#48b'],[1, '#228b22']], 
					width : 10
				}
			},
			splitLine : { // 分割线样式
				length : 20,
				lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
			},
			data : [ {
				value : data,
				name : label
			} ]
		} ]
	}; 
	myChart.setOption(option);
	return myChart;
}

/**
 * 路由地址回调
 */
function routeCallBack(){

	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	doStatistics();
}
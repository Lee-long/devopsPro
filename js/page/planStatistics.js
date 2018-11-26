$(function(){

	// 查询条件日期控件
	$("#queryForm input[ctl-type=year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});
	
	// 设置年度默认值
	var myDate = new Date;
    var year = myDate.getFullYear();//获取当前年
    $("#queryForm input[ctl-type=year]").val(year);
    
   doQuery();
   
   planStatisticsModel = new Vue({
		el: '#planStatisticsTableBlock',
		data: {
			model: {}
		},
		methods: {
			formatData: function(value) {
				var text = '';
				if(value == null){
					text = '0';
				} else {
					text = value;
				}
				return text;
			},
			formatValue: function(value) {
				var text = '';
				if(value == 0){
					text = '未完成';
				} else {
					text = '已完成';
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
			}
		}
	
	}); 
})

var planStatisticsModel;

function doQuery() {
	 showLoading('正在分析数据...');
	 apiClient({
            url: 'plan/courseStatistics',
            data: {'implement_year':$("#queryForm input[name=implement_year]").val()},
            success: function(data){
                if(data.code == 0){
                	if(data.model != null) {
                		 combineCell(data.model.courseModels);
                		combineCell(data.model.peopleModels);
                		//mergeData(data.model);
                    	planStatisticsModel.model = data.model;
                	} else {
                		planStatisticsModel.model = {};
                	}
                }
            },
            complete: function(){
                $(".process .cs").animate({width:"100%"},function(){
                     $(".loading").hide();//当页面加载完成后将loading页隐藏
                     $('#wrap').show();
                });
                hideLoading();
            }
        });
}

function combineCell(list) {
	debugger;
	var field = 'planName';
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

function mergeData(data) {
	if(data.courseModels != null && data.courseModels.length != 0) {
		var tempPlanName1 = '';
		for(var index1 in data.courseModels) {
			var course = data.courseModels[index1];
			var planName = course.planName;
			if(tempPlanName1 == '' || tempPlanName1 != planName) {
				tempPlanName1 = planName;
			} else if (tempPlanName1 == planName) {
				course.planName = '';
			}
		}
	}
	
	if(data.peopleModels != null && data.peopleModels.length != 0) {
		var tempPlanName2 = '';
		for(var index2 in data.peopleModels) {
			var people = data.peopleModels[index2];
			var planName = people.planName;
			if(tempPlanName2 == '' || tempPlanName2 != planName) {
				tempPlanName2 = planName;
			} else if (tempPlanName2 == planName) {
				people.planName = '';
			}
		}
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

	}
}
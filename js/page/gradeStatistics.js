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
    
    gradeStatisticsModel = new Vue({
		el: '#gradeStatisticsTableBlock',
		data: {
			items: []
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

var gradeStatisticsModel;

function doQuery(){
	showLoading('正在分析数据...');
    apiClient({
        url: 'exam/gradeStatistics',
        data: {'implement_year':$("#queryForm input[name=implement_year]").val()},
        success: function(data){
            if(data.code == 0){
                var data = data.model;
                if(data!=null){
                	gradeStatisticsModel.items = data
                	combineCell(gradeStatisticsModel.items);
                }
            }
        },
        complete: function(){
            hideLoading();
            $('#wrap').show();
        }
    });
}

function combineCell(list) {
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

/**
 * 路由地址回调
 */
function routeCallBack(){
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	doQuery();
}

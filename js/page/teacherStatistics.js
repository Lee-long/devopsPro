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
    
    teacherStatisticsModel = new Vue({
		el: '#teacherStatisticsTableBlock',
		data: {
			items: [],
			questionnaireList: [],
			colspan: 0
		},
		methods: {
			formatData: function(value) {
				var text = '--';
				if(value != null && value != 0){
					text = value.toFixed(2);
				} 
				return text;
			}
		},
		mounted: function(){
	    },
	    watch: {
	    	questionnaireList: {
	    		handler() {
	    	        this.colspan = this.questionnaireList.length + 4;
	    	      },
	    	      immediate: true
	    	}
	    }
    });
})

function doQuery() {
	showLoading('正在分析数据...');
    apiClient({
        url: 'questionnaireRecord/analysisTeacher',
        data: {'implement_year':$("#queryForm input[name=implement_year]").val(),'type':'2'},
        success: function(data){
            if(data.code == 0){
            	teacherStatisticsModel.items = data.model;
    			if(data.model) {
    				var value = data.model[0];
    				if(value) {
    					teacherStatisticsModel.questionnaireList = value.questionnaireList;
    				}
    			}
            }
            $('#teacherStatisticsTableBlock').show();
        },
        complete: function(){
            hideLoading();
            $('#wrap').show();
        }
    });
}

/**
 * 路由地址回调
 */
function routeCallBack(){

	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();

	doQuery();
}
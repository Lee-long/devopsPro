/**
 * 
 */

$(function(){
	
	var pageName = getPageName();
    
	queryListModel = new Vue({
		el: '#queryForm',
		data: {
			model: {},
			planList: [],
			courseList:[],
			orgList: [],
		},
		methods: {
			doQuery: function() {
				doQuery();
			}
		}
	
	});
	
	collectionModel = new Vue({
		el: '#trainingRecordCollection',
		data: {
			items: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD HH:mm');
			},
			formatData: function(value) {
				var text = '-'
				if(value != null){
					text = value;
				}
				return text;
			}
		}
	});
	
	// 查询条件日期控件
	$("#queryForm input[name=implement_year]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});

	var date = new Date;
    var year = date.getFullYear();//获取当前年
    $("#queryForm input[name=implement_year]").val(year);
    
    $("#queryForm input[name=implement_year]").blur(function(){
    	var data = {implement_year:$("#queryForm input[name=implement_year]").val()};
    	$('#plan_id option:first').prop("selected","selected");
    	$('#course_id option:first').prop("selected","selected");
    	$('#org_id option:first').prop("selected","selected");
    	doSearchQuery(data);
    });
    
    $("#queryForm select[name=plan_id]").change(function(){
    	var data = {implement_year:$("#queryForm input[name=implement_year]").val(),plan_id:$("#queryForm select[name=plan_id]").val()};
    	$('#course_id option:first').prop("selected","selected");
    	$('#org_id option:first').prop("selected","selected");
    	doSearchQuery(data);
    });
    
    $("#queryForm select[name=course_id]").change(function(){
    	var data = {implement_year:$("#queryForm input[name=implement_year]").val(),plan_id:$("#queryForm select[name=plan_id]").val(),course_id:$("#queryForm select[name=course_id]").val()};
    	$('#org_id option:first').prop("selected","selected");
    	doSearchQuery(data);
    });
    
    $("#queryForm button[name=exportButton]").click(function(){
    	showLoading('正在导出...');
    	apiClient({
    		url: 'trainingRecord/exportTrainingRecord',
    		data: $('#queryForm').serialize(),
    		success: function(data){
    			if(data.code == 0) {
    				window.location.href = data.url;
    			} else {
    				alert(data.message);
    			}
    		},
    		complete: function(){
    			hideLoading();
    		}
    	});
    });
})

var queryListModel,collectionModel;

function doQuery(data){
	showLoading('正在查询...');
	$('#trainingRecordCollection').hide();
	apiClient({
		url: 'trainingRecord/searchTrainingRecord',
		data: $('#queryForm').serialize(),
		success: function(data){
			if(data.code == 0) {
				collectionModel.items = data.model;
				$('#trainingRecordCollection').show();
			} else {
				alert(data.message);
			}
		},
		complete: function(){
			hideLoading();
		}
	});
}

function doSearchQuery(data){
	apiClient({
		url: 'trainingRecord/searchQueryData',
		data: data,
		success: function(data){
			if(data.code == 0) {
				if(data.model.planList) {
					queryListModel.planList = data.model.planList;
				}
				if(data.model.courseList) {
					queryListModel.courseList = data.model.courseList;
				}
				if(data.model.orgList) {
					queryListModel.orgList = data.model.orgList;
				}
				
			} else {
				queryListModel.planList = [];
				queryListModel.courseList = [];
				queryListModel.orgList = [];
				alert(data.message);
				$("#queryForm button[type=button]").attr('disabled', true);
				$("#queryForm button[type=reset]").attr('disabled', true);
			}
		},
		complete: function(){
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
	$('div[action]').hide(); 
	$('div[action=query]').show();
	
	showLoading('正在加载...');
	var date = new Date;
    var year = date.getFullYear();//获取当前年
	var data = {implement_year:year};
	doSearchQuery(data);
}
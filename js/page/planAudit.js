
//@ sourceURL=planAudit.js
$(function(){
	var pageName = getPageName();
 
	var date=new Date;
	 var year=date.getFullYear(); 
	 
	// 查询条件日期控件
	$("#planAuditQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY',
		locale: 'zh-CN',
	});

	 $("#planAuditQueryForm input[ctl-type=date]").val(year+1);
	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	
	// 取消按钮
	$('#planAuditCancelButton').click(function(){
		$('#planAuditAddForm button[type=reset]').click();
		window.location.href = '#' + pageName; 
	});
	
	// 查询按钮
	$('#planAuditQueryForm button[type="button"][name=planAuditQueryButton]').click(function(){ 
		doQuery();
	});

	// 查询按钮 
	$("#searchReset").click(function(){
		var date=new Date;
		var year=date.getFullYear();  
		$("#planAuditQueryForm input[name=name]").val("");
		$("#planAuditQueryForm input[name=implement_year]").val(year+1); 
	});
	// 新增记录提交
	$('#planAuditButton').click(function(){
		showLoading('正在保存...'); 
		apiClient({
			url: 'planAudit/audit',
			method: 'post',
			data: $("#planAuditForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#planAuditQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#planAuditForm button[type=reset]').click();
				}else{
					hideLoading();
					alert(data.message);
				}
			},
			error: function(){
				hideLoading();
			},
			complete: function() { 
			}
		})
	});
	
	// 查询结果model
	planAuditListModel = new Vue({
		el: '#planAuditTableBlock',
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
			formatType: function(value){
				if(value == 1){
					return '内训';
				}else if(value == 2){
					return '外训';
				}
			},
			formatUser: function(value){
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
			formatReviewStatus: function(value){
				var text = value;
				if(value == 1){
					text = '创建中';
				}else if(value == 4){
					text = '审核中';
				}else if(value == 3){
					text = '已审核';
				}else if(value == 2){
					text = '已实施';
				}
				return text;
			},
			formatColor:function(value){
				var text = value;
				if(value == 1){
					text = 'color:#A3A3A3';
				}else if(value == 4){
					text = 'color:#FF4500';
				}
				return text;
			},
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk'); 
				var isReviewFlg = $(e.target).parent().attr('isReviewFlg');
				
				if(isReviewFlg !=0){ 
					node.prop('checked', !node.prop('checked'));
				}
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#planAuditCheckAll").prop('checked', true);
				}else{
					$("#planAuditCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').each(function(){
					if(!$(this).attr("disabled")){
						$(this).prop('checked', $(e.target).prop('checked'));
					}
				});
			},
			goAudit: function(e){ 
				window.location.href = "#" + pageName + "?action=audit&id=" + $(e.target).attr('pk')+"&planName="+$(e.target).attr('planName'); 
			 },
			auditRows: function(e){
				var planName = "";
				var ids=""
				$('input[type=checkbox][pk]:checked').each(function(){
					ids = ids+$(this).attr('pk')+",";
					planName = planName+$(this).attr('planName')+","
				});
				ids  = ids.substring(0,ids.length-1);
				planName = planName.substring(0,planName.length-1);
				if(ids!="") {
					window.location.href = "#" + pageName + "?action=audit&id=" + ids+"&planName="+planName;  
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
				var jumpNode = $('#planAuditJumpNo');
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
			// 这里添加列表初始化后的事件绑定代码
		}
	});
})

var planAuditListModel;
var ids;

function downloadExcel(){
	showLoading('正在导出...');
	var year = $("#planAuditQueryForm input[ctl-type=date]").val();
	apiClient({
		url: 'planAudit/downloadExcel', 
		data: {review_status:3,implement_year:year},
		success: function(data){
			debugger;
			if(data.code == 0){  
				window.location.href = data.model;
			}else{
				alert(data.message);
			}
		},
		complete: function(){
			hideLoading();
		}
	}); 
};
/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var year = $("#planAuditQueryForm input[name='implement_year']");
	// 计划实施年度  
	if(year && year.length && !$.trim(year.val())){ 
		showToolTip(year);
		return;
	}
	if(!action){
		showLoading('正在查询...');
	}
	$("#planAuditQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#planAuditRefreshRows").val();
	$("#planAuditQueryForm input[name='rows']").val(rows ? rows : 20);
	
	apiClient({
		url: 'plan/search',
		data: $("#planAuditQueryForm").serialize(),
		success: function(data){
			debugger;
			if(data.code == 0){
				$('#planAuditTable input[type=checkbox]').prop('checked', false);
				planAuditListModel.grid = data;
				$("#planAuditTableBlock").show();
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
	var planName = Utils.parseUrlParam(window.location.href, 'planName');
	
	// 为安全起见，路由跳转后，再次隐藏查询图层
	hideLoading();
	
	if(action){

		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		$("#planAuditForm label[name=plan_name]").html(planName);
		$("#planAuditForm input[name=ids]").val(id);
		
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show(); 
		var page = $("#planAuditQueryForm input[name=page]").val();
		doQuery(page);
	}
}

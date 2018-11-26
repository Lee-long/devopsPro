 
//@ sourceURL=org.js
$(function(){
	var pageName = getPageName();

	// 新增页面上级组织列表
	orgNameListModel = new Vue({
		el: '#orgNameList',
		data: {
			items: []
		}
	});
	$('#org_tree').jstree({
		'core' : {
			multiple : true,
			animation : 0,
			themes : { "variant" : "large", "icons":true }, 
			data: function(obj, callback){
				apiClient({
					url: 'org/jstree', 
					success: function(data){
						callback.call(this, [
						   {
						     text : '部门编辑器',
						     id: 0,
						     icon: 'glyphicon glyphicon-list',
						     state : {
						       opened : true, selected: true
						     },
						     children : data.menus
						  }
						]);
					}
				});
			}
		},
		"contextmenu":{  
            select_node:false,  
            show_at_node:true,  
            items: customMenu,
		},
		"conditionalselect" : function (node, event) {
			return false;
		},

		 'plugins' : ['type','contextmenu'],
		 
		"types":{ 
			'default' : { 'icon' : 'fa 	fa-bug ' },
			'1' : {'icon' : 'fa	 fa-folder-open-o'},
			'2' : {'icon' : 'fa fa-file-text-o' },
			'3' : { 'icon' : 'fa  fa-stack-exchange '}, 
		}

	}).bind("activate_node.jstree", function (data, e) {
		var node = $('#org_tree').jstree(true).get_selected(true)[0];
		if(!isNaN(node.id)){
			$("#orgQueryForm input[name=org_id]").val(node.id)
			doQuery(1);
		}
		
	}).on('loaded.jstree', function(e, data) {
		$("#org_tree").jstree('open_all'); 
		//doQuery(1);
	});
	//右键菜单
	function customMenu(node)
	{
	    var items = {
	    		 "add":{    
	                    "label":"添加",    
	                    "icon"  : "fa fa-plus-square-o",  
	                    "action":function(data){ 
	                    	var pageName = getPageName();
	                    	var inst = $.jstree.reference(data.reference),  
	                        obj = inst.get_node(data.reference);  
	                    	var id = obj.id; 
	                    	if(isNaN(node.id)){
	                    		id = "0"
;	                    	}
//	                    	$("#orgNameList").attr("disabled","disabled");  
	                	
	                    	$("#orgNameList").val(id);
	                    	window.location.href = '#' + pageName + '?action=add';
	                    } 
             	},
		          "edit":{    
		                "label":"修改",    
		                "icon"  : "fa fa-edit",  
		                "action":function(data){ 
		                	var pageName = getPageName(); 
	                    	var inst = $.jstree.reference(data.reference),  
	                        obj = inst.get_node(data.reference);  
	                    	var id = obj.id;   
		                    window.location.href = "#" + pageName + "?action=edit&id=" + id;
		                 }
		            } , 
		            "del":{    
	                    "label":"删除",    
	                    "icon"  : "fa fa-trash-o",  
	                    "action":function(data){ 
	                    	var inst = $.jstree.reference(data.reference),  
	                        obj = inst.get_node(data.reference);  
	                    	var id = obj.id; 
	                    	doDelete([id]);
	                    }
                 } , 
	    }
	 
	    if (isNaN(node.id)) {
	        delete items.edit;  //删除节点 items
	        delete items.del;  //删除节点 items
	    }  
	 
	    return items;
	}

	// 查询条件日期控件
	$("#orgQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#orgAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#orgAddForm input[ctl-type=datetime]").datetimepicker({
		format: 'YYYY-MM-DD HH:mm:ss',
		locale: 'zh-CN',
		icons: {
			time: 'fa fa-clock-o',
			date: 'fa fa-calendar',
			up: 'fa fa-chevron-up',
			down: 'fa fa-chevron-down',
			previous: 'fa fa-chevron-left',
			next: 'fa fa-chevron-right',
			today: 'fa fa-arrows',
			clear: 'fa fa-trash',
			close: 'fa fa-times'
		}
	});
	// 整数输入
	$("#orgAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#orgAddForm input[ctl-type=decimal]").blur(function(){
		var value = $(this).val().replace(/[^\d\.]/g, '');
		var dotIndex = value.indexOf('.');
		if(dotIndex){
			var other = value.substr(dotIndex + 1);
			other = other.replace(/\./g, '');
			value = value.substr(0, dotIndex + 1) + other;
		}
		$(this).val(value);
	});


	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	
	// 取消按钮
	$('#orgCancelButton').click(function(){
		$('#orgResetButton').click();
		window.location.href = '#' + pageName;
	});
	//新建刷新
	$('#orgResetButton').click(function(){
		$("#orgAddForm input[name=org_code]").val("");
		$("#orgAddForm input[name=org_name]").val("");
		$("#orgAddForm input[name=remark]").val("");
	 
	});
	
	// 新增记录提交
	$('#orgAddButton').click(function(){
		var valid = true;
		
		// 组织架构代码
		var orgOrgCodeNode = $("#orgAddForm input[name=org_code]");
		if(orgOrgCodeNode && orgOrgCodeNode.length && !$.trim(orgOrgCodeNode.val())){
			showToolTip(orgOrgCodeNode);
			valid = false;
		}
		// 组织架构名称
		var orgOrgNameNode = $("#orgAddForm input[name=org_name]");
		if(orgOrgNameNode && orgOrgNameNode.length && !$.trim(orgOrgNameNode.val())){
			showToolTip(orgOrgNameNode);
			valid = false;
		}
		// 上级ID
		var orgUpIdNode = $("#orgAddForm input[name=up_id]");
		if(orgUpIdNode && orgUpIdNode.length && (!$.trim(orgUpIdNode.val()) || !validator.isNumeric($.trim(orgUpIdNode.val())))){
			orgUpIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(orgUpIdNode);
			valid = false;
		}
		// 说明
		var orgRemarkNode = $("#orgAddForm input[name=remark]");
		if(orgRemarkNode && orgRemarkNode.length && !$.trim(orgRemarkNode.val())){
			showToolTip(orgRemarkNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'org/add',
			method: 'post',
			data: $("#orgAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#orgQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#orgResetButton').click();
					routeCallBack();
					$('#org_tree').jstree(true).refresh();
				}else{
					hideLoading();
					alert(data.message);
				}
			},
			error: function(){
				hideLoading();
			}
		})
	});
	
	  
	var taskHintModel = new Vue({
		el: '#orgAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	orgListModel = new Vue({
		el: '#orgTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			}, 
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#orgCheckAll").prop('checked', true);
				}else{
					$("#orgCheckAll").prop('checked', false);
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
				var jumpNode = $('#orgJumpNo');
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
			exportQuery: function(e){
				// 同步导出
				showLoading('正在导出...');
				apiClient({
					url: 'org/export/query',
					success: function(data){
						if(data.code == 0){
							window.location.href = data.url;
						}else{
							alert(data.message);
						}
					},
					complete: function(){
						hideLoading();
					}
				});
 
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						// 同步导出
						showLoading('正在导出...');
						apiClient({
							url: 'org/export/all',
							success: function(data){
								if(data.code == 0){
									window.location.href = data.url;
								}else{
									alert(data.message);
								}
							},
							complete: function(){
								hideLoading();
							}
						}); 
					}
				});	
			}
		},
		mounted: function(){
			// 这里添加列表初始化后的事件绑定代码
		}
	});
	
	// 编辑回显model
	orgItemModel = new Vue({
		el: '#orgEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#orgEditForm button[type=reset]").click();
			},
//			doReset: function(e){
//				("#orgEditForm input[name=org_code]").val("");
//				$("#orgEditForm input[name=org_name]").val("");
//				$("#orgEditForm input[name=up_id]")
//				$("#orgEditForm input[name=up_id]")
//				$("#orgEditForm input[name=remark]")
//			},
			doSubmit: function(e){
				var valid = true;
				
				// 组织架构代码
				var orgOrgCodeNode = $("#orgEditForm input[name=org_code]");
				if(orgOrgCodeNode && orgOrgCodeNode.length && !$.trim(orgOrgCodeNode.val())){
					showToolTip(orgOrgCodeNode);
					valid = false;
				}
				// 组织架构名称
				var orgOrgNameNode = $("#orgEditForm input[name=org_name]");
				if(orgOrgNameNode && orgOrgNameNode.length && !$.trim(orgOrgNameNode.val())){
					showToolTip(orgOrgNameNode);
					valid = false;
				}
				// 上级ID
				var orgUpIdNode = $("#orgEditForm input[name=up_id]");
				if(orgUpIdNode && orgUpIdNode.length && (!$.trim(orgUpIdNode.val()) || !validator.isNumeric($.trim(orgUpIdNode.val())))){
					orgUpIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(orgUpIdNode);
					valid = false;
				}
				// 说明
				var orgRemarkNode = $("#orgEditForm input[name=remark]");
				if(orgRemarkNode && orgRemarkNode.length && !$.trim(orgRemarkNode.val())){
					showToolTip(orgRemarkNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'org/edit',
					method: 'post',
					data: $("#orgEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#orgEditForm button[type=reset]').click();
							$('#org_tree').jstree(true).refresh();
						}else{
							hideLoading();
							alert(data.message);
						}
					},
					error: function(){
						hideLoading();
					}
				})
			}
		},
		mounted: function(){
			// 编辑页日期控件
			$("#orgEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#orgEditForm input[ctl-type=datetime]").datetimepicker({
				format: 'YYYY-MM-DD HH:mm:ss',
				locale: 'zh-CN',
				icons: {
					time: 'fa fa-clock-o',
					date: 'fa fa-calendar',
					up: 'fa fa-chevron-up',
					down: 'fa fa-chevron-down',
					previous: 'fa fa-chevron-left',
					next: 'fa fa-chevron-right',
					today: 'fa fa-arrows',
					clear: 'fa fa-trash',
					close: 'fa fa-times'
				}
			});
			// 整数输入
			$("#orgEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#orgEditForm input[ctl-type=decimal]").blur(function(){
				var value = $(this).val().replace(/[^\d\.]/g, '');
				var dotIndex = value.indexOf('.');
				if(dotIndex){
					var other = value.substr(dotIndex + 1);
					other = other.replace(/\./g, '');
					value = value.substr(0, dotIndex + 1) + other;
				}
				$(this).val(value);
			});
		}
	});

})

var orgListModel, orgItemModel;
var orgNameListModel;

function goAdd(){
	var pageName = getPageName();
	window.location.href = '#' + pageName + '?action=add';
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page ){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#orgQueryForm input[name=page]").val(page ? page : 1); 
	var rows = $("#orgRefreshRows").val();
	$("#orgQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'user/searchUser',
		data: $("#orgQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#orgTable input[type=checkbox]').prop('checked', false);
				orgListModel.grid = data;
				$("#orgTableBlock").show();
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
 * 删除记录
 * @param {Array} ids	记录主键id
 */
function doDelete(ids, message){ 
	var message = message ? message : '是要否删除当前行？';
	if(ids && ids.length){
		bootbox.confirm(message, function(result){
			if(result){
				showLoading('正在删除...');
				apiClient({
					url: 'org/delete?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							hideLoading();
							$('#org_tree').jstree(true).refresh();
							doQuery(1);
						}else{
							alert(data.message); 
							hideLoading();
						}
					}
				});
			}
		});	
	}
}

/**
 * 加载明细数据
 */
function loadOrgItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'org/edit',
			data: {id:id},
			success: function(data){
				$("#orgEditBlock").show();
				if(data.code == 0 && data.model){
					orgItemModel.model = data.model;
				}else{
					alert(data.message);
				}
			},
			complete: function(){
				$("div[action=edit]").show();
				hideLoading();
			}
		})
	}else{
		hideLoading();
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
		
		  if(action == 'edit'){
			loadOrgItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show(); 
		apiClient({
			url: 'org/search/hierarchy',
			success: function(data){
				if(data && data.code == 0){
					orgNameListModel.items = data.model;
				}
			}
		});
	}
}

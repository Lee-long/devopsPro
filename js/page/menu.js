$(function(){
	$("#_content").attr('page', 'menu');
	
	var parentMenuModel = new Vue({
		el: '#parentMenu',
		data: {
			menus: [],
			parentId: null
		},
		methods: {
			syncParentMenuId: function(e){
				$("#_menuParentId").val($(e.target).val());
			}
		}
	});

	$("#_menuBlock input[ctl-type=decimal]").blur(function(){
		var value = $(this).val().replace(/[^\d\.]/g, '');
		var dotIndex = value.indexOf('.');
		if(dotIndex){
			var other = value.substr(dotIndex + 1);
			other = other.replace(/\./g, '');
			value = value.substr(0, dotIndex + 1) + other;
		}
		$(this).val(value);
	});

	$('#menu_tree').on("changed.jstree", function (e, data){
//		debugger;
		$('#_menuId').val('');
		var node = data.instance.get_node(data.selected[0]);
		if(node.id > 0){
			$("#_addMenu").removeClass('disabled');

			if(node.li_attr.parentId){
				// 选中子菜单
				$("#_addMenu").addClass('disabled');
				
				apiClient({
					url: 'home/menus/jstree',
					success: function(data){
						if(data.menus && data.menus.length > 0){
							parentMenuModel.menus = data.menus;
							parentMenuModel.parentId = node.li_attr.parentId;
						}
					}
				})
				$("#parentId").show();
			}else{
				$("#parentId").hide();
			}
			
			$("#_menuBlock").hide();
			$("#_menuLoad").show();
			
			$("#menuLinkBlock").show();
			$("#_menuCss").show();
			
			// 查询菜单内容
			apiClient({
				url: 'home/menu',
				data: {id:node.id},
				success:function(data){
//					console.log(data);
					if(data.code == 0 && data.model){
						var menu = data.model;
						
						if(!menu.parentId){
							// 顶级菜单
							$("#menuLinkBlock").hide();
						}else{
							$("#_menuCss").hide();
						}
						
						$('#_menuId').val(menu.id);
						$("#_menuParentId").val(menu.parentId);
						$("#_name").val(menu.name);
						$("#_link").val(menu.url);
						$("#_css").val(menu.iconCss);
						$("#_order").val(menu.sort);
						$('input[type="radio"][value="' + menu.visible + '"]').prop('checked', true);
					}
				},
				complete: function(){
					$("#_menuLoad").hide();
					$("#_menuBlock").show();
				}
			});
		}else{
			$("#_menuBlock").hide();
			$("#_addMenu").removeClass('disabled');
		}
	}).jstree({
		plugins: ['wholerow'],
		'core' : {
			multiple: false,
			data: function(obj, callback){
				apiClient({
					url: 'home/menus/jstree',
					success: function(data){
						callback.call(this, [
						   {
						     text : '菜单编辑器',
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
		} 
	});
	
	$("#_refresh").click(function(){
		refreshMenuTree();
	});
	
	$('#_addMenu').click(function(){
		if($(this).hasClass('disabled')){
			return;
		}
		
		bootbox.prompt("请输入菜单名称", function(result) {
			if(result) {
				apiClient({
					url: 'home/menu',
					type: 'post',
					data: {
						parentId: $("#_menuId").val(),
						name: $.trim(result)
					},
					success: function(data){
						if(data.code == 0){
							refreshMenuTree();
						}
					}
				})
			}
		});
	});
	
	$("#_delete").click(function(){
		bootbox.confirm('是要否删除？', function(result){
			if(result){
				apiClient({
					url: 'home/menu?id=' + $("#_menuId").val(),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							refreshMenuTree();
						}
					}
				})
			}
		});
	});
	
	$("#_save").click(function(){
		if(!$.trim($("#_name").val())){
			showToolTip($("#_name"));
			return;
		}
		
		var order = $.trim($("#_order").val());
//		var regexp = new RegExp(/^\d*$/);
//		if(!regexp.test(order)){
//			showToolTip($("#_order"));
//			return;
//		}
		
		apiClient({
			url: 'home/menu',
			type: 'post',
			data: {
				id: $('#_menuId').val(),
				parentId: $("#_menuParentId").val(),
				name: $("#_name").val(),
				url: $("#_link").val(),
				iconCss: $("#_css").val(),
				visible: $('input[type="radio"]:checked').val(),
				order: order
			},
			success: function(data){
				if(data.code == 0){
//					showSuccess('保存成功');
//					bootbox.alert('保存成功');
					refreshMenuTree();
				}else{
					alertError('保存失败');
				}
			}
		})
	});
})

/**
 * 刷新树形菜单
 */
function refreshMenuTree(){
	$('#menu_tree').jstree(true).refresh();
}

function routeCallBack(){
	// do nothing
}

//function showSelected(){
////	var text = $('#menu_tree').jstree(true).get_checked();
//	var text = $('#menu_tree').jstree(true).get_selected();
//	$("#msg").text(text);
//}
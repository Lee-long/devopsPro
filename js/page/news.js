$(function(){
	var pageName = getPageName();
//	$("#_content").attr('page', pageName);

	var addKeywords = $('#newsAddKeywords');
	addKeywords.tag({
		placeholder: addKeywords.attr('placeholder'),
	});
//debugger;
	if(newsAddEditor){
		newsAddEditor.destroy();
	}
	newsAddEditor = UE.getEditor('newsAddEditor', {
		serverUrl: ueditorServletUrl,
		autoHeightEnabled: false,
		enableAutoSave: false,
		saveInterval: 1000 * 60 * 60 * 24,
		toolbars: ueditorToolbars
	});
	
	if(newsEditEditor){
		newsEditEditor.destroy();
	}
	newsEditEditor = UE.getEditor('newsEditEditor', {
		serverUrl: ueditorServletUrl,
		autoHeightEnabled: false,
		enableAutoSave: false,
		saveInterval: 1000 * 60 * 60 * 24,
		toolbars: ueditorToolbars
	});
	
	$("#newsQueryForm input[ctl-type=date]").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy-mm-dd',
		regional: 'zh-TW'
	});
	// 点击导航，显示当前菜单
	$("#_menuLink").click(function(){
		window.location.href = '#' + pageName;
	});
	
	// 取消按钮
	$($('#newsAddForm button[type=button]')[1]).click(function(){
		$('#newsAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#newsQueryForm button[type="button"]').click(function(){
		doQuery();
	});
	
	// 重置按钮
	$("#newsAddForm button[type=reset]").click(function(){
		newsAddEditor.setContent('');
		var keywords = $('#newsAddKeywords').data('tag').values;
		if(keywords && keywords.length){
			var len = keywords.length;
			for(var i = 0; i < len; i++){
				$('#newsAddKeywords').data('tag').remove(0);
			}
		}
	});
	
	// 新增记录提交
	$('#newsAddButton').click(function(){
		var valid = true;
		
		var newsTitleNode = $("#newsAddForm input[name=title]");
		if(newsTitleNode && newsTitleNode.length && !$.trim(newsTitleNode.val())){
			showToolTip(newsTitleNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		var keywords = $('#newsAddKeywords').data('tag').values;
		if(keywords && keywords.length && keywords.length > 3){
			alertError('最多只能输入3个关键字');
			return false;
		}
		var newsContentNode = $("#newsAddEditor");
		if(newsContentNode && newsContentNode.length && !$.trim(newsAddEditor.getContent())){
			alertError('请输入咨讯内容');
			return false;
		}
		
		$.loading.show({tips:'正在保存...'});
		
		$("#newsAddForm textarea[name=content]").val(newsAddEditor.getContent());
		
		apiClient({
			url: 'news/add',
			method: 'post',
			data: $("#newsAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					$.loading.hide();
					$("#newsQueryForm button[type=reset]").click();
					newsAddEditor.setContent('');
					window.location.href = '#' + pageName;
					$('#newsAddForm button[type=reset]').click();
					doQuery();
				}else{
					$.loading.hide();
					alertError(data.message);
				}
			},
			error: function(){
				$.loading.hide();
			}
		})
	});
	
	// 导入文件
	$("#newsImportExcel").click(function(){
		$("#newsExcelFile").val('');
		$("#newsExcelFile").click();
	});
	$("#newsUploadForm").ajaxForm({
		url: _baseUrl + 'news/import',
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				$.loading.hide();
				doQuery();
			}else{
				$.loading.hide();
				alertError(data.message);
			}
		},
		error: function(){
			$.loading.hide();
		}
	});
	$("#newsExcelFile").change(function(){
		$.loading.show({tips:'正在导入...'});
		$("#newsUploadForm").submit();
	});
	
	doQuery();

	// 查询结果model
	newsListModel = new Vue({
		el: '#newsTableBlock',
		data: {
			grid: {items:[]}
		},
		methods: {
			formatContent: function(value){
				var max = 100;
				var text = value ? value : '';
				return text.length > max ? text.substr(0, max) + '...': text;
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#newsCheckAll").prop('checked', true);
				}else{
					$("#newsCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk');
			},
			deleteRow: function(e){
				doDelete([$(e.target).attr('pk')]);
			},
			deleteRows: function(e){
				var ids = [];
				$('input[type=checkbox][pk]:checked').each(function(){
					ids.push($(this).attr('pk'));
				});
				
				doDelete(ids, '是否要删除选中行？');
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
				doQuery(this.grid.currentPage);
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
				var jumpNode = $('#newsJumpNo');
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
				$.loading.show({tips:'正在导出...'});
				apiClient({
					url: 'news/export/query',
					success: function(data){
						if(data.code == 0){
							window.location.href = data.url;
						}else{
							alertError(data.message);
						}
					},
					complete: function(){
						$.loading.hide();
					}
				});
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						$.loading.show({tips:'正在导出...'});
						apiClient({
							url: 'news/export/all',
							success: function(data){
								if(data.code == 0){
									window.location.href = data.url;
								}else{
									alertError(data.message);
								}
							},
							complete: function(){
								$.loading.hide();
							}
						});
					}
				});	
			}
		}
	});
	
	// 编辑回显model
	newsItemModel = new Vue({
		el: '#newsEditForm',
		data: {
			model: {}
		},
		methods: {
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#newsEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				var newsTitleNode = $("#newsEditForm input[name=title]");
				if(newsTitleNode && newsTitleNode.length && !$.trim(newsTitleNode.val())){
					showToolTip(newsTitleNode);
					valid = false;
				}
				
				if(!valid){
					return valid;
				}
				
				var keywords = $('#newsEditKeywords').data('tag').values;
				if(keywords && keywords.length && keywords.length > 3){
					alertError('最多只能输入3个关键字');
					return false;
				}
				var newsContentNode = $("#newsEditEditor");
				if(newsContentNode && newsContentNode.length && !$.trim(newsEditEditor.getContent())){
					alertError('请输入咨讯内容');
					return false;
				}
				$.loading.show({tips:'正在保存...'});
				
				$("#newsEditForm textarea[name=content]").val(newsEditEditor.getContent());
				
				apiClient({
					url: 'news/edit',
					method: 'post',
					data: $("#newsEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							$.loading.hide();
							window.location.href = '#' + pageName;
							newsEditEditor.setContent('');
							$('#newsEditForm button[type=reset]').click();
							doQuery();
						}else{
							$.loading.hide();
							alertError(data.message);
						}
					},
					error: function(){
						$.loading.hide();
					}
				})
			},
			clearForm: function(e){
				newsEditEditor.setContent('');
				var keywords = $('#newsEditKeywords').data('tag').values;
				if(keywords && keywords.length){
					var len = keywords.length;
					for(var i = 0; i < len; i++){
						$('#newsEditKeywords').data('tag').remove(0);
					}
				}
			}
		}
	});

})

var newsListModel, newsItemModel;
var newsAddEditor, newsEditEditor;

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		$.loading.show({tips:'正在查询...'});
	}
	$("#newsQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#newsRefreshRows").val();
	$("#newsQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'news/search',
		data: $("#newsQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#newsTable input[type=checkbox]').prop('checked', false);
				newsListModel.grid = data;
				$("#newsTableBlock").show();
			}else{
				alertError(data.message);
			}
		},
		complete: function(){
			$('input[type=checkbox][pk]').prop('checked', false);
			if(!action){
				$.loading.hide();
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
				$.loading.show({tips:'正在删除...'});
				apiClient({
					url: 'news/delete?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							$.loading.hide();
							doQuery();
						}else{
							alertError(data.message);
							$.loading.hide();
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
function loadNewsItem(){
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("#div [action=edit]").hide();
		apiClient({
			url: 'news/edit',
			data: {id:id},
			success: function(data){
				if(data.code == 0 && data.model){
					newsItemModel.model = data.model;
					
					try{
						newsEditEditor.setContent(data.model.content ? data.model.content : '');
					}catch(e){
						newsEditEditor.addListener('ready', function(){
							newsEditEditor.setContent(data.model.content ? data.model.content : '');
							newsEditEditor.removeListener('ready');
						});
					}
					
					var editKeywords = $('#newsEditKeywords');
					editKeywords.tag({
						placeholder: editKeywords.attr('placeholder'),
					});
					
//					debugger;
					if(data.model.keywords && data.model.keywords.length){
						data.model.keywords.forEach(function(e){
							editKeywords.data('tag').add(e.keyword); 
						})
					}
				}else{
					alertError(data.message);
				}
			},
			complete: function(){
				$("#div [action=edit]").show();
				$.loading.hide();
			}
		})
	}
}

/**
 * 路由地址回调
 * {String} page 页面名称	
 */
function routeCallBack(page){
//	var pageName = getPageName();
//	if(page != pageName){
//		// 跳至主页
//		$('#_content').empty();
//		return;
//	}
	
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			
		}else if(action == 'edit'){
			$.loading.show({tips:'正在加载...'});
			loadNewsItem();
		}
	}else{
//		if($("#_content").attr('page') != pageName){
//			$('#_content').load(pageName + '.html');
//		}
		$('div[action]').hide();
		$('div[action="query"]').show();
	}
}


$(function(){
	var pageName = getPageName();
	
	// 查询条件日期控件
	$("#sliderQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#sliderAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#sliderAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#sliderAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#sliderAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#sliderCancelButton').click(function(){
		$('#sliderAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#sliderQueryForm button[type="button"][name=sliderQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#sliderQueryForm button[type="button"][name=sliderExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#sliderQueryForm input[name=async]').val(0);
				$.loading.show({tips:'正在导出...'});
				apiClient({
					url: 'slider/export/all',
					data: $("#sliderQueryForm").serialize(),
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
/*
				// 异步导出
				$('#sliderQueryForm input[name=async]').val(1);
				$("#sliderAlert").hide();
				apiClient({
					url: 'slider/export/all',
					data: $("#sliderQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#sliderAlert").show();
						}else{
							alertError(data.message);
						}
					}
				});
*/
			}
		});
	});
	
	// 新增记录提交
	$('#sliderAddButton').click(function(){
		var valid = true;
		
		// 链接地址
		var sliderLinkNode = $("#sliderAddForm input[name=link]");
		if(sliderLinkNode && sliderLinkNode.length && !$.trim(sliderLinkNode.val())){
			showToolTip(sliderLinkNode);
			valid = false;
		}
		// 描述
		var sliderDescriptionNode = $("#sliderAddForm input[name=description]");
		if(sliderDescriptionNode && sliderDescriptionNode.length && !$.trim(sliderDescriptionNode.val())){
			showToolTip(sliderDescriptionNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		var cutButton = $('#sliderAddForm button[name=cutButton]');
		if(!cutButton.hasClass('disabled')){
			// 未裁剪
			confirm('不裁剪并上传原始图片？', function(yesNo){
				if(yesNo){
					$.loading.show({tips:'正在保存...'});
					apiClient({
						url: 'slider/add',
						method: 'post',
						data: $("#sliderAddForm").serialize(),
						success: function(data){
							if(data.code == 0){
								$.loading.hide();
								$("#sliderQueryForm button[type=reset]").click();
								window.location.href = '#' + pageName;
								$('#sliderAddForm button[type=reset]').click();
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
				}
			});
		}
		
/*		
		// 若未裁剪，自动裁剪
		if(!$('#sliderAddForm button[name=cutButton]').hasClass('disabled')){
			var sliderNode = $('#sliderAddForm img[name=slider]');
			var urlNode = $('#sliderAddForm input[name=url]');
			var data = sliderNode.cropper('getCroppedCanvas').toDataURL('image/jpeg');
			sliderNode.cropper('destroy');
			sliderNode.attr('src', data);
			urlNode.val(data);
		}
*/		
	});
	
	// 导入文件
	$("#sliderImportExcel").click(function(){
		$("#sliderExcelFile").val('');
		$("#sliderExcelFile").click();
	});
	// 同步导入
	$("#sliderUploadForm").ajaxForm({
		url: _baseUrl + 'slider/import',
//		uploadProgress: function(event, position, total, percentComplete){
//			$.loading.hide();
//			$.loading.show({tips:'正在上传' + percentComplete + '% ...'});
//			if(percentComplete >= 100){
//				setTimeout(function(){
//					$.loading.hide();
//					$.loading.show({tips:'正在导入...'});
//				}, 500);
//			}
//		},
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
	$("#sliderExcelFile").change(function(){
		$.loading.show({tips:'正在导入...'});
//		$.loading.show({tips:'正在上传 0% ...'});
		$("#sliderUploadForm").submit();
	});

/*
	// 异步导入
	$("#sliderUploadForm").ajaxForm({
		url: _baseUrl + 'slider/import',
//		uploadProgress: function(event, position, total, percentComplete){
//			$.loading.hide();
//			$.loading.show({tips:'正在上传' + percentComplete + '% ...'});
//			if(percentComplete >= 100){
//				$.loading.hide();
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				taskHintModel.taskName = '文件导入';
				$("#sliderAlert").show();
			}else{
				alertError(data.message);
			}
		}
	});
	$("#sliderExcelFile").change(function(){
		$("#sliderAlert").hide();
		$('#sliderUploadForm input[name="async"]').val(1);
//		$.loading.show({tips:'正在上传 0% ...'});
		$("#sliderUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#sliderAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	sliderListModel = new Vue({
		el: '#sliderTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatBlock: function(value){
				var text = value;
				if(value == 1){
					text = '首页';
				}
				return text;
			},
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#sliderCheckAll").prop('checked', true);
				}else{
					$("#sliderCheckAll").prop('checked', false);
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
				var jumpNode = $('#sliderJumpNo');
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
				$.loading.show({tips:'正在导出...'});
				apiClient({
					url: 'slider/export/query',
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
/*
				// 异步导出
				$("#sliderAlert").hide();
				apiClient({
					url: 'slider/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#sliderAlert").show();
						}else{
							alertError(data.message);
						}
					}
				});
*/
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						// 同步导出
						$.loading.show({tips:'正在导出...'});
						apiClient({
							url: 'slider/export/all',
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
/*
						// 异步导出
						$("#sliderAlert").hide();
						apiClient({
							url: 'slider/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#sliderAlert").show();
								}else{
									alertError(data.message);
								}
							}
						});
*/
					}
				});	
			}
		},
		mounted: function(){
			// 这里添加列表初始化后的事件绑定代码
		}
	});
	
	// 编辑回显model
	sliderItemModel = new Vue({
		el: '#sliderEditForm',
		data: {
			model: {}
		},
		methods: {
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#sliderEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 图片网址，http相对路径
				var sliderUrlNode = $("#sliderEditForm input[name=link]");
				if(sliderUrlNode && sliderUrlNode.length && !$.trim(sliderUrlNode.val())){
					showToolTip(sliderUrlNode);
					valid = false;
				}
				// 所属板块
				var sliderBlockNode = $("#sliderEditForm input[name=block]");
				if(sliderBlockNode && sliderBlockNode.length && (!$.trim(sliderBlockNode.val()) || !validator.isNumeric($.trim(sliderBlockNode.val())))){
					sliderBlockNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(sliderBlockNode);
					valid = false;
				}
				// 链接地址
				var sliderLinkNode = $("#sliderEditForm input[name=link]");
				if(sliderLinkNode && sliderLinkNode.length && !$.trim(sliderLinkNode.val())){
					showToolTip(sliderLinkNode);
					valid = false;
				}
				// 描述
				var sliderDescriptionNode = $("#sliderEditForm input[name=description]");
				if(sliderDescriptionNode && sliderDescriptionNode.length && !$.trim(sliderDescriptionNode.val())){
					showToolTip(sliderDescriptionNode);
					valid = false;
				}
				
				if(!valid){
					return valid;
				}
				
				var cutButton = $('#sliderEditForm button[name=cutButton]');
				if(!cutButton.hasClass('disabled')){
					// 未裁剪
					confirm('不裁剪并上传原始图片？', function(yesNo){
						if(yesNo){
							$.loading.show({tips:'正在保存...'});
							apiClient({
								url: 'slider/edit',
								method: 'post',
								data: $("#sliderEditForm").serialize(),
								success: function(data){
									if(data.code == 0){
										$.loading.hide();
										window.location.href = '#' + pageName;
										$('#sliderEditForm button[type=reset]').click();
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
						}
					});
				}
				
/*				
				// 若未裁剪，自动裁剪
				if(!$('#sliderEditForm button[name=cutButton]').hasClass('disabled')){
					var sliderNode = $('#sliderEditForm img[name=slider]');
					var urlNode = $('#sliderEditForm input[name=url]');
					var data = sliderNode.cropper('getCroppedCanvas').toDataURL('image/jpeg');
					sliderNode.cropper('destroy');
					sliderNode.attr('src', data);
					urlNode.val(data);
				}
*/
			}
		},
		mounted: function(){
			// 编辑页日期控件
			$("#sliderEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#sliderEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#sliderEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#sliderEditForm input[ctl-type=decimal]").blur(function(){
				var value = $(this).val().replace(/[^\d\.]/g, '');
				var dotIndex = value.indexOf('.');
				if(dotIndex){
					var other = value.substr(dotIndex + 1);
					other = other.replace(/\./g, '');
					value = value.substr(0, dotIndex + 1) + other;
				}
				$(this).val(value);
			});
			//编辑页面初始化轮播图
			initSlider('sliderEditForm');
		}
	});

	// 新建页面初始化轮播图
	initSlider('sliderAddForm');
})

var sliderListModel, sliderItemModel;
var defaultImage = 'images/add.jpg';

function goAdd(){
	var pageName = getPageName();
	window.location.href = '#' + pageName + '?action=add';
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		$.loading.show({tips:'正在查询...'});
	}
	$("#sliderQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#sliderRefreshRows").val();
	$("#sliderQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'slider/search',
		data: $("#sliderQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#sliderTable input[type=checkbox]').prop('checked', false);
				sliderListModel.grid = data;
				$("#sliderTableBlock").show();
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
					url: 'slider/delete?id=' + ids.join(','),
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
function loadSliderItem(){
	var id = Utils.parseUrlParam(window.location.href, 'id');

	sliderItemModel.model.url = '';		// 必要，去掉会导致图片不回显，可能是由于cropper导致vue不能正确识别model的变化原因导致
	
	// 禁用裁剪和删除按钮
	$('#sliderEditForm button[name=cutButton]').addClass('disabled');
	$('#sliderEditForm button[name=deleteButton]').addClass('disabled');
	
	if(id){
		$("#div [action=edit]").hide();
		apiClient({
			url: 'slider/edit',
			data: {id:id},
			success: function(data){
				if(data.code == 0 && data.model){
					if(!data.model.url){
						data.model.url = defaultImage;
					}
					sliderItemModel.model = data.model;
				}else{
					alertError(data.message);
				}
			},
			complete: function(){
				$("#div [action=edit]").show();
				$.loading.hide();
			}
		})
	}else{
		$.loading.hide();
	}
}

/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			// 重置图片
			$('#sliderAddForm img[name=slider]').cropper('destroy');
			$('#sliderAddForm img[name=slider]').attr('src', defaultImage);
			$("#sliderImageFile").val('');
			
		}else if(action == 'edit'){
			$('#sliderEditForm img[name=slider]').cropper('destroy');
			$.loading.show({tips:'正在加载...'});
			loadSliderItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

function initSlider(formId){
	var sliderNode = $('#' + formId + ' img[name=slider]');
	var fileNode = $('#' + formId + ' input[name=imageFile]');
	var urlNode = $('#' + formId + ' input[name=url]');
	var cutButton = $('#' + formId + ' button[name=cutButton]');
	var deleteButton = $('#' + formId + ' button[name=deleteButton]');
	
	// 显示上传文件对话框
	sliderNode.click(function(){
		fileNode.click();
	});
	
	// 上传图片
	fileNode.change(function(){
		var file = $(this).get(0).files[0];

		if(file){
			showLoading('正在加载...');
			var reader = new FileReader();
			reader.addEventListener('load', function(){
				sliderNode.attr('src', reader.result);
				urlNode.val(sliderNode.attr('src'));
				
				cutButton.removeClass('disabled');
				deleteButton.removeClass('disabled');
				
//				sliderNode.cropper({
//			        viewMode: 3,
//			        dragMode: 'move',
//			        autoCropArea: 1,
//			        restore: false,
//			        modal: false,
//			        guides: false,
//			        highlight: false,
//			        cropBoxMovable: false,
//			        cropBoxResizable: false,
//			        toggleDragModeOnDblclick: false,
//			        ready: function () {
//			        	sliderNode.css({
//							width: '900px',
//							height: '450px',
//							maxWidth: '100%'
//			        	});
//						hideLoading();
//			        }
//				});
				
				sliderNode.cropper({
			        viewMode: 0,
			        dragMode: 'move',
			        guides: false,
			        toggleDragModeOnDblclick: false,
			        aspectRatio: 2/1,
			        ready: function () {
						hideLoading();
			        }
				});
				
			}, false);
			reader.readAsDataURL(file);
		}	 	
	});
	
	// 裁剪图片
	cutButton.click(function(){
		if($(this).hasClass('disabled')){
			return;
		}
		$(this).addClass('disabled');
		var data = sliderNode.cropper('getCroppedCanvas').toDataURL('image/jpeg');
		sliderNode.cropper('destroy');
		sliderNode.attr('src', data);
		urlNode.val(data);
		alert('裁剪完成');
	});
	
	// 删除图片
	deleteButton.click(function(){
		if($(this).hasClass('disabled')){
			return;
		}
		var self = this;
		confirm('是否要删除图片?', function(yes){
			if(yes){
				debugger;
				sliderNode.attr('src', defaultImage);
				sliderNode.cropper('destroy');
				$(self).addClass('disabled');
				cutButton.addClass('disabled');
			}
		});
	})
}

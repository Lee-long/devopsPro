
$(function(){
	var pageName = getPageName();
    paperListModel = new Vue({
        el: '#paperIdList',
        data: {
            items: []
        }
    });
	
	// 查询条件日期控件
	$("#examQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#examAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#examAddForm input[ctl-type=datetime]").datetimepicker({
		format: 'YYYY-MM-DD HH:mm',
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
	$("#examAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#examAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#examCancelButton').click(function(){
		$('#examAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#examQueryForm button[type="button"][name=examQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#examQueryForm button[type="button"][name=examExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#examQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'exam/export/all',
					data: $("#examQueryForm").serialize(),
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
/*
				// 异步导出
				$('#examQueryForm input[name=async]').val(1);
				$("#examAlert").hide();
				apiClient({
					url: 'exam/export/all',
					data: $("#examQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#examAlert").show();
						}else{
							alert(data.message);
						}
					}
				});
*/
			}
		});
	});
	
	// 新增记录提交
	$('#examAddButton').click(function(){
		var valid = true;
		
		// 考试名称
		var examNameNode = $("#examAddForm input[name=name]");
		if(examNameNode && examNameNode.length && !$.trim(examNameNode.val())){
			showToolTip(examNameNode);
			valid = false;
		}else{
                apiClient({
                      url: 'common/repository/exam/find',
                      data: {delete_status:1,name:examNameNode.val()},
                      async:false,
                      success: function(data){
                          if(data.model.length>0){
                              alert("考试名称已存在!")
                              valid = false;
                          }

                      }
                  });
             }
		// 关联试卷
		var examPaperIdNode = $("#examAddForm select[name=paper_id]");
		if(examPaperIdNode && examPaperIdNode.length && (!$.trim(examPaperIdNode.val()) || !validator.isNumeric($.trim(examPaperIdNode.val())))){
			examPaperIdNode.attr('title', '请选择关联试卷').tooltip('fixTitle');
			showToolTip(examPaperIdNode);
			valid = false;
		}
		// 考试开始时间
		var examBeginTimeNode = $("#examAddForm input[name=begin_time]");
		if(examBeginTimeNode && examBeginTimeNode.length && !$.trim(examBeginTimeNode.val())){
			showToolTip(examBeginTimeNode);
			valid = false;
		}
        if(examBeginTimeNode.val()<new Date().Format("yyyy-MM-dd hh:mm:ss")){
            examBeginTimeNode.attr("title","考试开始时间不能早于当前时间");
            showToolTip(examBeginTimeNode);
            examBeginTimeNode.attr("title","请输入考试开始时间");
            valid = false;
        }
		// 考试结束时间
		var examEndTimeNode = $("#examAddForm input[name=end_time]");
		if(examEndTimeNode && examEndTimeNode.length && !$.trim(examEndTimeNode.val())){
			showToolTip(examEndTimeNode);
			valid = false;
		}

		if(examBeginTimeNode.val()>examEndTimeNode.val()){
		    examEndTimeNode.attr("title","考试结束时间不能早于于开始时间");
		    showToolTip(examEndTimeNode);
		    examEndTimeNode.attr("title","请输入考试结束时间");
		    valid = false;
		}
		// 考试时长
		var examExamTimeNode = $("#examAddForm input[name=exam_time]");
		if(examExamTimeNode && examExamTimeNode.length && (!$.trim(examExamTimeNode.val()) || !validator.isNumeric($.trim(examExamTimeNode.val())))){
			examExamTimeNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examExamTimeNode);
			valid = false;
		}
		// 通过分数
		var examScoreNode = $("#examAddForm input[name=score]");
		if(examScoreNode && examScoreNode.length && (!$.trim(examScoreNode.val()) || !validator.isNumeric($.trim(examScoreNode.val())))){
			//examScoreNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examScoreNode);
			valid = false;
		}

		if(_totalScore>0&&examScoreNode.val().trim()!=""){
            var cur = parseInt(examScoreNode.val());
            if(cur-parseInt(_totalScore)>0){
               // examScoreNode.attr("title","通过分数不能超过试卷总分！");
               alert("通过分数不能超过试卷分数（"+_totalScore+"）")
                //showToolTip(examScoreNode);
               // examScoreNode.attr("title","请输入通过分数！");
                valid = false;
            }
        }

		// 状态0未发布1-已发布2-关闭
		/*var examStatusNode = $("#examAddForm input[name=status]");
		if(examStatusNode && examStatusNode.length && (!$.trim(examStatusNode.val()) || !validator.isNumeric($.trim(examStatusNode.val())))){
			examStatusNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(examStatusNode);
			valid = false;
		}*/
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'exam/add',
			method: 'post',
			data: $("#examAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#examQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#examAddForm button[type=reset]').click();
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
	
	// 导入文件
	$("#examImportExcel").click(function(){
		$("#examExcelFile").val('');
		$("#examExcelFile").click();
	});
	// 同步导入
	$("#examUploadForm").ajaxForm({
		url: _baseUrl + 'exam/import',
		dataType:'json',
		/*dataType:'xml',*/		// 解开此注释以支持ie9
//		uploadProgress: function(event, position, total, percentComplete){
//			hideLoading();
//			showLoading('正在上传' + percentComplete + '% ...');
//			if(percentComplete >= 100){
//				setTimeout(function(){
//					hideLoading();
//					showLoading('正在导入...');
//				}, 500);
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				/**
				 * 当dataType="xml"时,使用该函数获取返回对象中属性对应的value
				 */
				/* var text = parseXml(data, "tagName"); */
				hideLoading();
				doQuery();
			}else{
				hideLoading();
				alert(data.message);
			}
		},
		error: function(){
			hideLoading();
		}
	});
	$("#examExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#examUploadForm").submit();
	});

/*
	// 异步导入
	$("#examUploadForm").ajaxForm({
		url: _baseUrl + 'exam/import',
//		uploadProgress: function(event, position, total, percentComplete){
//			hideLoading();
//			showLoading('正在上传' + percentComplete + '% ...');
//			if(percentComplete >= 100){
//				hideLoading();
//			}
//		},
		success: function(data, textStatus, jqXHR, form){
			if(data.code == 0){
				taskHintModel.taskName = '文件导入';
				$("#examAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#examExcelFile").change(function(){
		$("#examAlert").hide();
		$('#examUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#examUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#examAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	examListModel = new Vue({
		el: '#examTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD HH:mm');
			},
			checkRow: function(e){
				var pk = $(e.target).parent().attr('pk');
				var node = $('input[type=checkbox][pk=' + pk + ']');
				node.prop('checked', !node.prop('checked'));
				
				if($('input[type=checkbox][pk]').length == $('input[type=checkbox][pk]:checked').length){
					$("#examCheckAll").prop('checked', true);
				}else{
					$("#examCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				if($(e.target).attr('enable')==0){
                    window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk');
                }else{
                    alert("只有未发布的考试才允许修改！")
                }
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
			formatEnableStatus: function(value){
            				var text = value;
            				if(value == 0){
            					text = '未发布';
            				}else if(value == 1){
            					text = '已发布';
            				}else if(value == 2){
            				    text = '关闭';
            				}
            				return text;
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
				var jumpNode = $('#examJumpNo');
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
					url: 'exam/export/query',
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
/*
				// 异步导出
				$("#examAlert").hide();
				apiClient({
					url: 'exam/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#examAlert").show();
						}else{
							alert(data.message);
						}
					}
				});
*/
			},
			exportAll: function(e){
				bootbox.confirm('是否要导出全部数据？', function(result){
					if(result){
						// 同步导出
						showLoading('正在导出...');
						apiClient({
							url: 'exam/export/all',
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
/*
						// 异步导出
						$("#examAlert").hide();
						apiClient({
							url: 'exam/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#examAlert").show();
								}else{
									alert(data.message);
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
	examItemModel = new Vue({
		el: '#examEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD HH:mm');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#examEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 考试名称
				var examNameNode = $("#examEditForm input[name=name]");
				if(examNameNode && examNameNode.length && !$.trim(examNameNode.val())){
					showToolTip(examNameNode);
					valid = false;
				}else{
                    if(examName!=examNameNode.val()){

                        apiClient({
                              url: 'common/repository/exam/find',
                              data: {delete_status:1,name:examNameNode.val()},
                              async:false,
                              success: function(data){
                                  if(data.model.length>0){
                                      alert("考试名称已存在!")
                                      valid = false;
                                  }

                              }
                          });
                    }

                 }
				// 关联试卷
				var examPaperIdNode = $("#examEditForm input[name=paper_id]");
				if(examPaperIdNode && examPaperIdNode.length && (!$.trim(examPaperIdNode.val()) || !validator.isNumeric($.trim(examPaperIdNode.val())))){
					examPaperIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examPaperIdNode);
					valid = false;
				}
				// 考试开始时间
				var examBeginTimeNode = $("#examEditForm input[name=begin_time]");
				if(examBeginTimeNode && examBeginTimeNode.length && !$.trim(examBeginTimeNode.val())){
					showToolTip(examBeginTimeNode);
					valid = false;
				}

				if(examBeginTimeNode.val()<new Date().Format("yyyy-MM-dd hh:mm:ss")){
                    examBeginTimeNode.attr("title","考试开始时间不能早于当前时间");
                    showToolTip(examBeginTimeNode);
                    examBeginTimeNode.attr("title","请输入考试开始时间");
                    valid = false;
                }
                // 考试结束时间
                var examEndTimeNode = $("#examEditForm input[name=end_time]");
                if(examEndTimeNode && examEndTimeNode.length && !$.trim(examEndTimeNode.val())){
                    showToolTip(examEndTimeNode);
                    valid = false;
                }

                if(examBeginTimeNode.val()>examEndTimeNode.val()){
                    examEndTimeNode.attr("title","考试结束时间不能早于于开始时间");
                    showToolTip(examEndTimeNode);
                    examEndTimeNode.attr("title","请输入考试结束时间");
                    valid = false;
                }



				// 考试时长
				var examExamTimeNode = $("#examEditForm input[name=exam_time]");
				if(examExamTimeNode && examExamTimeNode.length && (!$.trim(examExamTimeNode.val()) || !validator.isNumeric($.trim(examExamTimeNode.val())))){
					examExamTimeNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examExamTimeNode);
					valid = false;
				}
				// 通过分数
				var examScoreNode = $("#examEditForm input[name=score]");
				if(examScoreNode && examScoreNode.length && (!$.trim(examScoreNode.val()) || !validator.isNumeric($.trim(examScoreNode.val())))){
					//examScoreNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examScoreNode);
					valid = false;
				}
				if(_totalScore>0&&examScoreNode.val().trim()!=""){
                            var cur = parseInt(examScoreNode.val());
                            if(cur-parseInt(_totalScore)>0){
                               // examScoreNode.attr("title","通过分数不能超过试卷总分！");
                               alert("通过分数不能超过试卷分数（"+_totalScore+"）")
                                //showToolTip(examScoreNode);
                               // examScoreNode.attr("title","请输入通过分数！");
                                valid = false;
                            }
                        }
				// 状态0未发布1-已发布2-关闭
				var examStatusNode = $("#examEditForm input[name=status]");
				if(examStatusNode && examStatusNode.length && (!$.trim(examStatusNode.val()) || !validator.isNumeric($.trim(examStatusNode.val())))){
					examStatusNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(examStatusNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'exam/edit',
					method: 'post',
					data: $("#examEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#examEditForm button[type=reset]').click();
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
			$("#examEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#examEditForm input[ctl-type=datetime]").datetimepicker({
				format: 'YYYY-MM-DD HH:mm',
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
			$("#examEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#examEditForm input[ctl-type=decimal]").blur(function(){
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

var examListModel, examItemModel;

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
		showLoading('正在查询...');
	}
	$("#examQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#examRefreshRows").val();
	$("#examQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'exam/search',
		data: $("#examQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#examTable input[type=checkbox]').prop('checked', false);
				examListModel.grid = data;
				$("#examTableBlock").show();
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
					url: 'exam/delete?id=' + ids.join(','),
					type: 'delete',
					success: function(data){
						if(data.code == 0){
							hideLoading();
							doQuery();
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
var examName;
/**
 * 加载明细数据
 */
function loadExamItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'exam/edit',
			data: {id:id},
			success: function(data){
				$("#examEditBlock").show();
				if(data.code == 0 && data.model){
					examItemModel.model = data.model;
					examName = data.model.name;
					showByPqperId(data.model.paperId,1);
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

var paperListModel;
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
		
		if(action == 'add'){
			showLoading('正在加载...');
			apiClient({
                url: 'common/repository/paper/find',
                data: {delete_status:1,enable_status:1,type:1},
                success: function(data){
                    if(data.code == 0){
                        paperListModel.items = data.model;
                        if(data.model != null && data.model.length != 0) {
                        	showByPqperId(data.model[0].id,0);
                        }
                    }
                },
				complete: function(){
					hideLoading();
				}
            });
		}else if(action == 'edit'){
			loadExamItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		
 		var page = $("#examQueryForm input[name=page]").val();
		doQuery(page);
	}
}
function enabled(obj){
        if($(obj).attr("enable")==1){
            alert("考试已经发布！")
        }else if($(obj).attr("enable")==2){
            alert("已经关闭，不能发布！")
        }else{
            bootbox.confirm("真的要发布"+$(obj).attr("name")+"吗？考试发布后无论是否关闭都将无法修改。", function(result){
                if(result){
                        apiClient({
                            url: 'exam/enabled?id=' + $(obj).attr("pk"),
                            type: 'get',
                            success: function(data){
                                if(data.code == 0){
                                    doQuery();
                                }
                            }
                        });
                    }
                });
        }
  }
  function disable(obj){
          if($(obj).attr("enable")==2){
              alert("考试已经关闭！")
          }else{
              bootbox.confirm("真的要关闭"+$(obj).attr("name")+"吗？试卷关闭后无法修改。", function(result){
                  if(result){
                          apiClient({
                              url: 'exam/disabled?id='  + $(obj).attr("pk"),
                              type: 'get',
                              success: function(data){
                                  if(data.code == 0){
                                      doQuery();
                                  }
                              }
                          });
                      }
                  });
          }
    }
var _totalScore = 0;
function　showByPqperId(id,type){

        apiClient({
            url: 'exam/findPlanAndCourse',
            data: {id:id},
            success: function(data){
                if(data.code == 0){
                    if(type==0){
                        $("#planNameAdd").val(data.model.planName);
                        $("#courseNameAdd").val(data.model.courseName);
                    }else{
                        $("#planNameEdit").val(data.model.planName);
                        $("#courseNameEdit").val(data.model.courseName);
                    }
                    _totalScore = data.model.score;
                }
            }
        });
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
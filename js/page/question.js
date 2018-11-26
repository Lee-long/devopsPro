

//@ sourceURL=question.js
var searchLibraryModel;
$(function(){
	var pageName = getPageName();
  
	searchLibraryModel = new Vue({
            el: '#searchLibrary',
            data: {
                items: []
            }
        });
	// 查询条件日期控件
	$("#questionQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#questionAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#questionAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#questionAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#questionAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#questionCancelButton').click(function(){
		$('#questionAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#questionQueryForm button[type="button"][name=questionQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#questionQueryForm button[type="button"][name=questionExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#questionQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'question/export/all',
					data: $("#questionQueryForm").serialize(),
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
				$('#questionQueryForm input[name=async]').val(1);
				$("#questionAlert").hide();
				apiClient({
					url: 'question/export/all',
					data: $("#questionQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionAlert").show();
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
	$('#questionAddButton').click(function(){
		var valid = true;
        // 题库
		var questionLibraryNode = $("#questionAddForm select[name=library_id]");
		if(questionLibraryNode.val()==""){
            showToolTip(questionLibraryNode);
            valid = false;
        }
		// 题干
		var questionContentNode = $("#questionAddForm textarea[name=content]");
		if(questionContentNode && questionContentNode.length && !$.trim(questionContentNode.val())){
            showToolTip(questionContentNode);
            valid = false;
        }

        var type = $("#type").val();
        if(type==3){
            var questionJudgeNode = $("#questionAddForm input[name=judge]:checked");
            if(questionJudgeNode.val()==null){
                showToolTip($("#questionAddForm input[name=judge]"));
                valid = false;
            }
        }else if(type==2||type==1){
            // A
            var questionItem1Node = $("#questionAddForm textarea[name=item1]");
            if(questionItem1Node && questionItem1Node.length && !$.trim(questionItem1Node.val())){
                showToolTip(questionItem1Node);
                valid = false;
            }
            // B
            var questionItem2Node = $("#questionAddForm textarea[name=item2]");
            if(questionItem2Node && questionItem2Node.length && !$.trim(questionItem2Node.val())){
                showToolTip(questionItem2Node);
                valid = false;
            }
            // 正确答案
            //单选
            var questionAnswerNode = $("#questionAddForm input[name=answer]:checked");
            //alert(questionAnswerNode.val())
            if(questionAnswerNode.val()==null){
                showToolTip($("#questionAddForm input[name=answer]"));
                valid = false;
            }else{
                //判断答案对应的选项有没有填写
                 $.each(questionAnswerNode,function(){
                   if($(this).prev().val()==""){
                       showToolTip($(this));
                       valid = false;
                    }
                 })
            }
            var str="";
            $("input[name='answer']:checked").each(function(){
                str+=$(this).val();
            })
            $("#multiAnswer").val(str);
        }
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');


		apiClient({
			url: 'question/add',
			method: 'post',
			data: $("#questionAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
					var name = Utils.parseUrlParam(window.location.href, 'name');
					var page = Utils.parseUrlParam(window.location.href, 'page');  
					var url = "#"+getPageName()+"?library_id="+library_id+"&name="+name+"&page="+page;  
					window.location.href = url;
					$('#questionAddForm button[type=reset]').click();
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
	$("#questionImportExcel").click(function(){
		$("#questionExcelFile").val('');
//		showLoading('正在上传 ...');
		var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
		$("#questionUploadForm input[name=library_id]").val(library_id); 
		$("#questionExcelFile").click();
	});
	// 同步导入
	$("#questionUploadForm").ajaxForm({
		url: _baseUrl + 'question/import',
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
				alert("导入失败，请检查模板文件是否正确!");
			}
		},
		error: function(){
			hideLoading();
		}
	});
	$("#questionExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#questionUploadForm").submit();
	});

/*
	// 异步导入
	$("#questionUploadForm").ajaxForm({
		url: _baseUrl + 'question/import',
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
				$("#questionAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#questionExcelFile").change(function(){
		$("#questionAlert").hide();
		$('#questionUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#questionUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#questionAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	questionListModel = new Vue({
		el: '#questionTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatType: function(value){
				var text = value;
				if(value == 1){
					text = '单选题';
				}else if(value == 2){
					text = '多选题';
				}else if(value == 3){
                    text = '判断题';
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
					$("#questionCheckAll").prop('checked', true);
				}else{
					$("#questionCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
				var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
				var name = Utils.parseUrlParam(window.location.href, 'name');
				var page = Utils.parseUrlParam(window.location.href, 'page');  
				var url = "#"+getPageName()+"?library_id="+library_id+"&name="+name+"&page="+page;  
				window.location.href = url + "&action=edit&id=" + $(e.target).attr('pk');
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
				var jumpNode = $('#questionJumpNo');
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
					url: 'question/export/query',
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
				$("#questionAlert").hide();
				apiClient({
					url: 'question/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionAlert").show();
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
							url: 'question/export/all',
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
						$("#questionAlert").hide();
						apiClient({
							url: 'question/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#questionAlert").show();
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
	questionItemModel = new Vue({
		el: '#questionEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#questionEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 题干
                var questionContentNode = $("#questionEditForm textarea[name=content]");
                if(questionContentNode && questionContentNode.length && !$.trim(questionContentNode.val())){
                    showToolTip(questionContentNode);
                    valid = false;
                }

                // 正确答案
                //单选
                if($(".hideJudge").css("display")!="none"){

                }else{
                    // A
                    var questionItem1Node = $("#questionEditForm textarea[name=item1]");
                    if(questionItem1Node && questionItem1Node.length && !$.trim(questionItem1Node.val())){
                        showToolTip(questionItem1Node);
                        valid = false;
                    }
                    // B
                    var questionItem2Node = $("#questionEditForm textarea[name=item2]");
                    if(questionItem2Node && questionItem2Node.length && !$.trim(questionItem2Node.val())){
                        showToolTip(questionItem2Node);
                        valid = false;
                    }
                    var questionAnswerNode = $("#questionEditForm input[name=answerEdit]:checked");
                    //alert(questionAnswerNode.val())
                    if(questionAnswerNode.val()==null){
                        showToolTip($("#questionEditForm input[name=answerEdit]"));
                        valid = false;
                    }else{
                        //判断答案对应的选项有没有填写
                         $.each(questionAnswerNode,function(){
                           if($(this).prev().val()==""){
                               showToolTip($(this));
                               valid = false;
                            }
                         })
                    }
                    var str="";
                    $("input[name='answerEdit']:checked").each(function(){
                        str+=$(this).val();
                    })
                    $("#multiAnswerEdit").val(str);
                }

				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'question/edit',
					method: 'post',
					data: $("#questionEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							
							var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
							var name = Utils.parseUrlParam(window.location.href, 'name');
							var page = Utils.parseUrlParam(window.location.href, 'page');  
							var url = "#"+getPageName()+"?library_id="+library_id+"&name="+name+"&page="+page;  
							window.location.href = url;
							
							//
							//	$('#questionEditForm button[type=reset]').click();
							//doQuery();
							//hideLoading();
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
			$("#questionEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#questionEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#questionEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#questionEditForm input[ctl-type=decimal]").blur(function(){
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

var questionListModel, questionItemModel;

function goAdd(type){
    $("#type").val(type)
    $('#questionAddForm button[type=reset]').click();
	var pageName = getPageName();
	$(".hideSpan").hide();
	$("input[name=judge]").hide();
	$(".item").show();
	$("#add1").show();
    $("#del1").show();
	if(type==1){//单选题
	    $("input[name=answer]").attr("type","radio");
	}else if(type==2){//多选题
        $("input[name=answer]").attr("type","checkbox");
	}else{//判断题
	    $(".hideSpan").show();
        $("input[name=judge]").show();
        $(".item").hide();
        $("#add1").hide();
        $("#del1").hide();
	}  
	var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
	var name = Utils.parseUrlParam(window.location.href, 'name');
	var page = Utils.parseUrlParam(window.location.href, 'page');  
	var url = "#"+getPageName()+"?library_id="+library_id+"&name="+name+"&page="+page; 
	window.location.href =url +'&action=add'; 
}

/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
	$("#questionQueryForm input[name=library_id]").val(library_id);
	if(!action){
		showLoading('正在查询...');
	}
	$("#questionQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#questionRefreshRows").val();
	$("#questionQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'question/search',
		data: $("#questionQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#questionTable input[type=checkbox]').prop('checked', false);
				questionListModel.grid = data;
				$("#questionTableBlock").show();
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

	apiClient({
        url: 'common/repository/questionLibrary/find',
        data: {delete_status:1},
        success: function(data){
            if(data.code == 0){
                // 查询下拉框
                    searchLibraryModel.items = data.model;
            }
        }
    });
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
                        url: 'question/delete?id=' + ids.join(','),
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
				/*$.each(ids,function(index,el){
                        apiClient({
                            url: 'paperQuestion/findPaper',
                            data: {id:el},
                            success: function(data){
                                if(data.code == 0){
                                    // 查询下拉框
                                    if(data.model.length>0){
                                        alert("试题已经关联未关闭的试卷，不能删除！");
                                    }else{
                                        apiClient({
                                            url: 'question/delete?id=' + el,
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
                                }
                            }
                        });
                    })*/
			}
		});	
	}
}

/**
 * 加载明细数据
 */
function loadQuestionItem(){
var questionAnswerNode1 = $("#questionEditForm input[name=answerEdit]");
                     $.each(questionAnswerNode1,function(){
                           $(this).attr("checked",false);
                     })

	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'question/edit',
			data: {id:id},
			success: function(data){
				$("#questionEditBlock").show();
				if(data.code == 0 && data.model){
					questionItemModel.model = data.model;
					var type = data.model.type;
					$('#questionEditForm button[type=reset]').click();
                    $(".itemEdit").show();
                    $("#add2").show();
                    $("#del2").show();
                    setTimeout(function(){

                        $("#questionEditForm .hideSpan").hide();
                        $("#questionEditForm input[name=judgeEdit]").hide();
                        if(type==1){//单选题
                            $("#questionEditForm input[name=answerEdit]").attr("type","radio");
                            ///
                            setTimeout(function(){
                                var questionAnswerNode = $("#questionEditForm input[name=answerEdit]");
                                 $.each(questionAnswerNode,function(){
                                   if($(this).val()==data.model.answer.correctAnswer){
                                       $(this).attr("checked",true);
                                    }
                                 })
                            },100)


                        }else if(type==2){//多选题
                            $("#questionEditForm input[name=answerEdit]").attr("type","checkbox");
                            setTimeout(function(){
                                var questionAnswerNode = $("#questionEditForm input[name=answerEdit]");
                                 $.each(questionAnswerNode,function(){

                                   if(data.model.answer.correctAnswer.indexOf($(this).val())>-1){
                                       $(this).attr("checked",true);
                                    }
                                 })
                            },100)

                        }else if(type==3){//判断题
                            setTimeout(function(){
                                var questionAnswerNode = $("#questionEditForm input[name=judgeEdit]");
                                 $.each(questionAnswerNode,function(){
                                   if($(this).val()==data.model.answer.correctAnswer){
                                       $(this).attr("checked",true);
                                    }
                                 })
                            },100)
                            $("#add2").hide();
                            $("#del2").hide();
                            $("#questionEditForm .hideSpan").show();
                            $("#questionEditForm input[name=judgeEdit]").show();
                            $("#questionEditForm .itemEdit").hide();
                        }
                    },10)
                    $("#editItems").data("count",0);
                    $("#editItems").empty();
                    setTimeout(function(){
                        if(type!=3){
                            if(questionItemModel.model.items.length>4){
                                for(var i=0;i<questionItemModel.model.items.length-4;i++){
                                    addItems2();
                                }
                            }
                            $.each(questionItemModel.model.items,function(index,el){
                                   $("#questionEditForm textarea[name=item]").eq(index).val(el.content);
                             })
                        }
                    },100)

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
var oldLibraryId;
/**
 * 路由地址回调
 */
function routeCallBack(){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
		var name = Utils.parseUrlParam(window.location.href, 'name');
		var page = Utils.parseUrlParam(window.location.href, 'page');  
		var url = "#"+getPageName()+"?library_id="+library_id+"&name="+name+"&page="+page;

		$('#back').show(); 	 
		$('#back').attr('href',url);
		$('#back').click(function(){
			$('#back').hide();
		});
		if(action == 'add'){ 
			apiClient({
                url: 'question/findQuestion',
                data:{library_id:library_id},
                success: function(data){
                    if(data.code == 0){
                    	$("#questionAddForm input[name=library_id]").val(data.model.id);
                    	$("#questionAddForm label[name=library_name]").html(data.model.name);
                    	
                    }
                }
            });
		}else if(action == 'edit'){ 
			var library_id = Utils.parseUrlParam(window.location.href, 'library_id');
			var name = Utils.parseUrlParam(window.location.href, 'name');
			var page = Utils.parseUrlParam(window.location.href, 'page');  
			var url = "#"+getPageName()+"?library_id="+library_id+"&name="+name+"&page="+page;

			$('#back').show(); 	 
			$('#back').attr('href',url);
			$('#back').click(function(){
				$('#back').hide();
			});
			loadQuestionItem();
		}
	}else{
		$('#back').show();
		$('div[action]').hide();
		$('div[action="query"]').show(); 
 		var name = Utils.parseUrlParam(window.location.href, 'name');
 		var page = Utils.parseUrlParam(window.location.href, 'page');
 		var url = '#questionLibrary?page='+page+"&name="+name;
		
		$('#back').attr('href',url);
		$('#back').click(function(){
			$('#back').hide();
		});
		
		var questionPage = $("#questionQueryForm input[name=page]").val();
		doQuery(questionPage);
	}
}
function downFile(){
      apiClient({
        url: 'question/export/file', 
        success: function(data){
            if(data.code == 0){
            	alert(data.url);
                window.location.href = data.url;
            }
        },
        complete: function(){
            hideLoading();
        }
    });
}
var chars = ["E","F","G","H","I","J","K","L","M","N"];
function addItems(){
    var count = $("#addItems").data("count");
    if(count>9){
        alert("选项过多！");
    }else{
        var _html = '<div class="form-group item"><label class="col-sm-3 control-label no-padding-right">选项'+chars[count]+'</label>';
            _html+='<div class="col-sm-9"><textarea data-rel="tooltip" data-placement="right" class="tooltip-warning txt-area" name="item" maxlength="200" placeholder="请输入内容" title="请输入内容"></textarea>';
            _html+='<input style="margin-left:2px" type="'+$("#addItems").prev().children().find("input").attr("type")+'" data-placement="right" class="tooltip-warning" name="answer"title="请选择正确答案" value="'+chars[count]+'"/>正确答案</div></div>'

        $("#addItems").append(_html);
        count++;
        $("#addItems").data("count",count);
    }

}
function delItems(){
    var count = $("#addItems").data("count");
    if(count==0){
        alert("选项D不支持删除！");
    }else{
        $("#addItems .form-group ").eq(count-1).remove();
        count--;
        $("#addItems").data("count",count);
    }

}
function addItems2(){
    var count = $("#editItems").data("count");
    if(count>9){
        alert("选项过多！");
    }else{
        var _html = '<div class="form-group item"><label class="col-sm-3 control-label no-padding-right">选项'+chars[count]+'</label>';
            _html+='<div class="col-sm-9"><textarea data-rel="tooltip" data-placement="right" class="tooltip-warning txt-area" name="item" maxlength="200" placeholder="请输入内容" title="请输入内容"></textarea>';
            _html+='<input style="margin-left:2px" type="'+$("#editItems").prev().children().find("input").attr("type")+'" data-placement="right" class="tooltip-warning" name="answerEdit"title="请选择正确答案" value="'+chars[count]+'"/>正确答案</div></div>'

        $("#editItems").append(_html);
        count++;
        $("#editItems").data("count",count);
    }

}
function delItems2(){
    var count = $("#editItems").data("count");
    if(count==0){
        alert("选项D不支持删除！");
    }else{
        $("#editItems .form-group ").eq(count-1).remove();
        count--;
        $("#editItems").data("count",count);
    }

}
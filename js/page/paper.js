
$(function(){
	var pageName = getPageName();
	planListModel = new Vue({
            el: '#planList',
            data: {
                items: []
            }
        });
	// 查询条件日期控件
	$("#paperQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#paperAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#paperAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#paperAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#paperAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#paperCancelButton').click(function(){
		$('#paperAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#paperQueryForm button[type="button"][name=paperQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#paperQueryForm button[type="button"][name=paperExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#paperQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'paper/export/all',
					data: $("#paperQueryForm").serialize(),
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
				$('#paperQueryForm input[name=async]').val(1);
				$("#paperAlert").hide();
				apiClient({
					url: 'paper/export/all',
					data: $("#paperQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#paperAlert").show();
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
	$('#paperAddButton').click(function(){
		var valid = true;
		
		// 试卷名称
		var paperNameNode = $("#paperAddForm input[name=name]");
		if(paperNameNode && paperNameNode.length && !$.trim(paperNameNode.val())){
			showToolTip(paperNameNode);
			valid = false;
		}
		// 课程id
        var questionnaireTeacherCourseIdNode = $("#paperAddForm select[name=course_id]");
        if(questionnaireTeacherCourseIdNode && questionnaireTeacherCourseIdNode.length && (!$.trim(questionnaireTeacherCourseIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherCourseIdNode.val())))){
            //questionnaireTeacherCourseIdNode.attr('title', '格式错误').tooltip('fixTitle');
            showToolTip(questionnaireTeacherCourseIdNode);
            valid = false;
        }
        
        // 试卷名称
		var libraryNode = $("#paperAddForm input[name=library_name]");
		if(libraryNode && libraryNode.length && !$.trim(libraryNode.val())){
			showToolTip(libraryNode);
			valid = false;
		}
		
        // 总分
        var paperScore = $("#paperAddForm input[name=total_score]");
        console.log(paperScore)
        if($.trim(paperScore.val())=="0"){
            showToolTip(paperScore);
            valid = false;
        }

		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'paper/add',
			method: 'post',
			data: $("#paperAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#paperQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#paperAddForm button[type=reset]').click();
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
	$("#paperImportExcel").click(function(){
		$("#paperExcelFile").val('');
		$("#paperExcelFile").click();
	});
	// 同步导入
	$("#paperUploadForm").ajaxForm({
		url: _baseUrl + 'paper/import',
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
	$("#paperExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#paperUploadForm").submit();
	});

/*
	// 异步导入
	$("#paperUploadForm").ajaxForm({
		url: _baseUrl + 'paper/import',
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
				$("#paperAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#paperExcelFile").change(function(){
		$("#paperAlert").hide();
		$('#paperUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#paperUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#paperAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	paperListModel = new Vue({
		el: '#paperTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatTargetUser: function(value){
				var text = value;
				if(value == 1){
					text = '初级学员';
				}else if(value == 2){
					text = '中级学员';
				}else if(value == 3){
					text = '高级学员';
				}
				return text;
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
			formatType: function(value){
				var text = value;
				if(value == 1){
					text = '考试';
				}else if(value == 2){
					text = '练习';
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
					$("#paperCheckAll").prop('checked', true);
				}else{
					$("#paperCheckAll").prop('checked', false);
				}
			},
			checkAll: function(e){
				$('input[type=checkbox][pk]').prop('checked', $(e.target).prop('checked'));
			},
			goEdit: function(e){
			    if($(e.target).attr('enable')==0){
				    window.location.href = "#" + pageName + "?action=edit&id=" + $(e.target).attr('pk');
			    }else{
			        alert("只有未发布的试卷才允许修改！")
			    }
			},
			deleteRow: function(e){

			    if($(e.target).attr('enable')=="0"){
			      doDelete([$(e.target).attr('pk')]);
			    }else{
			        alert("只能删除未发布的试卷！")
			    }

			},
			deleteRows: function(e){
				var ids = [];

				$('input[type=checkbox][pk]:checked').each(function(){
				    if($(this).attr('enable')=="0"){
                     ids.push($(this).attr('pk'));
                    }else{
                        alert("只能删除未发布的试卷！")
                    }
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
				var jumpNode = $('#paperJumpNo');
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
					url: 'paper/export/query',
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
				$("#paperAlert").hide();
				apiClient({
					url: 'paper/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#paperAlert").show();
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
							url: 'paper/export/all',
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
						$("#paperAlert").hide();
						apiClient({
							url: 'paper/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#paperAlert").show();
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
	paperItemModel = new Vue({
		el: '#paperEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#paperEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 试卷名称
				var paperNameNode = $("#paperEditForm input[name=name]");
				if(paperNameNode && paperNameNode.length && !$.trim(paperNameNode.val())){
					showToolTip(paperNameNode);
					valid = false;
				}
				// 课程id
                var questionnaireTeacherCourseIdNode = $("#paperEditForm select[name=course_id]");
                if(questionnaireTeacherCourseIdNode && questionnaireTeacherCourseIdNode.length && (!$.trim(questionnaireTeacherCourseIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherCourseIdNode.val())))){
                    //questionnaireTeacherCourseIdNode.attr('title', '格式错误').tooltip('fixTitle');
                    showToolTip(questionnaireTeacherCourseIdNode);
                    valid = false;
                }
                // 题库
				var libraryNode = $("#paperEditForm input[name=library_name]");
				if(libraryNode && libraryNode.length && !$.trim(libraryNode.val())){
					showToolTip(libraryNode);
					valid = false;
				}
				
				var paperScore = $("#paperEditForm input[name=total_score]");
                if($.trim(paperScore.val())=="0"){
                    showToolTip(paperScore);
                    valid = false;
                }
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'paper/edit',
					method: 'post',
					data: $("#paperEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#paperEditForm button[type=reset]').click();
							doQuery();
							hideLoading();
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
			$("#paperEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#paperEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#paperEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#paperEditForm input[ctl-type=decimal]").blur(function(){
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

var paperListModel, paperItemModel;

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
	$("#paperQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#paperRefreshRows").val();
	$("#paperQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'paper/search',
		data: $("#paperQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#paperTable input[type=checkbox]').prop('checked', false);
				paperListModel.grid = data;
				$("#paperTableBlock").show();
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
					url: 'paper/delete?id=' + ids.join(','),
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
var questionListModel, questionItemModel,planListModel;
/**
 * 加载明细数据
 */
function loadPaperItem(){
	showLoading('正在加载...');
	debugger;
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'paper/edit',
			data: {id:id},
			success: function(data){
				$("#paperEditBlock").show();
				if(data.code == 0 && data.model){
					var planList = data.model.plans;
					for (var index in planList) {
						planList[index].planName = planList[index].planName + '-' + planList[index].implementYear + '年度';
                	}
					paperItemModel.model = data.model;
					showLibrary(data.model.libraryId,1)
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
	if(action){
		// 根据用户动作显示相应画面
		$('div[action]').hide();
		$('div[action="' + action + '"]').show();
		
		if(action == 'add'){
			showLoading('正在加载...');
            apiClient({
                url: 'plan/getImplementedPlan',
                data: {type:1},
                success: function(data){
                    if(data.code == 0){
                    	for (var index in data.model) {
                    		data.model[index].planName = data.model[index].planName + '-' +data.model[index].implementYear + '年度';
                    	}
                        planListModel.items = data.model;
                        showCourse(data.model[0].id,0)
                    }
                },
				complete: function(){
					hideLoading();
				}
            });
		}else if(action == 'edit'){
			loadPaperItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();

 		var page = $("#paperQueryForm input[name=page]").val();
		doQuery(page);
	}
}
function showCourse(planId,type){
     apiClient({
    	 url: 'course/findCourses',
	     data: {plan_id:planId,implementation_status:2},
         success: function(data){
             if(data.code == 0){
                 if(type==0){//add
                     $("#courseIdList").empty();
                     $.each(data.model,function(index,el){
                         $("#courseIdList").append("<option value='"+el.id+"'>"+el.courseName+"</option>")
                     })
                     showQuestionLibrary(data.model[0].id,0)
                 }else{//edit
                     $("#courseIdListEdit").empty();
                     $.each(data.model,function(index,el){
                         $("#courseIdListEdit").append("<option value='"+el.id+"'>"+el.courseName+"</option>")
                     })
                     showQuestionLibrary(data.model[0].id,1)
                 }

             }

         }
     });
 }

function showQuestionLibrary(courseId,type){
    apiClient({
   	 url: 'questionLibrary/findLibrary',
	     data: {'courseId':courseId},
        success: function(data){
        	debugger;
            if(data.code == 0){
                if(type==0){//add
                	if(data.model != null) {
                		$('#paperAddForm input[name=library_id]').val(data.model.id);
                        $('#paperAddForm input[name=library_name]').val(data.model.name);
                        showLibrary(data.model.id,0);
                	} else {
                		$('#paperAddForm input[name=library_id]').val('');
                        $('#paperAddForm input[name=library_name]').val('');
                		showLibrary(null,0);
                	}
                	$('#paperAddForm input[name=count]').val(0);
                	$('#paperAddForm input[name=score]').val(0);
                	$('#paperAddForm input[name=total_score]').val(0);
                }else{//edit
                	if(data.model != null) {
                		$('#paperEditForm input[name=library_id]').val(data.model.id);
                        $('#paperEditForm input[name=library_name]').val(data.model.name);
                        showLibrary(data.model.id,1);
                	} else {
                		$('#paperEditForm input[name=library_id]').val('');
                        $('#paperEditForm input[name=library_name]').val('');
                		showLibrary(null,1);
                	}
                	$('#paperEditForm input[name=count]').val(0);
                	$('#paperEditForm input[name=score]').val(0);
                	$('#paperEditForm input[name=total_score]').val(0);
                }
            }
        }
    });
}
 function showLibrary(library_id,type){
	 if(library_id != null) {
		 apiClient({
	          url: 'paper/findCountByLibraryId',
	          data: {id:library_id},
	          success: function(data){
	              if(data.code == 0){
	                  if(type==0){//add
	                        $("#libraryCountSingle").text(0);
	                        $("#libraryCountMulti").text(0);
	                        $("#libraryCountJudge").text(0);
	                        $.each(data.model,function(index,el){
	                            if(el.type==1){
	                                $("#libraryCountSingle").text(el.count)
	                            }else if(el.type==2){
	                                $("#libraryCountMulti").text(el.count)
	                            }else if(el.type==3){
	                                $("#libraryCountJudge").text(el.count)
	                            }
	                        })
	                  }else{//edit
	                        $("#editlibraryCountSingle").text(0);
	                        $("#editlibraryCountMulti").text(0);
	                        $("#editlibraryCountJudge").text(0);
	                        $.each(data.model,function(index,el){
	                            if(el.type==1){
	                                $("#editlibraryCountSingle").text(el.count)
	                            }else if(el.type==2){
	                                $("#editlibraryCountMulti").text(el.count)
	                            }else if(el.type==3){
	                                $("#editlibraryCountJudge").text(el.count)
	                            }
	                        })
	                  }

	              }

	          }
	      });
	 } else {
		 if(type==0){//add
             $("#libraryCountSingle").text(0);
             $("#libraryCountMulti").text(0);
             $("#libraryCountJudge").text(0);
       }else{//edit
             $("#editlibraryCountSingle").text(0);
             $("#editlibraryCountMulti").text(0);
             $("#editlibraryCountJudge").text(0);
       }
	 }
      
  }
  function judge(obj){
     if(parseInt($(obj).val())>parseInt($(obj).next().text())){
        $(obj).val(0)
     }
     if($(obj).val().trim()==""){
        $(obj).val(0)
     }
     total(0)
  }
  function judgeEdit(obj){
       if(parseInt($(obj).val())>parseInt($(obj).next().text())){
          $(obj).val(0)
       }
       if($(obj).val().trim()==""){
           $(obj).val(0)
        }
       total(1)
    }
  function total(type){
      if(type==0){//add
          $.each($(".addScore"),function(index,el){
                if($(this).val().trim()==""){
                    $(this).val(0);
                }
          })
          var v1 = parseInt($(".addScore").eq(0).val())*parseInt($("#libraryCountSingle").prev().val());
          var v2 = parseInt($(".addScore").eq(1).val())*parseInt($("#libraryCountMulti").prev().val());
          var v3 = parseInt($(".addScore").eq(2).val())*parseInt($("#libraryCountJudge").prev().val());

          $("#totalScore").val(v1+v2+v3)
     }else{//edit
          $.each($(".editScore"),function(index,el){
              if($(this).val().trim()==""){
                  $(this).val(0);
              }
        })
          var v1 = parseInt($(".editScore").eq(0).val())*parseInt($("#editlibraryCountSingle").prev().val());
          var v2 = parseInt($(".editScore").eq(1).val())*parseInt($("#editlibraryCountMulti").prev().val());
          var v3 = parseInt($(".editScore").eq(2).val())*parseInt($("#editlibraryCountJudge").prev().val());

          $("#totalScoreEdit").val(v1+v2+v3)
     }
  }
  function enabled(obj){
        if($(obj).attr("enable")==1){
            alert("试卷已经发布！")
        }else if($(obj).attr("enable")==2){
            alert("已经关闭，不能发布！")
        }else{
            bootbox.confirm("真的要发布"+$(obj).attr("name")+"吗？试卷发布后无论是否关闭都将无法修改。", function(result){
                if(result){
                        apiClient({
                            url: 'paper/enabled?id=' + $(obj).attr("pk"),
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
              alert("试卷已经关闭！")
          }else{
              bootbox.confirm("真的要关闭"+$(obj).attr("name")+"吗？试卷关闭后无法修改。", function(result){
                  if(result){
                           apiClient({
                                   url: 'common/repository/exam/find',
                                   data: {paper_id:$(obj).attr("pk"),status:1},
                                   async:false,
                                   success: function(data){
                                       if(data.code == 0){
                                           if(data.model.length>0){
                                                alert("有关联的考试处于发布状态，不能关闭试卷")
                                           }else{
                                                apiClient({
                                                  url: 'paper/disabled?id='  + $(obj).attr("pk"),
                                                  type: 'get',
                                                  success: function(data){
                                                      if(data.code == 0){
                                                          doQuery();
                                                      }
                                                  }
                                              });
                                           }
                                       }
                                   }
                               });

                      }
                  });
          }
    }
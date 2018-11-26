
$(function(){
	var pageName = getPageName();
	
	// 新增页下拉框
    planIdListModel = new Vue({
        el: '#planIdList',
        data: {
            items: []
        }
    });
    // 新增页下拉框
    teacherIdListModel = new Vue({
        el: '#teacherIdList',
        data: {
            items: []
        }
    });
    courseIdListModel = new Vue({
        el: '#courseIdList',
        data: {
            items: []
        }
    });
	
	// 查询条件日期控件
	$("#questionnaireTeacherQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#questionnaireTeacherAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#questionnaireTeacherAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#questionnaireTeacherAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#questionnaireTeacherAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#questionnaireTeacherCancelButton').click(function(){
		$('#questionnaireTeacherAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#questionnaireTeacherQueryForm button[type="button"][name=questionnaireTeacherQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#questionnaireTeacherQueryForm button[type="button"][name=questionnaireTeacherExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#questionnaireTeacherQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'questionnaireTeacher/export/all',
					data: $("#questionnaireTeacherQueryForm").serialize(),
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
				$('#questionnaireTeacherQueryForm input[name=async]').val(1);
				$("#questionnaireTeacherAlert").hide();
				apiClient({
					url: 'questionnaireTeacher/export/all',
					data: $("#questionnaireTeacherQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireTeacherAlert").show();
						}else{
							alert(data.message);
						}
					}
				});
*/
			}
		});
	});

    //删除评价
    $("body").on("click",".evaluateDelete",function(){
        $(this).parents("tr").remove();
    })
	
	// 新增记录提交
	$('#questionnaireTeacherAddButton').click(function(){
		var valid = true;
		
		// 计划id
		var questionnaireTeacherPlanIdNode = $("#questionnaireTeacherAddForm select[name=plan_id]");
		if(questionnaireTeacherPlanIdNode && questionnaireTeacherPlanIdNode.length && (!$.trim(questionnaireTeacherPlanIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherPlanIdNode.val())))){
			//questionnaireTeacherPlanIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireTeacherPlanIdNode);
			valid = false;
		}
		
		// 课程id
		var questionnaireTeacherCourseIdNode = $("#questionnaireTeacherAddForm select[name=course_id]");
		if(questionnaireTeacherCourseIdNode && questionnaireTeacherCourseIdNode.length && (!$.trim(questionnaireTeacherCourseIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherCourseIdNode.val())))){
			//questionnaireTeacherCourseIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireTeacherCourseIdNode);
			valid = false;
		}
		
		// 讲师id
		var questionnaireTeacherTeacherIdNode = $("#questionnaireTeacherAddForm select[name=teacher_id]");
		if(questionnaireTeacherTeacherIdNode && questionnaireTeacherTeacherIdNode.length && (!$.trim(questionnaireTeacherTeacherIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherTeacherIdNode.val())))){
			questionnaireTeacherTeacherIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(questionnaireTeacherTeacherIdNode);
			valid = false;
		}
		
		apiClient({
                url: 'questionnaireTeacher/findByTeacherCourseId',
                data: {id:questionnaireTeacherTeacherIdNode.val(),
                	courseId:questionnaireTeacherCourseIdNode.val()
                },
                async:false,
                success: function(data){
                    if(data.message == 0){
                    	questionnaireTeacherTeacherIdNode.attr('title', '所选教师已有问卷').tooltip('fixTitle');
                        showToolTip(questionnaireTeacherTeacherIdNode);
                        valid = false;
                    }
                }
            })


        var item_ids = new Array();
        $.each($("#questionnaireTeacherAddForm select[name=item_id"),function(index,el){
            if($(this).val()!="")
            item_ids.push($(this).val());
        })
        if(item_ids.length>0){
            if(isRepeat(item_ids)){
                alert("评价项不能重复，请重新选择！")
                valid=false;
            }
        }
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'questionnaireTeacher/add',
			method: 'post',
			data: $("#questionnaireTeacherAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#questionnaireTeacherQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#questionnaireTeacherAddForm button[type=reset]').click();
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
	$("#questionnaireTeacherImportExcel").click(function(){
		$("#questionnaireTeacherExcelFile").val('');
		$("#questionnaireTeacherExcelFile").click();
	});
	// 同步导入
	$("#questionnaireTeacherUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireTeacher/import',
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
	$("#questionnaireTeacherExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#questionnaireTeacherUploadForm").submit();
	});

/*
	// 异步导入
	$("#questionnaireTeacherUploadForm").ajaxForm({
		url: _baseUrl + 'questionnaireTeacher/import',
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
				$("#questionnaireTeacherAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#questionnaireTeacherExcelFile").change(function(){
		$("#questionnaireTeacherAlert").hide();
		$('#questionnaireTeacherUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#questionnaireTeacherUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#questionnaireTeacherAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	questionnaireTeacherListModel = new Vue({
		el: '#questionnaireTeacherTableBlock',
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
					$("#questionnaireTeacherCheckAll").prop('checked', true);
				}else{
					$("#questionnaireTeacherCheckAll").prop('checked', false);
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
				var jumpNode = $('#questionnaireTeacherJumpNo');
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
					url: 'questionnaireTeacher/export/query',
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
				$("#questionnaireTeacherAlert").hide();
				apiClient({
					url: 'questionnaireTeacher/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#questionnaireTeacherAlert").show();
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
							url: 'questionnaireTeacher/export/all',
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
						$("#questionnaireTeacherAlert").hide();
						apiClient({
							url: 'questionnaireTeacher/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#questionnaireTeacherAlert").show();
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
	questionnaireTeacherItemModel = new Vue({
		el: '#questionnaireTeacherEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#questionnaireTeacherEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				// 计划id
				var questionnaireTeacherPlanIdNode = $("#questionnaireTeacherEditForm select[name=plan_id]");
				if(questionnaireTeacherPlanIdNode && questionnaireTeacherPlanIdNode.length && (!$.trim(questionnaireTeacherPlanIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherPlanIdNode.val())))){
					//questionnaireTeacherCourseIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireTeacherPlanIdNode);
					valid = false;
				}
				
				// 课程id
				var questionnaireTeacherCourseIdNode = $("#questionnaireTeacherEditForm select[name=course_id]");
				if(questionnaireTeacherCourseIdNode && questionnaireTeacherCourseIdNode.length && (!$.trim(questionnaireTeacherCourseIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherCourseIdNode.val())))){
					//questionnaireTeacherCourseIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireTeacherCourseIdNode);
					valid = false;
				}
				
				// 讲师id
				var questionnaireTeacherTeacherIdNode = $("#questionnaireTeacherEditForm select[name=teacher_id]");
				if(questionnaireTeacherTeacherIdNode && questionnaireTeacherTeacherIdNode.length && (!$.trim(questionnaireTeacherTeacherIdNode.val()) || !validator.isNumeric($.trim(questionnaireTeacherTeacherIdNode.val())))){
					questionnaireTeacherTeacherIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(questionnaireTeacherTeacherIdNode);
					valid = false;
				}
				
				if(oldTeacherId!=questionnaireTeacherTeacherIdNode.val()){
                    apiClient({
	                    	url: 'questionnaireTeacher/findByTeacherId',
	                        data: {id:questionnaireTeacherTeacherIdNode.val()},
	                        async:false,
	                        success: function(data){
	                            if(data.message == 0){
	                            	questionnaireTeacherTeacherIdNode.attr('title', '所选教师已有问卷').tooltip('fixTitle');
	                                showToolTip(questionnaireTeacherTeacherIdNode);
	                                valid = false;
	                            }
	                        }
                        })
                }
                var item_ids = new Array();
                $.each($("#questionnaireTeacherEditForm select[name=item_id"),function(index,el){
                    if($(this).val()!="")
                    item_ids.push($(this).val());
                })
                if(item_ids.length>0){
                    if(isRepeat(item_ids)){
                        alert("评价项不能重复，请重新选择！")
                        valid=false;
                    }
                }
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'questionnaireTeacher/edit',
					method: 'post',
					data: $("#questionnaireTeacherEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#questionnaireTeacherEditForm button[type=reset]').click();
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
			$("#questionnaireTeacherEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#questionnaireTeacherEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#questionnaireTeacherEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#questionnaireTeacherEditForm input[ctl-type=decimal]").blur(function(){
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

var questionnaireTeacherListModel, questionnaireTeacherItemModel;

function goAdd(){
    $("#evaluateAddList").empty();
	var pageName = getPageName();
	window.location.href = '#' + pageName + '?action=add';
}
var planIdListModel,courseIdListModel,teacherIdListModel,oldTeacherId,oldTeacherId, evaluateSelectModel, evaluateListModel;
var evaluateListNum = 1;;
/**
 * 查询
 * @param {Integer} page	页码
 */
function doQuery(page){
	var action = Utils.parseUrlParam(window.location.href, 'action');
	if(!action){
		showLoading('正在查询...');
	}
	$("#questionnaireTeacherQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#questionnaireTeacherRefreshRows").val();
	$("#questionnaireTeacherQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'questionnaireTeacher/search',
		data: $("#questionnaireTeacherQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#questionnaireTeacherTable input[type=checkbox]').prop('checked', false);
				questionnaireTeacherListModel.grid = data;
				$("#questionnaireTeacherTableBlock").show();
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
					url: 'questionnaireTeacher/delete?id=' + ids.join(','),
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

/**
 * 加载明细数据
 */
function loadQuestionnaireTeacherItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'questionnaireTeacher/edit',
			data: {id:id},
			success: function(data){
				$("#questionnaireTeacherEditBlock").show();
				if(data.code == 0 && data.model){
					var planList = data.model.plans;
					for (var index in planList) {
						planList[index].planName = planList[index].planName + '-' + planList[index].implementYear + '年度';
                	}
					debugger;
				    oldTeacherId = data.model.teacherId;
					questionnaireTeacherItemModel.model = data.model;
					$("#evaluateEditList").empty();
                    $.each(data.model.itemIds,function(index,el){
                            addEvaluateList()
                            $("#evaluateEditList select").eq(index).val(el);
                    })
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
                        planIdListModel.items = data.model;
                        showCourse(data.model[0].id,0);
                    }

                }
            });
            evaluateListModel = $("#evaluateAddList");
		}else if(action == 'edit'){
			loadQuestionnaireTeacherItem();
            evaluateListModel = $("#evaluateEditList");
		}

        //获取评价下拉数据
        apiClient({
                url: 'common/repository/questionnaireItem/find',
                data: {delete_status:1,type:2},
                success: function(data){
                    if(data.code == 0){
                        evaluateSelectModel = "<select name='item_id'>";
                        $.each(data.model, function(i,n){
                            evaluateSelectModel += "<option value='"+n.id+"'>"+n.name+"</option>";
                        })
                        evaluateSelectModel += "</select>";
                        addEvaluateList();
                    }
                }
            });
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
 		var page = $("#questionnaireTeacherQueryForm input[name=page]").val();
		doQuery(page);
	}
}

function showCourse(plan_id,type){
	apiClient({
    	url: 'course/findCourses',
	    data: {plan_id:plan_id,implementation_status:2},
        success: function(data){
        	debugger;
            if(data.code == 0){
                if(type==0){//add
                    $("#courseIdList").empty();
                    $.each(data.model,function(index,el){
                        $("#courseIdList").append("<option value='"+el.id+"'>"+el.courseName+"</option>")
                    })
                    showTeacher(data.model[0].id,0);
                }else{//edit
                    $("#courseIdListEdit").empty();
                    $.each(data.model,function(index,el){
                        $("#courseIdListEdit").append("<option value='"+el.id+"'>"+el.courseName+"</option>")
                    })
                    showTeacher(data.model[0].id,1);
                }

            }

        }
    });
}

function showTeacher(course_id,type){
    apiClient({
        url: 'user/getTeachers',
        data: {courseId:course_id},
        success: function(data){
            if(data.code == 0){
            	debugger;
                if(type==0){//add
                    $("#teacherIdList").empty();
                    $.each(data.model,function(index,el){
                        $("#teacherIdList").append("<option value='"+el.id+"'>"+el.loginName+"</option>")
                    })
                }else{//edit
                    $("#teacherIdListEdit").empty();
                    $.each(data.model,function(index,el){
                        $("#teacherIdListEdit").append("<option value='"+el.id+"'>"+el.loginName+"</option>")
                    })
                }

            }
        },
		complete: function(){
			hideLoading();
		}
    });
}
//新增评价列表
function addEvaluateList(){
    evaluateListModel.append("<tr><td class='center'>"+evaluateSelectModel+"</td><td class='center'><input disabled type='radio' name='evaluate"+evaluateListNum+"'></td><td class='center'><input disabled type='radio' name='evaluate"+evaluateListNum+"'></td><td class='center'><input disabled type='radio' name='evaluate"+evaluateListNum+"'></td><td class='center'><input disabled type='radio' name='evaluate"+evaluateListNum+"'></td><td class='center'><input disabled type='radio' name='evaluate"+evaluateListNum+"'></td><td class='center'><a href='javascript:;' class='ace-icon glyphicon glyphicon-trash red evaluateDelete' title='删除'></a></td></tr>")
    evaluateListNum++;
}

//验证是否有重复
function isRepeat(a)
{
   return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+a.join("\x0f\x0f") +"\x0f");
}

$(function(){
	var pageName = getPageName();

	
	// 查询条件日期控件
	$("#teacherManagementQueryForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	
	// 新增页日期控件
	$("#teacherManagementAddForm input[ctl-type=date]").datetimepicker({
		format: 'YYYY-MM-DD',
		locale: 'zh-CN',
	});
	// 新增页时间日期控件
	$("#teacherManagementAddForm input[ctl-type=datetime]").datetimepicker({
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
	$("#teacherManagementAddForm input[ctl-type=number]").blur(function(){
		var value = $(this).val().replace(/[^\d]/g, '');
		$(this).val(value);
	});
	// 小数输入
	$("#teacherManagementAddForm input[ctl-type=decimal]").blur(function(){
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
	$('#teacherManagementCancelButton').click(function(){
		$('#teacherManagementAddForm button[type=reset]').click();
		window.location.href = '#' + pageName;
	});
	
	// 查询按钮
	$('#teacherManagementQueryForm button[type="button"][name=teacherManagementQueryButton]').click(function(){
		doQuery();
	});

	// 导出按钮
	$('#teacherManagementQueryForm button[type="button"][name=teacherManagementExportButton]').click(function(){
		bootbox.confirm('是否按输入条件导出数据？', function(result){
			if(result){
				// 同步导出
				$('#teacherManagementQueryForm input[name=async]').val(0);
				showLoading('正在导出...');
				apiClient({
					url: 'teacherManagement/export/all',
					data: $("#teacherManagementQueryForm").serialize(),
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
				$('#teacherManagementQueryForm input[name=async]').val(1);
				$("#teacherManagementAlert").hide();
				apiClient({
					url: 'teacherManagement/export/all',
					data: $("#teacherManagementQueryForm").serialize(),
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#teacherManagementAlert").show();
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
	$('#teacherManagementAddButton').click(function(){
		var valid = true;
		
		// 所属组织id,
		var teacherManagementOrgIdNode = $("#teacherManagementAddForm input[name=org_id]");
		if(teacherManagementOrgIdNode && teacherManagementOrgIdNode.length && (!$.trim(teacherManagementOrgIdNode.val()) || !validator.isNumeric($.trim(teacherManagementOrgIdNode.val())))){
			teacherManagementOrgIdNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(teacherManagementOrgIdNode);
			valid = false;
		}
		// 登录账号
		var teacherManagementLoginNameNode = $("#teacherManagementAddForm input[name=login_name]");
		if(teacherManagementLoginNameNode && teacherManagementLoginNameNode.length && !$.trim(teacherManagementLoginNameNode.val())){
			showToolTip(teacherManagementLoginNameNode);
			valid = false;
		}
		// 密码
		var teacherManagementPasswordNode = $("#teacherManagementAddForm input[name=password]");
		if(teacherManagementPasswordNode && teacherManagementPasswordNode.length && !$.trim(teacherManagementPasswordNode.val())){
			showToolTip(teacherManagementPasswordNode);
			valid = false;
		}
		// 手机号
		var teacherManagementMobileNode = $("#teacherManagementAddForm input[name=mobile]");
		if(teacherManagementMobileNode && teacherManagementMobileNode.length && !$.trim(teacherManagementMobileNode.val())){
			showToolTip(teacherManagementMobileNode);
			valid = false;
		}
		// 电话
		var teacherManagementTelephoneNode = $("#teacherManagementAddForm input[name=telephone]");
		if(teacherManagementTelephoneNode && teacherManagementTelephoneNode.length && !$.trim(teacherManagementTelephoneNode.val())){
			showToolTip(teacherManagementTelephoneNode);
			valid = false;
		}
		// 电子邮箱
		var teacherManagementEmailNode = $("#teacherManagementAddForm input[name=email]");
		if(teacherManagementEmailNode && teacherManagementEmailNode.length && !$.trim(teacherManagementEmailNode.val())){
			showToolTip(teacherManagementEmailNode);
			valid = false;
		}
		// 昵称
		var teacherManagementNickNameNode = $("#teacherManagementAddForm input[name=nick_name]");
		if(teacherManagementNickNameNode && teacherManagementNickNameNode.length && !$.trim(teacherManagementNickNameNode.val())){
			showToolTip(teacherManagementNickNameNode);
			valid = false;
		}
		// 真实姓名
		var teacherManagementFullNameNode = $("#teacherManagementAddForm input[name=full_name]");
		if(teacherManagementFullNameNode && teacherManagementFullNameNode.length && !$.trim(teacherManagementFullNameNode.val())){
			showToolTip(teacherManagementFullNameNode);
			valid = false;
		}
		// 性别
		var teacherManagementGenderNode = $("#teacherManagementAddForm input[name=gender]");
		if(teacherManagementGenderNode && teacherManagementGenderNode.length && (!$.trim(teacherManagementGenderNode.val()) || !validator.isNumeric($.trim(teacherManagementGenderNode.val())))){
			teacherManagementGenderNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(teacherManagementGenderNode);
			valid = false;
		}
		// 年龄
		var teacherManagementAgeNode = $("#teacherManagementAddForm input[name=age]");
		if(teacherManagementAgeNode && teacherManagementAgeNode.length && (!$.trim(teacherManagementAgeNode.val()) || !validator.isNumeric($.trim(teacherManagementAgeNode.val())))){
			teacherManagementAgeNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(teacherManagementAgeNode);
			valid = false;
		}
		// 出生日期
		var teacherManagementBirthdayNode = $("#teacherManagementAddForm input[name=birthday]");
		if(teacherManagementBirthdayNode && teacherManagementBirthdayNode.length && !$.trim(teacherManagementBirthdayNode.val())){
			showToolTip(teacherManagementBirthdayNode);
			valid = false;
		}
		// 头像http访问相对路径
		var teacherManagementAvatarNode = $("#teacherManagementAddForm input[name=avatar]");
		if(teacherManagementAvatarNode && teacherManagementAvatarNode.length && !$.trim(teacherManagementAvatarNode.val())){
			showToolTip(teacherManagementAvatarNode);
			valid = false;
		}
		// 积分
		var teacherManagementCreditNode = $("#teacherManagementAddForm input[name=credit]");
		if(teacherManagementCreditNode && teacherManagementCreditNode.length && (!$.trim(teacherManagementCreditNode.val()) || !validator.isNumeric($.trim(teacherManagementCreditNode.val())))){
			teacherManagementCreditNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(teacherManagementCreditNode);
			valid = false;
		}
		// 余额
		var teacherManagementBalanceNode = $("#teacherManagementAddForm input[name=balance]");
		if(teacherManagementBalanceNode && teacherManagementBalanceNode.length && (!$.trim(teacherManagementBalanceNode.val()) || !validator.isDecimal($.trim(teacherManagementBalanceNode.val())))){
			teacherManagementBalanceNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(teacherManagementBalanceNode);
			valid = false;
		}
		// 连续签到天数
		var teacherManagementCheckoutCountNode = $("#teacherManagementAddForm input[name=checkout_count]");
		if(teacherManagementCheckoutCountNode && teacherManagementCheckoutCountNode.length && (!$.trim(teacherManagementCheckoutCountNode.val()) || !validator.isNumeric($.trim(teacherManagementCheckoutCountNode.val())))){
			teacherManagementCheckoutCountNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(teacherManagementCheckoutCountNode);
			valid = false;
		}
		// 最后一次签到日期
		var teacherManagementLastCheckoutTimeNode = $("#teacherManagementAddForm input[name=last_checkout_time]");
		if(teacherManagementLastCheckoutTimeNode && teacherManagementLastCheckoutTimeNode.length && !$.trim(teacherManagementLastCheckoutTimeNode.val())){
			showToolTip(teacherManagementLastCheckoutTimeNode);
			valid = false;
		}
		// 最后登录日期
		var teacherManagementLastLoginTimeNode = $("#teacherManagementAddForm input[name=last_login_time]");
		if(teacherManagementLastLoginTimeNode && teacherManagementLastLoginTimeNode.length && !$.trim(teacherManagementLastLoginTimeNode.val())){
			showToolTip(teacherManagementLastLoginTimeNode);
			valid = false;
		}
		// 连续登录天数
		var teacherManagementLoginCountNode = $("#teacherManagementAddForm input[name=login_count]");
		if(teacherManagementLoginCountNode && teacherManagementLoginCountNode.length && (!$.trim(teacherManagementLoginCountNode.val()) || !validator.isNumeric($.trim(teacherManagementLoginCountNode.val())))){
			teacherManagementLoginCountNode.attr('title', '格式错误').tooltip('fixTitle');
			showToolTip(teacherManagementLoginCountNode);
			valid = false;
		}
		// 最后登录ip
		var teacherManagementLastLoginIpNode = $("#teacherManagementAddForm input[name=last_login_ip]");
		if(teacherManagementLastLoginIpNode && teacherManagementLastLoginIpNode.length && !$.trim(teacherManagementLastLoginIpNode.val())){
			showToolTip(teacherManagementLastLoginIpNode);
			valid = false;
		}
		// 登录令牌
		var teacherManagementLoginTokenNode = $("#teacherManagementAddForm input[name=login_token]");
		if(teacherManagementLoginTokenNode && teacherManagementLoginTokenNode.length && !$.trim(teacherManagementLoginTokenNode.val())){
			showToolTip(teacherManagementLoginTokenNode);
			valid = false;
		}
		// 登录令牌刷新时间
		var teacherManagementLoginTokenRefreshTimeNode = $("#teacherManagementAddForm input[name=login_token_refresh_time]");
		if(teacherManagementLoginTokenRefreshTimeNode && teacherManagementLoginTokenRefreshTimeNode.length && !$.trim(teacherManagementLoginTokenRefreshTimeNode.val())){
			showToolTip(teacherManagementLoginTokenRefreshTimeNode);
			valid = false;
		}
		// 入职时间
		var teacherManagementOnboardDateNode = $("#teacherManagementAddForm input[name=onboard_date]");
		if(teacherManagementOnboardDateNode && teacherManagementOnboardDateNode.length && !$.trim(teacherManagementOnboardDateNode.val())){
			showToolTip(teacherManagementOnboardDateNode);
			valid = false;
		}
		
		if(!valid){
			return valid;
		}
		
		showLoading('正在保存...');
		
		apiClient({
			url: 'teacherManagement/add',
			method: 'post',
			data: $("#teacherManagementAddForm").serialize(),
			success: function(data){
				if(data.code == 0){
					hideLoading();
					$("#teacherManagementQueryForm button[type=reset]").click();
					window.location.href = '#' + pageName;
					$('#teacherManagementAddForm button[type=reset]').click();
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
	$("#teacherManagementImportExcel").click(function(){
		$("#teacherManagementExcelFile").val('');
		$("#teacherManagementExcelFile").click();
	});
	// 同步导入
	$("#teacherManagementUploadForm").ajaxForm({
		url: _baseUrl + 'teacherManagement/import',
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
	$("#teacherManagementExcelFile").change(function(){
		showLoading('正在导入...');
//		showLoading('正在上传 0% ...');
		$("#teacherManagementUploadForm").submit();
	});

/*
	// 异步导入
	$("#teacherManagementUploadForm").ajaxForm({
		url: _baseUrl + 'teacherManagement/import',
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
				$("#teacherManagementAlert").show();
			}else{
				alert(data.message);
			}
		}
	});
	$("#teacherManagementExcelFile").change(function(){
		$("#teacherManagementAlert").hide();
		$('#teacherManagementUploadForm input[name="async"]').val(1);
//		showLoading('正在上传 0% ...');
		$("#teacherManagementUploadForm").submit();
	});
*/

	var taskHintModel = new Vue({
		el: '#teacherManagementAlert',
		data: {
			taskName: '文件导出',
			taskMenu: '/index.html#task'
		}
	});

	// 查询结果model
	teacherManagementListModel = new Vue({
		el: '#teacherManagementTableBlock',
		data: {
			grid: {items:[]},
			pageName: pageName
		},
		methods: {
			formatGender: function(value){
				var text = value;
				if(value == 0){
					text = '无';
				}else if(value == 1){
					text = '男';
				}else if(value == 2){
					text = '女';
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
					$("#teacherManagementCheckAll").prop('checked', true);
				}else{
					$("#teacherManagementCheckAll").prop('checked', false);
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
				var jumpNode = $('#teacherManagementJumpNo');
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
					url: 'teacherManagement/export/query',
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
				$("#teacherManagementAlert").hide();
				apiClient({
					url: 'teacherManagement/export/query',
					data:{async:1},
					success: function(data){
						if(data.code == 0){
							taskHintModel.taskName = '文件导出';
							$("#teacherManagementAlert").show();
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
							url: 'teacherManagement/export/all',
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
						$("#teacherManagementAlert").hide();
						apiClient({
							url: 'teacherManagement/export/all',
							data:{async:1},
							success: function(data){
								if(data.code == 0){
									taskHintModel.taskName = '文件导出';
									$("#teacherManagementAlert").show();
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
	teacherManagementItemModel = new Vue({
		el: '#teacherManagementEditForm',
		data: {
			model: {}
		},
		methods: {
			formatDate: function(value){
				return moment(value).format('YYYY-MM-DD');
			},
			doCancel: function(e){
				window.location.href = '#' + pageName;
				$("#teacherManagementEditForm button[type=reset]").click();
			},
			doSubmit: function(e){
				var valid = true;
				
				// 所属组织id,
				var teacherManagementOrgIdNode = $("#teacherManagementEditForm input[name=org_id]");
				if(teacherManagementOrgIdNode && teacherManagementOrgIdNode.length && (!$.trim(teacherManagementOrgIdNode.val()) || !validator.isNumeric($.trim(teacherManagementOrgIdNode.val())))){
					teacherManagementOrgIdNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(teacherManagementOrgIdNode);
					valid = false;
				}
				// 登录账号
				var teacherManagementLoginNameNode = $("#teacherManagementEditForm input[name=login_name]");
				if(teacherManagementLoginNameNode && teacherManagementLoginNameNode.length && !$.trim(teacherManagementLoginNameNode.val())){
					showToolTip(teacherManagementLoginNameNode);
					valid = false;
				}
				// 密码
				var teacherManagementPasswordNode = $("#teacherManagementEditForm input[name=password]");
				if(teacherManagementPasswordNode && teacherManagementPasswordNode.length && !$.trim(teacherManagementPasswordNode.val())){
					showToolTip(teacherManagementPasswordNode);
					valid = false;
				}
				// 手机号
				var teacherManagementMobileNode = $("#teacherManagementEditForm input[name=mobile]");
				if(teacherManagementMobileNode && teacherManagementMobileNode.length && !$.trim(teacherManagementMobileNode.val())){
					showToolTip(teacherManagementMobileNode);
					valid = false;
				}
				// 电话
				var teacherManagementTelephoneNode = $("#teacherManagementEditForm input[name=telephone]");
				if(teacherManagementTelephoneNode && teacherManagementTelephoneNode.length && !$.trim(teacherManagementTelephoneNode.val())){
					showToolTip(teacherManagementTelephoneNode);
					valid = false;
				}
				// 电子邮箱
				var teacherManagementEmailNode = $("#teacherManagementEditForm input[name=email]");
				if(teacherManagementEmailNode && teacherManagementEmailNode.length && !$.trim(teacherManagementEmailNode.val())){
					showToolTip(teacherManagementEmailNode);
					valid = false;
				}
				// 昵称
				var teacherManagementNickNameNode = $("#teacherManagementEditForm input[name=nick_name]");
				if(teacherManagementNickNameNode && teacherManagementNickNameNode.length && !$.trim(teacherManagementNickNameNode.val())){
					showToolTip(teacherManagementNickNameNode);
					valid = false;
				}
				// 真实姓名
				var teacherManagementFullNameNode = $("#teacherManagementEditForm input[name=full_name]");
				if(teacherManagementFullNameNode && teacherManagementFullNameNode.length && !$.trim(teacherManagementFullNameNode.val())){
					showToolTip(teacherManagementFullNameNode);
					valid = false;
				}
				// 性别
				var teacherManagementGenderNode = $("#teacherManagementEditForm input[name=gender]");
				if(teacherManagementGenderNode && teacherManagementGenderNode.length && (!$.trim(teacherManagementGenderNode.val()) || !validator.isNumeric($.trim(teacherManagementGenderNode.val())))){
					teacherManagementGenderNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(teacherManagementGenderNode);
					valid = false;
				}
				// 年龄
				var teacherManagementAgeNode = $("#teacherManagementEditForm input[name=age]");
				if(teacherManagementAgeNode && teacherManagementAgeNode.length && (!$.trim(teacherManagementAgeNode.val()) || !validator.isNumeric($.trim(teacherManagementAgeNode.val())))){
					teacherManagementAgeNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(teacherManagementAgeNode);
					valid = false;
				}
				// 出生日期
				var teacherManagementBirthdayNode = $("#teacherManagementEditForm input[name=birthday]");
				if(teacherManagementBirthdayNode && teacherManagementBirthdayNode.length && !$.trim(teacherManagementBirthdayNode.val())){
					showToolTip(teacherManagementBirthdayNode);
					valid = false;
				}
				// 头像http访问相对路径
				var teacherManagementAvatarNode = $("#teacherManagementEditForm input[name=avatar]");
				if(teacherManagementAvatarNode && teacherManagementAvatarNode.length && !$.trim(teacherManagementAvatarNode.val())){
					showToolTip(teacherManagementAvatarNode);
					valid = false;
				}
				// 积分
				var teacherManagementCreditNode = $("#teacherManagementEditForm input[name=credit]");
				if(teacherManagementCreditNode && teacherManagementCreditNode.length && (!$.trim(teacherManagementCreditNode.val()) || !validator.isNumeric($.trim(teacherManagementCreditNode.val())))){
					teacherManagementCreditNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(teacherManagementCreditNode);
					valid = false;
				}
				// 余额
				var teacherManagementBalanceNode = $("#teacherManagementEditForm input[name=balance]");
				if(teacherManagementBalanceNode && teacherManagementBalanceNode.length && (!$.trim(teacherManagementBalanceNode.val()) || !validator.isDecimal($.trim(teacherManagementBalanceNode.val())))){
					teacherManagementBalanceNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(teacherManagementBalanceNode);
					valid = false;
				}
				// 连续签到天数
				var teacherManagementCheckoutCountNode = $("#teacherManagementEditForm input[name=checkout_count]");
				if(teacherManagementCheckoutCountNode && teacherManagementCheckoutCountNode.length && (!$.trim(teacherManagementCheckoutCountNode.val()) || !validator.isNumeric($.trim(teacherManagementCheckoutCountNode.val())))){
					teacherManagementCheckoutCountNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(teacherManagementCheckoutCountNode);
					valid = false;
				}
				// 最后一次签到日期
				var teacherManagementLastCheckoutTimeNode = $("#teacherManagementEditForm input[name=last_checkout_time]");
				if(teacherManagementLastCheckoutTimeNode && teacherManagementLastCheckoutTimeNode.length && !$.trim(teacherManagementLastCheckoutTimeNode.val())){
					showToolTip(teacherManagementLastCheckoutTimeNode);
					valid = false;
				}
				// 最后登录日期
				var teacherManagementLastLoginTimeNode = $("#teacherManagementEditForm input[name=last_login_time]");
				if(teacherManagementLastLoginTimeNode && teacherManagementLastLoginTimeNode.length && !$.trim(teacherManagementLastLoginTimeNode.val())){
					showToolTip(teacherManagementLastLoginTimeNode);
					valid = false;
				}
				// 连续登录天数
				var teacherManagementLoginCountNode = $("#teacherManagementEditForm input[name=login_count]");
				if(teacherManagementLoginCountNode && teacherManagementLoginCountNode.length && (!$.trim(teacherManagementLoginCountNode.val()) || !validator.isNumeric($.trim(teacherManagementLoginCountNode.val())))){
					teacherManagementLoginCountNode.attr('title', '格式错误').tooltip('fixTitle');
					showToolTip(teacherManagementLoginCountNode);
					valid = false;
				}
				// 最后登录ip
				var teacherManagementLastLoginIpNode = $("#teacherManagementEditForm input[name=last_login_ip]");
				if(teacherManagementLastLoginIpNode && teacherManagementLastLoginIpNode.length && !$.trim(teacherManagementLastLoginIpNode.val())){
					showToolTip(teacherManagementLastLoginIpNode);
					valid = false;
				}
				// 登录令牌
				var teacherManagementLoginTokenNode = $("#teacherManagementEditForm input[name=login_token]");
				if(teacherManagementLoginTokenNode && teacherManagementLoginTokenNode.length && !$.trim(teacherManagementLoginTokenNode.val())){
					showToolTip(teacherManagementLoginTokenNode);
					valid = false;
				}
				// 登录令牌刷新时间
				var teacherManagementLoginTokenRefreshTimeNode = $("#teacherManagementEditForm input[name=login_token_refresh_time]");
				if(teacherManagementLoginTokenRefreshTimeNode && teacherManagementLoginTokenRefreshTimeNode.length && !$.trim(teacherManagementLoginTokenRefreshTimeNode.val())){
					showToolTip(teacherManagementLoginTokenRefreshTimeNode);
					valid = false;
				}
				// 入职时间
				var teacherManagementOnboardDateNode = $("#teacherManagementEditForm input[name=onboard_date]");
				if(teacherManagementOnboardDateNode && teacherManagementOnboardDateNode.length && !$.trim(teacherManagementOnboardDateNode.val())){
					showToolTip(teacherManagementOnboardDateNode);
					valid = false;
				}
				if(!valid){
					return valid;
				}

				showLoading('正在保存...');
				
				apiClient({
					url: 'teacherManagement/edit',
					method: 'post',
					data: $("#teacherManagementEditForm").serialize(),
					success: function(data){
						if(data.code == 0){
							hideLoading();
							window.location.href = '#' + pageName;
							$('#teacherManagementEditForm button[type=reset]').click();
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
			$("#teacherManagementEditForm input[ctl-type=date]").datetimepicker({
				format: 'YYYY-MM-DD',
				locale: 'zh-CN'
			});
			// 编辑页时间日期控件
			$("#teacherManagementEditForm input[ctl-type=datetime]").datetimepicker({
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
			$("#teacherManagementEditForm input[ctl-type=number]").blur(function(){
				var value = $(this).val().replace(/[^\d]/g, '');
				$(this).val(value);
			});
			// 小数输入
			$("#teacherManagementEditForm input[ctl-type=decimal]").blur(function(){
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

var teacherManagementListModel, teacherManagementItemModel;

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
	$("#teacherManagementQueryForm input[name=page]").val(page ? page : 1);
	
	var rows = $("#teacherManagementRefreshRows").val();
	$("#teacherManagementQueryForm input[name='rows']").val(rows ? rows : 10);
	
	apiClient({
		url: 'teacherManagement/search',
		data: $("#teacherManagementQueryForm").serialize(),
		success: function(data){
			if(data.code == 0){
				$('#teacherManagementTable input[type=checkbox]').prop('checked', false);
				teacherManagementListModel.grid = data;
				$("#teacherManagementTableBlock").show();
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
					url: 'teacherManagement/delete?id=' + ids.join(','),
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
function loadTeacherManagementItem(){
	showLoading('正在加载...');
	var id = Utils.parseUrlParam(window.location.href, 'id');
	if(id){
		$("div[action=edit]").hide();
		apiClient({
			url: 'teacherManagement/edit',
			data: {id:id},
			success: function(data){
				$("#teacherManagementEditBlock").show();
				if(data.code == 0 && data.model){
					teacherManagementItemModel.model = data.model;
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
			
		}else if(action == 'edit'){
			loadTeacherManagementItem();
		}
	}else{
		$('div[action]').hide();
		$('div[action="query"]').show();
		doQuery();
	}
}

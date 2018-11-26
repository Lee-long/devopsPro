jQuery(function($) {
	try{ace.settings.loadState('main-container')}catch(e){}
	try{ace.settings.loadState('sidebar')}catch(e){}
//	if('ontouchstart' in document.documentElement) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
	
	if(window.location.href.indexOf('#') < 0){
		// 注释掉此行可保持首页空白
		$("#_content").load('home2.html');
	}

	// 显示左侧菜单
	showMenuTree();
	
	//Android's default browser somehow is confused when tapping on label which will lead to dragging the task
	//so disable dragging when clicking on label
	var agent = navigator.userAgent.toLowerCase();
	if(ace.vars['touch'] && ace.vars['android']) {
	  $('#tasks').on('touchstart', function(e){
			var li = $(e.target).closest('#tasks li');
			if(li.length == 0){
				return;
			}
			var label = li.find('label.inline').get(0);
			if(label == e.target || $.contains(label, e.target)){
				e.stopImmediatePropagation() ;
			}
	  });
	}
	
	apiClient({
		url: 'admin/validate',
		success: function(data){
			if(data.code == 0 && data.model){
				var shownName = data.model.fullName ? data.model.fullName : data.model.loginName;
				$("#_fullname").text(shownName);
				$("#jobNo").val(data.model.jobNo);
				setLocalStorage('user', JSON.stringify(data.model));
			}
		}
	});
	
	// 页面切换
	$("#turnPage").click(function(){
		$.loading.show({tips:'正在切换...'});
		turnPageApiClient({
			url: 'username/turnPage',
			dataType: 'jsonp',
			data: {username:$("#jobNo").val()},
			complete: function(){
				$.loading.hide();
				var urlPath=window.document.location.href;
				var port = window.location.port;
				var index = urlPath.indexOf(port);
				var url = urlPath.substring(0,index);
				
				window.location.href = url + _apiPort + '/index.html';
			}
		})
	});
	
	// 退出
	$("#_logout").click(function(){
		$.loading.show({tips:'正在退出...'});
		apiClient({
			url: 'admin/logout',
			complete: function(){
				recordLogout();
				$.loading.hide();
				window.location.href = 'login.html';
			}
		})
	});
	
})

// 头部导航菜单model
var navModel = new Vue({
	el: '#_navbar',
	data: {
		menus: {}
	},
	mounted: function(){
		$('#_navbar').show();
	}
});

/**
 * 高亮选中当前菜单
 */
function highlightMenu(pageName){
	var page = pageName ? pageName : getRouterPage();

	if(page){
		//课程页面和计划页面使用同一个menu
		if(page == 'course'){
			page = 'plan';
			pageName = page;
		}
		
		//实施和期次页面使用同一个menu
		if(page == 'period'){
			page = 'implementation';
			pageName = page;
		}
		
		if(page == 'question'){
			page = 'questionLibrary';
			pageName = page;
		}	
		
		// 展开一级菜单
		$('li[children="0"] a[page="' + page + '"]').parent().parent().parent().addClass('open');	// 打开一级菜单
		var childMenuNode = $('li[children="0"] a[page="' + page + '"]').parent().parent().removeClass();
		childMenuNode.addClass('submenu nav-show');  // 打开二级菜单
		childMenuNode.css({"display":"block"});		// 显示二级菜单

		// 选中二级菜单
		$('li[children="0"]').removeClass('active');
		$('li[children="0"] a[page="' + page + '"]').parent().addClass('active');
		

	}
}

/**
 * 显示左侧菜单
 */
function showMenuTree(){
//	debugger;
//	$("#_menu").hide();
	apiClient({
		url: 'home/menus',
		success: function(data){
			var vm = new Vue({
				el: '#_menu',
				data: {menus: data.model},
				mounted: function(){
//					debugger;
					$("#_menu").show();
					
					// 点击高亮菜单
					$('li[children="0"]').unbind('click').click(function(){
						$('li[children="0"]').removeClass('active');
						$(this).addClass('active');
					});
					
					initRouter();
				}
			});
		},
		complete: function(){
//			if(!$("#_content").html()){
//				$.loading.hide();
//			}
		}
	});
}

/**
 * 初始化路由
 */
function initRouter(){
	var router = Router({
//		on: function(){
//			debugger;
//		},
		'*': function(){
			authLogin();
			//authPage();
			
			var page = getPageName();
			var curPage = $("#_content").attr('page');
			
			$('#back').hide();
			if(curPage != page){
				// 页面发生变化，加载子页面
				$('#_content').load(page + '.html',function(){
					$("#_content").attr('page', page);
//					debugger;
					var context = routeCallBack();
					if(context){
						refreshNavMenu(context.navMenus);	// 刷新导航菜单
						highlightMenu(context.currentMenu);	// 高亮左侧菜单
					}else{
						refreshNavMenu();	// 刷新导航菜单
						highlightMenu();	// 高亮左侧菜单
					}
					// 权限控制
					authElement();
					authRoleCode();
				});
			}else{
				// 调用子页面的路由回调
				var context = routeCallBack();
//				debugger;
				if(context){
					refreshNavMenu(context.navMenus);	// 刷新导航菜单
					highlightMenu(context.currentMenu);	// 高亮左侧菜单
				}else{
					refreshNavMenu();	// 刷新导航菜单
					highlightMenu();	// 高亮左侧菜单
				}
				// 权限控制
				authElement();
				authRoleCode();
			}
			
//			debugger;
			
			// 高亮左侧菜单
//			highlightMenu();
		}
	});

	router.init();	
}

/**
 * 验证用户是否已退出
 */
function authLogin(){
	var user = getLocalStorage('user');
	if(!user){
		// 用户已退出
		window.location.href = _nologinPage;
	}
}

/**
 * 检查是否对当前页有访问权限(路由用)
 */
function authPage(){
	var pageName = getPageName();
	var user = JSON.parse(getLocalStorage('user'));
//debugger;
	if(!user){
		window.location.href = 'index.html';
	}
	
	var permittedPages = user.permittedPages;
	
	if(!permittedPages || !permittedPages.length){
		// 无任何页面访问权限，跳转至登录页
		window.location.href = 'login.html';
	}
	
	if(permittedPages.indexOf(pageName) == -1){
		// 无当前页访问权限，跳转至首页
		window.location.href = 'index.html';
	}
	
	var forbidenActions = user.forbidenActions;
	if(!forbidenActions || !forbidenActions.length){
		return;
	}

	var forbidenActionNames = [];
	for(var i = 0; i < forbidenActions.length; i++){
		var fa = forbidenActions[i];
		if(pageName == fa.pageName){
			forbidenActionNames = fa.actionNames;
		}
	}
	
	if(!forbidenActionNames || !forbidenActionNames.length){
		return;
	}

	var actionName = Utils.parseUrlParam(window.location.href, 'action');
	if(forbidenActionNames.indexOf(actionName) != -1){
		// 有当前页面访问权限，但无url中操作权限，跳转至当前页
		window.location.href = 'index.html#' + pageName;
	}
}

/**
 * 页面操作相关元素权限控制(路由用)
 */
function authElement(){
	var pageName = getPageName();
	var user = getLocalStorageObject('user');

	if(!user){
		return;
	}
	
	var forbidenActions = user.forbidenActions;
	if(!forbidenActions || !forbidenActions.length){
		return;
	}
	
	var forbidenActionNames = [];
	for(var i = 0; i < forbidenActions.length; i++){
		var fa = forbidenActions[i];
		if(pageName == fa.pageName){
			forbidenActionNames = fa.actionNames;
		}
	}
	
	if(!forbidenActionNames || !forbidenActionNames.length){
		return;
	}
	
	// 屏蔽无操作权限的页面元素
	for(var i = 0; i < forbidenActionNames.length; i++){
		var actionName = forbidenActionNames[i];
		$('[action=' +  actionName + ']').remove();
		$('[operation=' +  actionName + ']').remove();
	}
}

/**
 * 检查当前页面是否有对应的动作权限(vue用)
 * @param {String} actionName	动作名称
 */
function checkAuth(actionName){
	var pageName = getPageName();
	var user = getLocalStorageObject('user');
	var forbidenActions = user.forbidenActions;
	
	if(!forbidenActions || !forbidenActions.length){
		return true;
	}

	for(var i = 0; i < forbidenActions.length; i++){
		var fa = forbidenActions[i];
		
		if(pageName == fa.pageName){
			for(var j = 0; j < fa.actionNames.length; j++){
				if(actionName == fa.actionNames[j]){
					return false;
				}
			}
		}
	}
	
	return true;
}

/**
 * 校验权限代码
 */
function authRoleCode(){
	var nodes = $('[rolecode]');
//	debugger;
	if(!nodes || !nodes.length){
		return;
	}
	
	var user = getLocalStorageObject('user');
	if(!user){
		return;
	}
	
	var userRoleCode = user.roleCode.toLowerCase();
	
	// 屏蔽用户无权看到的节点
	for(var i = 0; i < nodes.length; i++){
		var node = nodes[i];
		var roleCodes = $(node).attr('rolecode');
		var targets = roleCodes.split('-');
		
		var hasCode = false;
		for(var j = 0; j < targets.length; j++){
			var target = targets[j];
			if(target.toLowerCase() == userRoleCode){
				hasCode = true;
				break;
			}
		}
		
		if(!hasCode){
			// 用户无权看到此节点，移除
			$(node).remove();
		}
	}
}

/**
 * 检查登录用户是否有传入的权限代码
 * @param {String} roleCode
 */
function checkRoleCode(roleCode){
	var hasCode = false;
	
	if(!roleCode){
		return true;
	}
	
	var user = getLocalStorageObject('user');
	if(!user){
		return hasCode;
	}

	var targets = roleCode.split('-');
	for(var i = 0; i < targets.length; i++){
		var target = targets[i];
		if(target.toLowerCase() == user.roleCode.toLowerCase()){
			hasCode = true;
			break;
		}
	}
	
	return hasCode;
}

/**
 * 显示导航栏菜单
 * @param Object {link:'', text:''}
 */
function refreshNavMenu(navMenus){
	if(navMenus && navMenus.length){
		// 自定义导航菜单
		navModel.menus = navMenus;
	}else{
		var page = getRouterPage();
		if(page=='course'){
			page='plan';
		}
		
		if(page=='period'){
			page='implementation';
		}
		
		if(page=='question'){
			page='questionLibrary';
		}
		
		
		if(page){
			var menus = [];
			var text = $('#_menu a[page="' + page + '"]').attr('text');			// 获得左侧菜单文字
			var menu = {
				text: text,
				link: '#' + page
			};
			menus.push(menu);
			
			navModel.menus = menus;
		}
	}
}

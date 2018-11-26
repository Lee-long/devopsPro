/**
 * 设置操作权限
 */
Vue.directive('operation', {
	inserted: function(el, binding, vnode, oldVnode){
		// 根据用户是否有操作权限，显示或移除页面元素
		var actionName = binding.arg;
		var valid = checkAuth(actionName);
		
		if(!valid){
			el.remove();
		}
	}
});

/**
 * 根据权限代码控制权限
 */
Vue.directive('rolecode', {
	inserted: function(el, binding, vnode, oldVnode){
		// 根据用户权限代码，显示或移除页面元素
		var roleCode = binding.arg;
		var valid = checkRoleCode(roleCode);
		
		if(!valid){
			el.remove();
		}
	}
});


$(function(){
	// 初始化tooltip
	$("[data-rel='tooltip']").tooltip({
		trigger: 'manual',
	});

	// 初始化bootbox
	bootbox.setLocale("zh_CN");
	
	// 错误消息弹窗
//	alertify.defaults.resizable = false;
//	alertify.defaults.glossary.ok = '确定';
//	alertify.defaults.transition = 'fade';
//	alertify.defaults.closableByDimmer = false;
//	alertify.defaults.moveBounded = true;
})

/**
 * 获得当前路由页
 */
function getRouterPage(){
	return window.location.hash.slice(1).split('?')[0];
}

/**
 * 显示tooltip
 */
function showToolTip(ref){
	$(ref).tooltip('show');
	setTimeout(function(){
		$(ref).tooltip('hide');
		$(ref).tooltip('destroy');
	}, 1000);
}

/**
 * 显示错误弹窗
 */
function alertError(msg){
	var m = msg + '';
	bootbox.alert(m && m != 'undefined' ? m : '');
}

window.alert = alertError;

// http://bootboxjs.com/documentation.html
window.confirm = bootbox.confirm;

function showPrompt(text){
	$.gritter.add({
		title: '通知',
		text: text,
		time: 1500,
		class_name: 'gritter-info gritter-center'
	});
}

window.showLoading = function(text){
	$.loading.show({tips:text});
}

window.hideLoading = function(){
	$.loading.hide();
}

function getPageName(){
	return window.location.hash.slice(1).split('?')[0];
}

/**
 * 获取xml对象内容，ie9用
 * @param {Object} doc		xml结果
 * @param {Object} tagName	标签名称
 */
function parseXml(doc, tagName){
	var elements = doc.getElementsByTagName(tagName);
	return elements[0].textContent;
}
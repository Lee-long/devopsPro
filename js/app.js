/**
 * 此文件包含架构类通用模块
 */
var _baseUrl = '/' + _appName + '/' + _moduleName + '/' + _apiVersion + '/';
var _apiBaseUrl = '/' + _appName + '/' + _apiModuleName + '/' + _apiVersion + '/';
var _wsBaseUrl = _baseUrl + 'ws';

var _pageCode = parseInt(Math.random() * 10000);

var _urlQueue = [];

/**
 * 防止重复提交
 * 正常情况下，loading图层可以防止重复点击/提交，当图层失效时作为最后保险
 */
$.ajaxPrefilter(function(options, originalOptions, jqXHR){
	var url = options.url.split('?')[0];
	
	if(!_urlQueue[url]){
		_urlQueue[url] = jqXHR;
	}else{
		 jqXHR.abort();		//放弃后触发的提交
		 console.log('abort duplicate request', options.url);
	}
	
	var complete = options.complete;
	options.complete = function(jqXHR, textStatus) {
        _urlQueue[url] = null;
        if ($.isFunction(complete)) {
        	complete.apply(this, arguments);
        }
    };
});

/**
 * 请求远程api
 * @param {Object} param	jquery ajax 兼容参数
 */
function apiClient(param, errorCodeHandler) {
	var url = param.url
	if(url.indexOf('/') == 0){
		url = url.replace(/\/+/, '');
	}
	url = _baseUrl + url;	
	
	var args = [];
	args['_p'] = _pageCode;
	args['_r'] = parseInt(Math.random() * 10000);
	args['_s'] = encodeURIComponent(window.location.href);
	args['_c'] = _channel;
	
	url = Utils.addUrlParam(url, args);
	param.url = url;
	
	var success = param.success;
	if(success){
		param.success = function(data, textStatus, jqXHR){
			if(data.code == 1){
				if(!errorCodeHandler){
					// session超时
					recordLogout();
					window.location.href = _nologinPage;
				}else{
					errorCodeHandler(data);
				}
			}else{
				success(data, textStatus, jqXHR);
			}
		}
	}
	$.ajax(param);
}

/**
 * 请求远程api
 * @param {Object} param	jquery ajax 兼容参数
 */
function turnPageApiClient(param, errorCodeHandler) {
	var url = param.url
	if(url.indexOf('/') == 0){
		url = url.replace(/\/+/, '');
	}
	url = _apiBaseUrl + url;	
	
	var args = [];
	args['_p'] = _pageCode;
	args['_r'] = parseInt(Math.random() * 10000);
	args['_s'] = encodeURIComponent(window.location.href);
	args['_c'] = _channel;
	
	var urlPath=window.document.location.href;
	var hostName = window.location.host;
	var port = window.location.port;
	var index = urlPath.indexOf(port);
	var baseurl = urlPath.substring(0,index);
	
	url = Utils.addUrlParam(url, args);
	param.url = baseurl+'7777'+url;
	
	var success = param.success;
	if(success){
		param.success = function(data, textStatus, jqXHR){
			if(data.code == 1){
				if(!errorCodeHandler){
					// session超时
					recordLogout();
					window.location.href = _nologinPage;
				}else{
					errorCodeHandler(data);
				}
			}else{
				success(data, textStatus, jqXHR);
			}
		}
	}
	$.ajax(param);
}

/**
 * 获取用户
 * @param {Object} callback	得到用户后的回调函数
 */
function validateUser(callback){
	$.ajax({
		url: _baseUrl + 'admin/validate',
		success: function(data){
			callback(data.model);
		}
	});
}

///**
// * 构建用户
// * @param {String[]} parts
// * @param {Object} callback	回调函数
// */
//function buildUser(parts, callback){
//	$.ajax({
//		url: _baseUrl + 'user/build',
//		data: {
//			component: parts && parts.length ? parts.join(',') : ''
//		},
//		success: function(data){
//			callback(data.model);
//		}
//	});
//}

/**
 * 记录用户已登录
 */
//function recordLogin(){
//	setLocalStorage('login', 1);
//}

/**
 * 记录用户已退出
 */
function recordLogout(){
	setLocalStorage('user','');
}

/**
 * 判断用户是否已登录
 */
//function hasLogin(){
//	return getLocalStorage('login');
//}

/**
 * 向sessionStorage中设置键值
 * @param {Object} key
 * @param {Object} value
 */
function setSessionStorage(key, value){
	sessionStorage.setItem(_appName + '.' + key, value);
}

/**
 * 从sessionStorage中取值
 * @param {Object} key
 */
function getSessionStorage(key){
	var value = sessionStorage.getItem(_appName + '.' + key);
	return (value == 'null' || value == 'undefined') ? null : value;
}

/**
 * 从sessionStorage中取值,并返回json对象
 * @param {Object} key
 */
function getSessionStorageObject(key){
	var json =  getSessionStorage(key);
	var value = "";
	
	try{
		value = JSON.parse(json);
	}catch(e){
		console.warn(e)
	}
	
	return value;
}

/**
 * 向sessionStorage中设置键值
 * @param {Object} key
 * @param {Object} value
 */
function setLocalStorage(key, value){
	localStorage.setItem(_appName + '.' + key, value);
}

/**
 * 从sessionStorage中取值
 * @param {Object} key
 */
function getLocalStorage(key){
	var value =  localStorage.getItem(_appName + '.' + key);
	return (value == 'null' || value == 'undefined') ? null : value;
}

/**
 * 从sessionStorage中取值,并返回json对象
 * @param {Object} key
 */
function getLocalStorageObject(key){
	var json =  getLocalStorage(key);
	var value = "";
	
	try{
		value = JSON.parse(json);
	}catch(e){
		console.warn(e)
	}
	
	return value;
}
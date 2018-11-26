/**
 * 常用工具类
 * @namespace
 */
var Utils = {};

/**
 * @memberof Utils
 * @param {string} str - 目标字符串
 * @param {string} suffix - 结尾字符串
 * @returns true - 以suffix结尾; false - 不是以suffix结尾
 */
Utils.endsWith = function(str, suffix){
	var ret = true;
	
	if(str && suffix){
		ret = suffix.length <= str.length ? str.substr(str.length - suffix.length, suffix.length) === suffix : false;
	}else if(!str && suffix || str && !suffix){
		ret = false;
	}
	
	return ret;
}

/**
 * @memberof Utils
 * @param {string} str - 目标字符串
 * @param {string} prefix - 开头字符串
 * @returns true - 以prefix开头; false - 不是以prefix结尾
 */
Utils.startsWith = function(str, prefix){
	var ret = true;
	
	if(str && prefix){
		ret = prefix.length <= str.length ? str.substr(0, prefix.length) === prefix : false;
	}else if(!str && prefix || str && !prefix){
		ret = false;
	}
	
	return ret;
}

/**
 * @memberof Utils
 * @param {string} url - 目标字符串
 * @returns 去除前后空格的字符串
 */

Utils.trim = function(str){
	var value = str;
	
	if(value){
		value = value.replace(/^\s+/, '');
		value = value.replace(/\s+$/, '');
	}else{
		value = '';
	}
	
	return value;
}

/**
 * @memberof Utils
 * @param {string} url - 网址
 * @returns 网址的后缀
 */
Utils.suffix = function(url){
	var suffix = "";
	
	if(url){
		var urlWithoutParam = Utils.trim(url).split('?')[0];
		var arr = urlWithoutParam.split('.');
		if(arr.length > 1){
			suffix = arr.pop();
		}
	}
	
	return suffix;
}

/**
 * 向url中增加get参数和值
 * @param {String} url	- 网址
 * @param {String[]} param	- 参数数组，下标为参数key，数值值为参数内容
 * @returns	增加参数后的url
 */
Utils.addUrlParam = function(url, params){
	if(!params){
		return url;
	}
	
	var output = url;
	
	if(url.indexOf('?') > 0){
		if(url.indexOf('=') > 0){
			if(!Utils.endsWith(url, '&')){
				output = output + '&'
			}
		}else{
			if(Utils.endsWith(url, '&')){
				output = output.substr(0, output.length - 1);
			}
		}
	}else{
		output = output + '?'
	}
	
	for(var key in params){
//		output += key + '=' + encodeURI(params[key]) + '&';
		output += key + '=' + params[key] + '&';
	}
	
	output = output.substr(0, output.length - 1);
	
	return output;
}

/**
 * 从url参数获得key对应的value
 * @param {string} url	- 网址
 * @param {string} key	- 参数键值
 * @param {string}	[defVal=''] defVal	- 可选，默认值
 */
Utils.parseUrlParam = function(url, key, defVal){
	var value;
	var index = url.indexOf('?');
	if(index < 0){
		return defVal ? defVal : '';
	}
	
	var suffix = url.substr(index + 1);
	if(!suffix){
		return;
	}
	
	var found = false;
	var elements = suffix.split('&');
	if(elements && elements.length > 0){
		for(var i = 0; i < elements.length; i++){
			var pairs = elements[i].split('=');
			var name = pairs[0];
			var idx = elements[i].indexOf('=');
			
			if (idx < 0) {
				return defVal ? defVal : '';
			}
			
			value = elements[i].substr(idx + 1);
			if(name == key){
				found = true;
				break;
			}
		}
	}
	
	value = found && value ? value.replace(/#/g, '') : defVal;	
	if(!isNaN(value)){
		return value ? value : '';
	}
	return value ? decodeURIComponent(value) : '';
}

Utils.getUrlParam = function(key, defVal){
	return Utils.parseUrlParam(window.location.href, key, defVal);
}

/**
 * 
 * @param {Object}	fileNode	浏览器file对象
 * @param {Object}	imageNode	浏览器img对象
 */
Utils.previewImage = function(fileNode, imageNode){
//	if(navigator.userAgent.indexOf("MSIE") >= 1){
//		var url = fileNode.value;
//		imageNode.src = url;
//		alert(imageNode.src);
//	}else{
	var file = fileNode.files[0];
	var reader = new FileReader();
	reader.onloadend = function () {
		imageNode.src = reader.result;
	}
	if(file){
		reader.readAsDataURL(file);
	}
//	}
}

/**
 * 首字母大写
 * @param {String} text
 */
Utils.capitalize = function(text){
	var value = "";
	if(text){
		if(text.length > 0){
			value = text.substr(0, 1).toUpperCase();
		}
		
		if(text.length > 1){
			value = value + text.substr(1);
		}
	}
	
	return value;
}

/**
 * 验证邮箱格式
 * @param {String} email
 */
Utils.validEmail = function (email) {

	var reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z_-]+)?((\.[a-zA-Z_-]{2,3}){1,2})$/;
	if (reg.test(email)) {
		return true;
	}
	return false;
}

/**
 * 查看文件信息
 * @param {Object} fileElement	原生文件dom节点
 */
Utils.peekFile = function(fileElement){
	var info = {};
	
	var parts = fileElement.value.split('.');
	info.name = fileElement.value;
	info.suffix = parts[parts.length - 1];
	info.size = fileElement.files[0].size / 1024;	// kb
	
	return info;
}

/**
 * 按比率压缩图片
 * @param {Object} imageElement
 * @param {Float} quality	图片质量, 0到1之间的数值
 */
Utils.compressImage = function(imageElement, quality){
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	
	// 创建属性节点
	var widthAttr = document.createAttribute("width");
	widthAttr.nodeValue = imageElement.naturalWidth;
	
	var heightAttr = document.createAttribute("height");
	heightAttr.nodeValue = imageElement.naturalHeight;
	
//	console.log('imageElement.width=',imageElement.width,'imageElement.height=',imageElement.height);
//	console.log('imageElement.naturalWidth =',imageElement.naturalWidth ,'imageElement.naturalHeight=',imageElement.naturalHeight);
	
	canvas.setAttributeNode(widthAttr);
	canvas.setAttributeNode(heightAttr);
	ctx.drawImage(imageElement, 0, 0, imageElement.naturalWidth, imageElement.naturalHeight);
	
	var base64 = canvas.toDataURL('image/jpeg', quality);
	return base64;
}

///**
// * 检查操作系统
// * @return android/ios/pc
// */
//Utils.checkOS = function(){
//	var os = 'pc';
//	
//	if(window.location && window.location.hostname != 'localhost'){
//		if(browser.versions){
//			if(browser.versions.android){
//				os = 'android';
//			}else if(browser.versions.ios){
//				os = 'ios';
//			}
//		}
//	}
//	
//	return os;
//}
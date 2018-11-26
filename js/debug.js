var consoleProxy = {};
consoleProxy.debug = console.debug;

console.debug = function(){
	if(!arguments || arguments.length == 0){
		return;
	}
	
	var args = [];
	for(var i = 0; i < arguments.length; i++){
		args[i] = arguments[i];
	}
	var data = {};
	data.url = window.location.href;
	data.text = args.join(',');
	data.p = _pageCode;
	data.r = parseInt(Math.random() * 10000);
	
	consoleProxy.debug(data);
	
	$.ajax({
		type:"post",
		url: _baseUrl + 'ui/log',
		data: data,
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.error(errorThrown);
		}
	});
}

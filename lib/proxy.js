var proxies = {};

var _check_string = function(str){

	if(typeof str !== "string")
		throw "parameter must be a string";
}

var _check_function = function(f){

	if(typeof f !== "function")
		throw "parameter must be a function";		
}

var _keys= function(obj){

	var keys =[];
	for(var k in obj){
		keys.push(k);
	}
	return keys;
}

var _values = function(obj){

	return _keys(obj).map(function(key){
		return obj[key];
	});
}

var _isSync = function(proc_name,f){

	_check_string(proc_name);
	return _values(proxies[proc_name].sync).indexOf(f) !== -1;
}

/*
 * Returns installed proxies as an array for the procedure name proc_name.
 */
var _list_proxies  = function(proc_name){

	_check_string(proc_name);	
	var p = [];
	for(var i=1; i <= size(proc_name); i++ ){
				
		p.push(	proxies[proc_name].sync[i.toString()] || 
				proxies[proc_name].async[i.toString()] );		
	}	
	return p;
};

var clear = exports.clear = function(){
	
	for(var key in proxies){
		proxies[key].modulee[key] = proxies[key].func;
		delete proxies[key];
	}	

}

/*
 * Returns the number of installed proxies for the procedure name proc_name.
 */
var size = exports.size  = function(proc_name){

	_check_string(proc_name);
	return _keys(proxies[proc_name].sync).length + _keys(proxies[proc_name].async).length;
};

/*
 * Removes proxy functions.
 */
exports.uninject = function(modulee, proc_name){
	
	proc_name && _check_string(proc_name);	
	if(proc_name){	
		modulee[proc_name] = proxies[proc_name].func;
		delete proxies[proc_name];					
	}else{
		for(var key in proxies){
			modulee[key] = proxies[key].func
			delete proxies[key];						
		}
	}

}

/*
 * Adds a synchronous proxy to the function proc_name.
 */
exports.add_proxy_sync = function(proc_name, handler){

	_check_string(proc_name) && _check_function(handler);
	if(!proxies[proc_name]){
		proxies[proc_name] = {sync:{},async:{},err:null,func:null,modulee:null};
	}	
	
	var nextIndex = size( proc_name ) + 1;					 	
	proxies[proc_name].sync[ nextIndex.toString() ] = handler;
	return this;
};


/*
 * Add an asynchronous proxy to the function proc_name.
 */
exports.add_proxy_async = function(proc_name, handler){

	_check_string(proc_name) && _check_function(handler);
	if(!proxies[proc_name]){
		proxies[proc_name] = {sync:{},async:{},err:null,func:null,modulee:null};
	}
	
	var nextIndex = size(proc_name) + 1;
	proxies[proc_name].async[ nextIndex.toString() ] = handler;
	return this;
};

/*
 * Adds an error handler for async proxies.
 */
exports.add_proxy_err = function(proc_name, handler){

	_check_string(proc_name) && _check_function(handler);
	if(!proxies[proc_name]){
		proxies[proc_name] = {sync:{},async:{},err:null,func:null,modulee:null};
	}	
	proxies[proc_name].err = handler;	
	return this;
}


/*
 * Inject proxies into module.
 */
exports.inject = function(modulee){
		
	for(var key in proxies){				
		(function(){
			
			var scopekey = key;
			if(proxies[scopekey].modulee)
				throw "Proxy " + scopekey + " is injected in other module";
											
			proxies[scopekey].func = modulee[scopekey];			
			proxies[scopekey].modulee = modulee;
			var handlers =  _list_proxies(scopekey);				
			modulee[scopekey] = function(){
				
				var args = Array.prototype.slice.call(arguments);									
				var loop = function(err){
					if(!err){
						var handler = handlers.shift();									
						if(handler){
							if(_isSync(scopekey,handler)){
								handler.apply(this,args);
								loop();
							}else{							
								handler.apply(this,args.concat(loop));	
							}
							
						}else{
							proxies[scopekey].func && proxies[scopekey].func.apply(this,args);
						}
					}else if(proxies[scopekey].err){
						proxies[scopekey].err(err);	
					}
				};
				loop();										
			};									
		})();
	}
};

/*
 * Inject plugins_async into modules by name. Example of usage:
 * 
 * var dummy = require("./lib/dummy");
 * 
 * proxy.add_plugin("a",function(ctx,next){ctx.params.p1=1;next();});
 * proxy.add_plugin("a",function(ctx,next){ctx.params.p2=1;next();});
 * proxy.add_plugin("a",function(ctx,next){ctx.params.p3=1;next();});
 * proxy.add_plugin_sync("a",function(ctx){ctx.params.p4=1;})
 * 
 * proxy.inject(dummy);
 * 
 */
var plugins = {};

function _keys(obj){

	var keys =[];
	for(var k in obj)
		keys.push(k);
	
	return keys;
}

function _values(obj){

	return _keys(obj).map(function(key){
		return obj[key];
	});
}

function _isSync(proc_name,f){

	return _values(plugins[proc_name].sync).indexOf(f) != -1;
}

/*
 * Returns the number of installed plugins for the procedure name proc_name.
 */
var size = exports.size  = function( proc_name ){

	return 	_keys(plugins[proc_name].sync).length + 
			_keys(plugins[proc_name].async).length;
}

/*
 * Returns installed plugins as an array for the procedure name proc_name.
 */
var plugins = exports.plugins = function( proc_name ){

	var p = [];
	for(var i=1; i <= size(proc_name); i++ ){
				
		p.push(	plugins[proc_name].sync[i.toString()] || 
				plugins[proc_name].async[i.toString()] );		
	}	
	return p;
}

/*
 * Add a synchronous plugin to the function proc_name.
 */
exports.addPluginSync = function( proc_name, handler ){

	if(!plugins[proc_name])
		plugins[proc_name] = {sync:{},async:{}};

	var nextIndex = size( proc_name ) + 1;					 
	
	plugins[proc_name].sync[ nextIndex.toString() ] = handler;
}


/*
 * Add an asynchronous plugin to the function proc_name.
 */
exports.addPluginAsync = function( proc_name, handler ){

	if(!plugins[proc_name])
		plugins[proc_name] = {sync:{},async:{}};

	var nextIndex = size(proc_name) + 1;					 
	
	plugins[proc_name].async[ nextIndex.toString() ] = handler;
}


/*
 * Inject plugins into module.
 */
exports.inject = function(modulee){
	
	for(key in plugins){		
		(function(){
			
			var scopekey = key;		
			var f = modulee[scopekey];
			var handlers =  plugins(scopekey);			
			modulee[scopekey] = function(){
				
				var args = Array.prototype.slice.call(arguments);									
				var loop = function( ){
	
					var handler = handlers.shift();									
					if(handler){
						if(_isSync(scopekey,handler)){
							handler.apply(this,args);
							loop();
						}else{							
							handler.apply(this,args.concat(loop));	
						}
						
					}else
						f && f.apply(this,args);
				};
				loop();					
						
			}									
		})();
	}
}

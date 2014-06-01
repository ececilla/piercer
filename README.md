[![Build Status](https://secure.travis-ci.org/ececilla/piercer.png)](http://travis-ci.org/ececilla/piercer)
[![NPM version](https://badge.fury.io/js/piercer.svg)](http://badge.fury.io/js/piercer)

#Piercer: Function proxy injection #

Piercer is a simple but powerful module to inject both synchronous and asynchronous functions into a target function. Let's see an example:


```

var piercer = require("piercer");
var mymodule  = {

	log:function(str){		
		console.log(str);
	}
};

piercer.add_proxy_sync("log",function(str){
	console.log("proxy function");
});

piercer.inject(mymodule);
mymodule.log("foobar");

```
What gets printed is:
    
    proxy function
    foobar

Synchronous proxy functions are passed the very same parameters as in the function call. In the example above, the parameter "foobar". More than one proxy can be added to the target function with the order of execution keeping equal as the order of installation.

```

var piercer = require("piercer");
var mymodule  = {

	log:function(str){		
		console.log(str);
	}
};

piercer.add_proxy_sync("log",function(str){
	console.log("first proxy function");
});

piercer.add_proxy_sync("log",function(str){
	console.log("second proxy function");
});

piercer.inject(mymodule);


```

Following you can find the same example executed asynchronously.


```

var piercer = require("piercer");
var mymodule  = {

	log:function(str){		
		console.log(str);
	}
};

piercer.add_proxy_async("log",function(str,next){
	console.log("proxy function");
	setTimeout(next,2000);
});

piercer.inject(mymodule);
mymodule.log("foobar");

```
Asynchronous proxies are passed the same parameters as in the function call plus the next function. So, if you expect your target function to have 3 parameters (x,y,z) then your proxy function must be defined with 4 parameters (x,y,z,next). Both synchronous and asynchronous proxies can be installed on the same target function being executed serially.

An error can be returned as a parameter of the next function. When invoked in this way the final target function won't be called but *piercer* will call the error handler if it was installed.

```

piercer.add_proxy_err("log",function(err){

    console.log(err);
});

piercer.add_proxy_async("log",function(str,next){
	console.log("proxy function");
	setTimeout(function(){
	   next("this is an error");
	},2000);
});

```

Once installed a proxy can be uninstalled calling *piercer.uninject(module, proc_name)* or *piercer.uninject(module)*.


```

var piercer = require("piercer");
var mymodule  = {

	log:function(str){		
		console.log(str);
	}
};

piercer.add_proxy_async("log",function(str,next){
	console.log("proxy function");
	setTimeout(next,2000);
});

piercer.inject(mymodule);
piercer.uninject(mymodule,"log");


```

Let's see piercer with a real module in action.

```

var piercer = require("piercer");
var Notification = require("node-notifier");
var notifier = new Notification();

piercer.add_proxy_sync("notify",function(str){
	console.log("proxy function");
});

piercer.inject(notifier);
notifier.notify({
    message: 'Hello World'
});

```


### To run the tests:
    $ grunt nodeunit



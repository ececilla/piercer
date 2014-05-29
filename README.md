Piercer: Function proxy injection [![Build Status](https://secure.travis-ci.org/ececilla/piercer.png)](http://travis-ci.org/ececilla/piercer)
===

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
Whats gets printed is:
    
    proxy function
    foobar

Synchronous proxy functions are passed the very same parameters as in the function call. In the example above, the parameter "foobar". 

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
Asynchronous proxies are passed the same parameters as in the function call plus the next function. So, if you expect your target function to have 3 parameters (x,y,z) then your proxy function must be defined with 4 parameters (x,y,z,next).

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



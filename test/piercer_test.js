'use strict';

var piercer = require('../lib/proxy.js');

exports['piercer'] = {
      
  setUp: function(done) {            
    done();
  },
  tearDown:function(done){
    piercer.clear();
    done();
  },
    "inject 2 modules": function(test){
        
    var mod = { 
      dummy:function(param){
                
      }
    },
    mod2 = {
      dummy:function(){

      }
    }

    piercer.add_proxy_sync("dummy",function(param){
            
    });
        
    piercer.inject(mod);
    test.throws(function(){
      piercer.inject(mod2);  
    });
              
    test.done();
  },
  "add_proxy_sync no params": function(test){
    
    var start, end;
    var mod = { dummy:function(param){
      test.equal(undefined, param);
      end = 1;      
    }};

    piercer.add_proxy_sync("dummy",function(param){
      test.equal(undefined, param);
      start = 1;
    });
    piercer.inject(mod);
    
    mod.dummy();    
    test.ok(start);      
    test.ok(end);
    test.expect(4);        
    test.done();
  },
  "add_proxy_sync 1 param": function(test) {
    
    var start, end;
    var mod = { dummy:function(param){
      test.equal("foo", param);
      end = 1;
    }};
    piercer.add_proxy_sync("dummy",function(param){
      test.equal("foo", param);
      start = 1;
    });
    piercer.inject(mod);
    
    mod.dummy("foo");    
    test.ok(start);      
    test.ok(end);
    test.expect(4);        
    test.done();
  }, 
  "add_proxy_sync 2 params": function(test) {
    
    var start, end;
    var mod = { dummy:function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      end = 1;
    }};
    piercer.add_proxy_sync("dummy",function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      start = 1;
    });
    piercer.add_proxy_sync("dummy",function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      start = start+1;
    });
    piercer.inject(mod);
    
    mod.dummy("foo",["bar"]);
    test.equal(2,start);      
    test.ok(end);
    test.expect(8);        
    test.done();
  },
  "add_proxy_sync 2 params concat": function(test) {
    
    var start, end;
    var mod = { dummy:function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      end = 1;
    }};
    
    piercer.add_proxy_sync("dummy",function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      start = 1;
    }).add_proxy_sync("dummy",function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      start = start+1;
    });
    piercer.inject(mod);
    
    mod.dummy("foo",["bar"]);
    test.equal(2,start);      
    test.ok(end);
    test.expect(8);        
    test.done();
  },
  "uninject with param": function(test){
    
    var start_dummy, start_foo, end_dummy, end_foo;
    var mod = { 
      dummy:function(param){
        test.equal(undefined, param);
        end_dummy = 1;      
      },
      foo:function(param){
        test.equal(undefined,param);
        end_foo = 1;
      }
    };

    piercer.add_proxy_sync("dummy",function(param){
      
      start_dummy = 1;
    }).add_proxy_sync("dummy",function(param){
      
      start_dummy = 1;
    });

    piercer.add_proxy_sync("foo",function(param){
      start_foo = 1;
    });    
    
    piercer.inject(mod);
    piercer.uninject(mod, "dummy");

    mod.dummy();
    mod.foo();

    test.equal(undefined, start_dummy);      
    test.ok(start_foo);
    test.ok(end_dummy);
    test.ok(end_foo);
    test.expect(6);        
    test.done();
  },
  "uninject": function(test){
    
    var start_dummy, start_foo, end_dummy, end_foo;
    var mod = { 
      dummy:function(param){
        test.equal(undefined, param);
        end_dummy = 1;      
      },
      foo:function(param){
        test.equal(undefined,param);
        end_foo = 1;
      }
    };

    piercer.add_proxy_sync("dummy",function(param){
      
      start_dummy = 1;
    }).add_proxy_sync("dummy",function(param){
      
      start_dummy = 1;
    });

    piercer.add_proxy_sync("foo",function(param){
      start_foo = 1;
    });    
    
    piercer.inject(mod);
    piercer.uninject(mod);

    mod.dummy();
    mod.foo();

    test.equal(undefined, start_dummy);
    test.equal(undefined, start_foo);    
    test.ok(end_dummy);
    test.ok(end_foo);
    test.expect(6);        
    test.done();
  },
  "clear": function(test){
    
    var start_dummy, start_foo, end_dummy, end_foo;
    var mod = { 
      dummy:function(param){
        test.equal(undefined, param);
        end_dummy = 1;      
      },
      foo:function(param){
        test.equal(undefined,param);
        end_foo = 1;
      }
    };

    piercer.add_proxy_sync("dummy",function(param){
      
      start_dummy = 1;
    });

    piercer.add_proxy_sync("foo",function(param){
      start_foo = 1;
    });    
    
    piercer.inject(mod);
    piercer.clear();

    mod.dummy();
    mod.foo();

    test.equal(undefined, start_dummy);
    test.equal(undefined, start_foo);    
    test.ok(end_dummy);
    test.ok(end_foo);
    test.expect(6);        
    test.done();
  },
  "add_proxy_async no params": function(test) {
    
    var start;
    var mod = { dummy:function(param){
      
      test.equal(undefined, param);
      test.ok(start);          
      test.expect(2);        
      test.done();
    }};

    piercer.add_proxy_async("dummy",function(next){      
      start = 1;
      setTimeout(next,1000);
    });
    piercer.inject(mod);
    
    mod.dummy();        
  },
  "add_proxy_async err": function(test) {
    
    var start;
    var mod = { dummy:function(param){
      
      
    }};

    piercer.add_proxy_async("dummy",function(next){      
      start = 1;
      setTimeout(function(){
        next("foobarerr")
      },1000);
    });

    piercer.add_proxy_err("dummy",function(err){

      test.equals("foobarerr",err);
      test.ok(start);          
      test.expect(2);        
      test.done();
    });
    piercer.inject(mod);
    
    mod.dummy();        
  },
  "add_proxy_async 1 param": function(test) {
    
    var start;
    var mod = { dummy:function(param){
      
      test.equal("foo", param);
      test.ok(start);          
      test.expect(3);        
      test.done();  
    }};

    piercer.add_proxy_async("dummy",function(param,next){      
            
      test.equal("foo", param);
      start = 1;      
      setTimeout(next,1000);
    });
    piercer.inject(mod);
    
    mod.dummy("foo"); 

  }
};

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

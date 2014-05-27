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
  "addPluginSync no params": function(test){
    
    var start, end;
    var mod = { dummy:function(param){
      test.equal(undefined, param);
      end = 1;      
    }};

    piercer.addPluginSync("dummy",function(param){
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
  "addPluginSync 1 param": function(test) {
    
    var start, end;
    var mod = { dummy:function(param){
      test.equal("foo", param);
      end = 1;
    }};
    piercer.addPluginSync("dummy",function(param){
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
  "addPluginSync 2 params": function(test) {
    
    var start, end;
    var mod = { dummy:function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      end = 1;
    }};
    piercer.addPluginSync("dummy",function(param1, param2){
      
      test.equal("foo", param1);
      test.deepEqual(["bar"], param2);
      start = 1;
    });
    piercer.addPluginSync("dummy",function(param1, param2){
      
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
  "addPluginAsync no params": function(test) {
    
    var start;
    var mod = { dummy:function(param){
      
      test.equal(undefined, param);
      test.ok(start);          
      test.expect(2);        
      test.done();
    }};

    piercer.addPluginAsync("dummy",function(next){      
      start = 1;
      setTimeout(next,1000);
    });
    piercer.inject(mod);
    
    mod.dummy();        
  },
  "addPluginAsync 1 param": function(test) {
    
    var start;
    var mod = { dummy:function(param){
      
      test.equal("foo", param);
      test.ok(start);          
      test.expect(3);        
      test.done();  
    }};

    piercer.addPluginAsync("dummy",function(param,next){      
            
      test.equal("foo", param);
      start = 1;      
      setTimeout(next,1000);
    });
    piercer.inject(mod);
    
    mod.dummy("foo"); 

  }
};

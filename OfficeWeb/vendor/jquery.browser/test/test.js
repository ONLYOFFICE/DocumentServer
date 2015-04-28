test_url = "http://localhost:8008"

var casper = require('casper').create({
    verbose: true
});

require('casperserver.js').create(casper);
casper.server.start();

casper.on('exit', function(status){
    casper.server.end();
});

ua = {
	chrome : {
		windows: "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Safari/537.36",
		mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Safari/537.36",
    android: "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Mobile Safari/537.36",
    linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Safari/537.36",
    version : "32.0.1664.3",
    versionNumber : 32,
    name : "chrome"
	},
	safari : {
		mac: "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71",
		ipad: "Mozilla/5.0(iPad; U; CPU iPhone OS 7_0_3 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B508 Safari/9537.53",
		iphone: "Mozilla/5.0(iPhone; CPU iPhone OS 7_0_3 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B508 Safari/9537.53",
		version: "7.0",
    versionNumber: 7,
    name : "safari"
	},
	firefox : {
		windows: "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0",
		mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:25.0) Gecko/20100101 Firefox/25.0",
    linux: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:25.0) Gecko/20100101 Firefox/25.0",
		version: "25.0",
    versionNumber: 25,
    name : "mozilla"
	},
	ie : {
        windows : {
            v_9: "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)",
            v_10: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)",
            v_11: 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'
        },
        win_phone : {
            v_10: "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 1020)"
        },
        name : "msie"
	},
  opera : {
    v_15: {
      mac : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.20 Safari/537.36 OPR/15.0.1147.18",
      windows: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.20 Safari/537.36 OPR/15.0.1147.18",
      version: "15.0.1147.18",
      versionNumber: 15
    },
    v_10: {
      mac : "Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.2.15 Version/10.00",
      windows: "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.6.30 Version/10.00",
      version: "10.00",
      versionNumber: 10
    },
    v_12: {
      mac : "Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.2.15 Version/12.11",
      windows: "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.6.30 Version/12.11",
      version: "12.11",
      versionNumber: 12
    },
    name : "opera"
  },
  android : {
    v_4_4: {
      android : "Mozilla/5.0 (Linux; Android 4.4.1; Nexus 5 Build/KOT49E) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36",
      version: "4.0",
      versionNumber: 4
    },
    name: "android"
  }
}

casper.test.begin("when using Chrome on Windows", 6, function(test) {
  casper.userAgent(ua.chrome.windows);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.chrome, "Browser should be Chrome");
    test.assertEquals(browser.name, ua.chrome.name,"Browser name should be " + ua.chrome.name);

  	test.assert(browser.webkit, "Browser should be webkit based");
  	test.assertEquals(browser.version, ua.chrome.version, "String version should be " + ua.chrome.version);
    test.assertEquals(browser.versionNumber, ua.chrome.versionNumber, "Number version should be " + ua.chrome.versionNumber);

  	test.assert(browser.win, "Platform should be Windows");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using Chrome on Mac", 6, function(test) {
  casper.userAgent(ua.chrome.mac);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.chrome, "Browser should be Chrome");
    test.assertEquals(browser.name, ua.chrome.name,"Browser name should be " + ua.chrome.name);

  	test.assert(browser.webkit, "Browser should be webkit based");
  	test.assertEquals(browser.version, ua.chrome.version, "Version should be " + ua.chrome.version);
    test.assertEquals(browser.versionNumber, ua.chrome.versionNumber, "Number version should be " + ua.chrome.versionNumber);

  	test.assert(browser.mac, "Platform should be mac");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using Chrome on an Android device", 6, function(test) {
  casper.userAgent(ua.chrome.android);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.chrome, "Browser should be Chrome");
    test.assertEquals(browser.name, ua.chrome.name,"Browser name should be " + ua.chrome.name);

    test.assert(browser.webkit, "Browser should be webkit based");
    test.assertEquals(browser.version, ua.chrome.version, "Version should be " + ua.chrome.version);
    test.assertEquals(browser.versionNumber, ua.chrome.versionNumber, "Version should be " + ua.chrome.versionNumber);

    test.assert(browser.android, "Platform should be android");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Chrome on Linux", 6, function(test) {
  casper.userAgent(ua.chrome.linux);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.chrome, "Browser should be Chrome");
    test.assertEquals(browser.name, ua.chrome.name,"Browser name should be " + ua.chrome.name);

    test.assert(browser.webkit, "Browser should be webkit based");
    test.assertEquals(browser.version, ua.chrome.version, "Version should be " + ua.chrome.version);
    test.assertEquals(browser.versionNumber, ua.chrome.versionNumber, "Version should be " + ua.chrome.versionNumber);

    test.assert(browser.linux, "Platform should be linux");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Firefox on Windows", 6, function(test) {
  casper.userAgent(ua.firefox.windows);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});

  	test.assert(browser.mozilla, "Browser should be Mozilla");
    test.assertEquals(browser.name, ua.firefox.name,"Browser name should be " + ua.firefox.name);

  	test.assertEquals(browser.version, ua.firefox.version, "Version should be " + ua.firefox.version);
    test.assertEquals(browser.versionNumber, ua.firefox.versionNumber, "Version should be " + ua.firefox.versionNumber);
  	test.assert(browser.win, "Platform should be Windows");

  	test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using Firefox on Mac", 6, function(test) {
  casper.userAgent(ua.firefox.mac);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.mozilla, "Browser should be Mozilla");
    test.assertEquals(browser.name, ua.firefox.name,"Browser name should be " + ua.firefox.name);

  	test.assertEquals(browser.version, ua.firefox.version, "Version should be " + ua.firefox.version);
    test.assertEquals(browser.versionNumber, ua.firefox.versionNumber, "Version should be " + ua.firefox.versionNumber);
  	test.assert(browser.mac, "Platform should be mac");

  	test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using Firefox on Linux", 6, function(test) {
  casper.userAgent(ua.firefox.linux);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.mozilla, "Browser should be Mozilla");
    test.assertEquals(browser.name, ua.firefox.name,"Browser name should be " + ua.firefox.name);

    test.assertEquals(browser.version, ua.firefox.version, "Version should be " + ua.firefox.version);
    test.assertEquals(browser.versionNumber, ua.firefox.versionNumber, "Version should be " + ua.firefox.versionNumber);
    test.assert(browser.linux, "Platform should be linux");

    test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Safari on Mac", 6, function(test) {
  casper.userAgent(ua.safari.mac);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.safari, "Browser should be Safari");
    test.assertEquals(browser.name, ua.safari.name,"Browser name should be " + ua.safari.name);

  	test.assert(browser.webkit, "Browser should be webkit based");
  	test.assertEquals(browser.version, ua.safari.version, "Version should be " + ua.safari.version);
    test.assertEquals(browser.versionNumber, ua.safari.versionNumber, "Version should be " + ua.safari.versionNumber);

  	test.assert(browser.mac, "Platform should be mac");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using Safari on iPad", 6, function(test) {
  casper.userAgent(ua.safari.ipad);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.safari, "Browser should be Safari");
    test.assertEquals(browser.name, ua.safari.name,"Browser name should be " + ua.safari.name);

  	test.assert(browser.webkit, "Browser should be webkit based");
  	test.assertEquals(browser.version, ua.safari.version, "Version should be " + ua.safari.version);
    test.assertEquals(browser.versionNumber, ua.safari.versionNumber, "Version number should be " + ua.safari.versionNumber);

  	test.assert(browser.ipad, "Platform should be iPad");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using Safari on iPhone", 6, function(test) {
  casper.userAgent(ua.safari.iphone);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.safari, "Browser should be Safari");
    test.assertEquals(browser.name, ua.safari.name,"Browser name should be " + ua.safari.name);

  	test.assert(browser.webkit, "Browser should be webkit based");
  	test.assertEquals(browser.version, ua.safari.version, "Version should be " + ua.safari.version);
    test.assertEquals(browser.versionNumber, ua.safari.versionNumber, "Version number should be " + ua.safari.versionNumber);

  	test.assert(browser.iphone, "Platform should be iPhone");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using IE9", 6, function(test) {
  casper.userAgent(ua.ie.windows.v_9);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.msie, "Browser should be IE");
    test.assertEquals(browser.name, ua.ie.name,"Browser name should be " + ua.ie.name);

  	test.assertEquals(browser.version, "9.0", "Version should be 9.0");
    test.assertEquals(browser.versionNumber, 9, "Version should be 9");
  	test.assert(browser.win, "Platform should be Windows");

  	test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using IE10", 6, function(test) {
  casper.userAgent(ua.ie.windows.v_10);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.msie, "Browser should be IE");
    test.assertEquals(browser.name, ua.ie.name,"Browser name should be " + ua.ie.name);

  	test.assertEquals(browser.version, "10.0", "Version should be 10");
    test.assertEquals(browser.versionNumber, 10, "Version should be 10");
  	test.assert(browser.win, "Platform should be Windows");

  	test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using IE11", 6, function(test) {
  casper.userAgent(ua.ie.windows.v_11);

  casper.start(test_url).then(function(){
  	
  	var browser = casper.evaluate(function(){
  		return $.browser;
  	});
  	
  	test.assert(browser.msie, "Browser should be IE");
    test.assertEquals(browser.name, ua.ie.name,"Browser name should be " + ua.ie.name);

  	test.assertEquals(browser.version, "11.0", "Version should be 11.0");
    test.assertEquals(browser.versionNumber, 11, "Version should be 11");
  	test.assert(browser.win, "Platform should be Windows");

  	test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
  	test.done();
  });
});

casper.test.begin("when using IE10 on a Windows Phone", 6, function(test) {
  casper.userAgent(ua.ie.win_phone.v_10);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
        return $.browser;
    });
    
    test.assert(browser.msie, "Browser should be IE");
    test.assertEquals(browser.name, ua.ie.name,"Browser name should be " + ua.ie.name);

    test.assertEquals(browser.version, "10.0", "Version should be 10.0");
    test.assertEquals(browser.versionNumber, 10, "Version should be 10");
    test.assert(browser["windows phone"], "Platform should be Windows Phone");

    test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Opera 15+ on Windows", 6, function(test) {
  casper.userAgent(ua.opera.v_15.windows);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.opera, "Browser should be Opera");
    test.assertEquals(browser.name, ua.opera.name,"Browser name should be " + ua.opera.name);

    test.assertEquals(browser.version, ua.opera.v_15.version, "Version should be " + ua.opera.v_15.version);
    test.assertEquals(browser.versionNumber, ua.opera.v_15.versionNumber, "Version number should be " + ua.opera.v_15.versionNumber);
    test.assert(browser.win, "Platform should be Windows");

    test.assert(browser.webkit, "Browser should be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Opera 15+ on Mac", 6, function(test) {
  casper.userAgent(ua.opera.v_15.mac);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.opera, "Browser should be Opera");
    test.assertEquals(browser.name, ua.opera.name,"Browser name should be " + ua.opera.name);

    test.assertEquals(browser.version, ua.opera.v_15.version, "Version should be " + ua.opera.v_15.version)
    test.assertEquals(browser.versionNumber, ua.opera.v_15.versionNumber, "Version number should be " + ua.opera.v_15.versionNumber);
    test.assert(browser.mac, "Platform should be Mac");

    test.assert(browser.webkit, "Browser should be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Opera 10 on Windows", 6, function(test) {
  casper.userAgent(ua.opera.v_10.windows);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.opera, "Browser should be Opera");
    test.assertEquals(browser.name, ua.opera.name,"Browser name should be " + ua.opera.name);

    test.assertEquals(browser.version, ua.opera.v_10.version, "Version should be " + ua.opera.v_10.version);
    test.assertEquals(browser.versionNumber, ua.opera.v_10.versionNumber, "Version number should be " + ua.opera.v_10.versionNumber);
    test.assert(browser.win, "Platform should be Windows");

    test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Opera 10 on Mac", 6, function(test) {
  casper.userAgent(ua.opera.v_10.mac);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.opera, "Browser should be Opera");
    test.assertEquals(browser.name, ua.opera.name,"Browser name should be " + ua.opera.name);

    test.assertEquals(browser.version, ua.opera.v_10.version, "Version should be " + ua.opera.v_10.version);
    test.assertEquals(browser.versionNumber, ua.opera.v_10.versionNumber, "Version number should be " + ua.opera.v_10.versionNumber);
    test.assert(browser.mac, "Platform should be Mac");

    test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Opera 12.11 on Windows", 6, function(test) {
  casper.userAgent(ua.opera.v_12.windows);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.opera, "Browser should be Opera");
    test.assertEquals(browser.name, ua.opera.name,"Browser name should be " + ua.opera.name);

    test.assertEquals(browser.version, ua.opera.v_12.version, "Version should be " + ua.opera.v_12.version);
    test.assertEquals(browser.versionNumber, ua.opera.v_12.versionNumber, "Version number should be " + ua.opera.v_12.versionNumber);
    test.assert(browser.win, "Platform should be Windows");

    test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Opera 12.11 on Mac", 6, function(test) {
  casper.userAgent(ua.opera.v_12.mac);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.opera, "Browser should be Opera");
    test.assertEquals(browser.name, ua.opera.name,"Browser name should be " + ua.opera.name);

    test.assertEquals(browser.version, ua.opera.v_12.version, "Version should be " + ua.opera.v_12.version);
    test.assertEquals(browser.versionNumber, ua.opera.v_12.versionNumber, "Version number should be " + ua.opera.v_12.versionNumber);
    test.assert(browser.mac, "Platform should be Mac");

    test.assertFalsy(browser.webkit, "Browser should NOT be webkit based");

  }).run(function(){
    test.done();
  });
});

casper.test.begin("when using Android 4.4 stock browser on Android", 5, function(test) {
  casper.userAgent(ua.android.v_4_4.android);

  casper.start(test_url).then(function(){
    
    var browser = casper.evaluate(function(){
      return $.browser;
    });
    
    test.assert(browser.android, "Browser should be Android");
    test.assertEquals(browser.name, ua.android.name,"Browser name should be " + ua.android.name);

    test.assertEquals(browser.version, ua.android.v_4_4.version, "Version should be " + ua.android.v_4_4.version);
    test.assertEquals(browser.versionNumber, ua.android.v_4_4.versionNumber, "Version number should be " + ua.android.v_4_4.versionNumber);

    test.assert(browser.webkit, "Browser should be webkit based");

  }).run(function(){
    test.done();
    casper.exit();
  });
});

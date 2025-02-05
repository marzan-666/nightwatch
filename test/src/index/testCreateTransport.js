const assert = require('assert');
const nock = require('nock');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Selenium2 = common.require('transport/selenium2.js');
const WebDriver = common.require('transport/webdriver.js');
const JsonWire = common.require('transport/jsonwire.js');
const Selenium3 = common.require('transport/selenium3.js');
const Browserstack = common.require('transport/browserstack.js');

describe('Transport.create()', function () {
  before(function() {
    try {
      nock.activate();
    } catch (err) {}
  });

  it('test create Transport for Selenium3 external with Firefox', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false
      },
      webdriver: {},
      desiredCapabilities: {
        browserName: 'firefox'
      },
      selenium_host: 'remote.url'
    });

    assert.ok(client.transport instanceof Selenium3);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium3 external with Firefox - seleniumHost property', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false
      },
      webdriver: {},
      desiredCapabilities: {
        browserName: 'firefox'
      },
      seleniumHost: 'remote.url'
    });

    assert.ok(client.transport instanceof Selenium3);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Webdriver external - host property', function() {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'remote.url'
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof WebDriver);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium3 external with Chrome', function() {
    const client = NightwatchClient.client({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: 'remote.url'
    });

    assert.ok(client.transport instanceof Selenium2);
    assert.strictEqual(client.settings.webdriver.host, 'remote.url');
  });

  it('test create Transport for Selenium3 managed', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: true
      },
      webdriver: {
        start_process: false
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof Selenium3);
  });

  it('test create Transport for Selenium2 managed explicit version2 setting', function() {
    const client = NightwatchClient.client({
      selenium: {
        version2: true,
        start_process: true
      },
      webdriver: {
        start_process: false
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof Selenium2);
    assert.strictEqual(client.transport instanceof Selenium3, false);
  });

  it('test create Transport with unknown browser', function() {
    assert.throws(function() {
      NightwatchClient.client({
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'firfox'
        }
      });
    }, /Unknown browser: "firfox"; did you mean "firefox"\?$/);
  });

  it('test create Transport for Firefox managed', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    assert.ok(client.transport instanceof WebDriver);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof JsonWire, false);
  });

  it('test create Transport for Chrome managed', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });

    assert.ok(client.transport instanceof JsonWire);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof WebDriver, false);
    assert.deepStrictEqual(client.session.desiredCapabilities, {
      browserName: 'chrome',
      'goog:chromeOptions': {}
    });
  });

  it('test create Transport for Chrome managed with w3c:true', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          w3c: true
        }
      }
    });

    assert.strictEqual(client.transport instanceof JsonWire, false);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof WebDriver, true);
    assert.deepStrictEqual(client.session.desiredCapabilities, {
      browserName: 'chrome',
      'goog:chromeOptions': {
        w3c: true
      }
    });
  });

  it('test create Transport for Chrome managed with w3c:false', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          w3c: false
        }
      }
    });

    assert.strictEqual(client.transport instanceof JsonWire, true);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof WebDriver, false);
    assert.deepStrictEqual(client.session.desiredCapabilities, {
      browserName: 'chrome',
      'goog:chromeOptions': {
        w3c: false
      }
    });
  });

  it('test create Transport for Edge managed with w3c:true', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        edgeOptions: {
          w3c: true
        }
      }
    });

    assert.strictEqual(client.transport instanceof JsonWire, false);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof WebDriver, true);
    assert.deepStrictEqual(client.session.desiredCapabilities, {
      browserName: 'MicrosoftEdge',
      'ms:edgeOptions': {
        w3c: true
      }
    });
  });

  it('test create Transport for Edge managed', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      }
    });

    assert.ok(client.transport instanceof JsonWire);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof WebDriver, false);
    assert.deepStrictEqual(client.session.desiredCapabilities, {
      browserName: 'MicrosoftEdge',
      'ms:edgeOptions': {}
    });
  });

  it('test create Transport for Edge managed with w3c:false', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
          w3c: false
        }
      }
    });

    assert.strictEqual(client.transport instanceof JsonWire, true);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
    assert.strictEqual(client.transport instanceof WebDriver, false);
    assert.deepStrictEqual(client.session.desiredCapabilities, {
      browserName: 'MicrosoftEdge',
      'ms:edgeOptions': {
        w3c: false
      }
    });
  });

  it('test create Transport for Safari managed', function() {
    const Transport = common.require('transport/transport.js');

    let safariDriver = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'safari'
        }
      }
    });

    assert.ok(safariDriver instanceof WebDriver);
  });

  it('test create Transport for Safari remote', function() {
    const Transport = common.require('transport/transport.js');

    let safariDriver = Transport.create({
      settings: {
        selenium: {
          start_process: false
        },
        webdriver: {
          start_process: false,
          host: 'remote.url'
        },
        desiredCapabilities: {
          browserName: 'safari'
        }
      }
    });

    assert.ok(safariDriver instanceof JsonWire);
    assert.strictEqual(safariDriver instanceof Selenium2, false);
    assert.strictEqual(safariDriver instanceof Selenium3, false);
    assert.strictEqual(safariDriver instanceof WebDriver, false);
  });

  it('test create Transport for Chrome managed and no selenium settings', function() {
    const Transport = common.require('transport/transport.js');

    let chromeDriver = Transport.create({
      settings: {
        webdriver: {
          start_process: true
        },
        desiredCapabilities: {
          browserName: 'chrome'
        }
      }
    });

    assert.ok(chromeDriver instanceof JsonWire);
    assert.strictEqual(chromeDriver instanceof Selenium2, false);
    assert.strictEqual(chromeDriver instanceof Selenium3, false);
    assert.strictEqual(chromeDriver instanceof WebDriver, false);
  });

  it('test create Transport for WebDriver managed and no selenium settings', function() {
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'safari'
      }
    });

    assert.ok(client.transport instanceof WebDriver);
    assert.strictEqual(client.transport instanceof Selenium2, false);
    assert.strictEqual(client.transport instanceof Selenium3, false);
  });

  it('test check for ssl when webdriver port is 443', function () {
    const Transport = common.require('transport/transport.js');

    const instance = {
      settings: {
        webdriver: {
          start_process: true,
          port: 443,
          host: 'remote.host'
        },
        desiredCapabilities: {
          browserName: 'chrome'
        }
      }
    };

    const chromeDriver = Transport.create(instance);
    assert.strictEqual(instance.settings.webdriver.ssl, true);
  });

  it('test create Transport for Selenium remote cloud service with Chrome', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: false
      },
      desiredCapabilities: {
        browserName: 'Chrome'
      },
      selenium_host: 'remote.host'
    });

    assert.ok(client.transport instanceof Selenium2);

    const elementId = client.transport.getElementId({
      'element-6066-11e4-a52e-4f735466cecf': 'abcd-123'
    });
    assert.strictEqual(elementId, 'abcd-123');

    const elementId2 = client.transport.getElementId({
      ELEMENT: 'abcd-1234'
    });
    assert.strictEqual(elementId2, 'abcd-1234');

    assert.strictEqual(client.settings.webdriver.host, 'remote.host');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
  });

  it('test create Transport for Selenium remote cloud service with MicrosoftEdge', function() {
    const client = NightwatchClient.client({
      selenium: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      },
      selenium_host: 'remote.host'
    });

    assert.ok(client.transport instanceof Selenium2);
    assert.strictEqual(client.settings.webdriver.host, 'remote.host');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.transport instanceof Selenium3, false);
  });

  it('test create Transport for Browserstack', function(done) {
    assert.throws(function() {
      NightwatchClient.client({
        webdriver: {
          host: 'hub-cloud.browserstack.com',
          port: 443
        }
      });
    }, /BrowserStack access key is not set\. Verify that "browserstack\.key" capability is set correctly or set BROWSERSTACK_KEY environment variable \(\.env files are supported\)\./);

    assert.throws(function() {
      NightwatchClient.client({
        webdriver: {
          host: 'hub-cloud.browserstack.com',
          port: 443
        },
        desiredCapabilities: {
          'browserstack.key': 'test-access-key'
        }
      });
    }, /BrowserStack username is not set\. Verify that "browserstack\.user" capability is set correctly or set BROWSERSTACK_USER environment variable \(\.env files are supported\)\./);

    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'nightwatch-test-build',
            hashed_id: '123-567-89'
          }
        },
        {
          automation_build: {
            name: 'test-build'
          }
        }
      ]);

    assert.ok(client.transport instanceof Browserstack);
    assert.strictEqual(client.settings.webdriver.host, 'hub-cloud.browserstack.com');
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.start_process, false);
    assert.strictEqual(client.settings.webdriver.ssl, true);

    const {transport} = client;
    assert.strictEqual(transport instanceof WebDriver, false);
    assert.strictEqual(transport.username, 'test-access-user');
    assert.strictEqual(transport.accessKey, 'test-access-key');

    client.emit('nightwatch:session.create', {
      sessionId: '1234567'
    });
    setTimeout(async function() {
      assert.strictEqual(transport.buildId, '123-567-89');

      try {
        let result;
        nock('https://api.browserstack.com')
          .put('/automate/sessions/1234567.json', {
            status: 'passed',
            reason: ''
          })
          .reply(200, {});

        result = await transport.testSuiteFinished(false);
        assert.strictEqual(result, true);
        assert.strictEqual(transport.sessionId, null);

        done();
      } catch (e) {
        done(e);
      }
    }, 100);

  });

  it('test create Transport for Browserstack with failures', function(done) {
    const client = NightwatchClient.client({
      webdriver: {
        host: 'hub-cloud.browserstack.com',
        port: 443,
        start_process: true
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    });

    nock('https://api.browserstack.com')
      .get('/automate/builds.json')
      .reply(200, [
        {
          automation_build: {
            name: 'nightwatch-test-build',
            hashed_id: '123-567-89'
          }
        },
        {
          automation_build: {
            name: 'test-build'
          }
        }
      ]);

    const {transport} = client;
    client.emit('nightwatch:session.create', {
      sessionId: '1234567'
    });
    setTimeout(async function() {
      try {
        let result;
        nock('https://api.browserstack.com')
          .put('/automate/sessions/1234567.json', {
            status: 'failed',
            reason: 'NightwatchAssertError: Timed out while waiting for element <#james> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5400ms)'
          })
          .reply(200, {});

        result = await transport.testSuiteFinished(true, {name: 'NightwatchAssertError', message: 'Timed out while waiting for element <#james> to be present for 5000 milliseconds. - expected [0;32m"visible"[0m but got: [0;31m"not found"[0m [0;90m(5400ms)[0m'});
        assert.strictEqual(result, true);
        assert.strictEqual(transport.sessionId, null);

        done();
      } catch (e) {
        done(e);
      }
    }, 100);

  });
});

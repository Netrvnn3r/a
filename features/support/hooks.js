const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

// Set default timeout to 60 seconds
setDefaultTimeout(60 * 1000);

Before(async function (scenario) {
    // Check if the scenario is tagged with @api
    const isApiTest = scenario.pickle.tags.some(tag => tag.name === '@api');

    if (isApiTest) {
        return; // Skip browser initialization for API tests
    }

    // Dynamic path resolution for Local vs CI
    const localChromeDriver = path.join(process.cwd(), 'drivers', 'chromedriver-win64', 'chromedriver-win64', 'chromedriver.exe');
    const localChromeBinary = path.join(process.cwd(), 'drivers', 'chrome-win64', 'chrome.exe');

    const fs = require('fs');
    let service;
    const options = new chrome.Options();

    if (fs.existsSync(localChromeDriver)) {
        service = new chrome.ServiceBuilder(localChromeDriver);
    }

    if (fs.existsSync(localChromeBinary)) {
        options.setChromeBinaryPath(localChromeBinary);
    }

    // Check for Headless mode
    if (process.env.HEADLESS === 'true') {
        options.addArguments('--headless=new'); // Use modern headless mode
    }

    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--start-maximized');

    this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();
});

After(async function () {
    if (this.driver) {
        await this.driver.quit();
    }
});

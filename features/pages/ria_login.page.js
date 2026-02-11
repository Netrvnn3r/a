require('dotenv').config();
const { By, until } = require('selenium-webdriver');

class RiaLoginPage {

    continueToWebsiteButton = By.css('a[href*="secure.riamoneytransfer.com"]');
    emailOrPhoneInput = By.xpath("//label[contains(text(), 'Phone or email')]/following::input[1]");
    passwordInput = By.css('input[type="password"]');
    registerHyperlink = By.css('a[href="/registration"]');

    constructor(driver) {
        this.driver = driver;
    }

    async clickContinueToWebsite() {
        await this.driver.wait(until.elementLocated(this.continueToWebsiteButton), 10000);
        const continueButton = await this.driver.findElement(this.continueToWebsiteButton);

        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", continueButton);
        await this.driver.sleep(500);

        try {
            await continueButton.click();
        } catch (error) {
            await this.driver.executeScript("arguments[0].click();", continueButton);
        }

        await this.driver.sleep(3000);
    }

    async validateURLContains(expectedURL) {
        await this.driver.sleep(2000);
        const currentURL = await this.driver.getCurrentUrl();
        console.log(`Current URL: ${currentURL}`);
        return currentURL.includes(expectedURL);
    }

    async verifyLoginPageElements() {
        await this.driver.wait(until.elementLocated(this.emailOrPhoneInput), 10000);
        await this.driver.wait(until.elementLocated(this.passwordInput), 10000);
        await this.driver.wait(until.elementLocated(this.registerHyperlink), 10000);

        const emailField = await this.driver.findElement(this.emailOrPhoneInput);
        const passwordField = await this.driver.findElement(this.passwordInput);
        const registerLink = await this.driver.findElement(this.registerHyperlink);

        const isEmailDisplayed = await emailField.isDisplayed();
        const isPasswordDisplayed = await passwordField.isDisplayed();
        const isRegisterDisplayed = await registerLink.isDisplayed();

        console.log(`Login page elements displayed - Email: ${isEmailDisplayed}, Password: ${isPasswordDisplayed}, Register: ${isRegisterDisplayed}`);

        return isEmailDisplayed && isPasswordDisplayed && isRegisterDisplayed;
    }

    async clickRegisterHyperlink() {
        await this.driver.wait(until.elementLocated(this.registerHyperlink), 10000);
        const registerLink = await this.driver.findElement(this.registerHyperlink);

        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", registerLink);
        await this.driver.sleep(500);

        try {
            await registerLink.click();
        } catch (error) {
            await this.driver.executeScript("arguments[0].click();", registerLink);
        }

        await this.driver.sleep(2000);
    }

}

module.exports = RiaLoginPage;

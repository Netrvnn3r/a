require('dotenv').config();
const { By, until } = require('selenium-webdriver');

class RiaRegistrationPage {

    countryDropdownLabel = By.css('.p-dropdown-label');
    countryDropdownButton = By.xpath("//label[contains(text(), 'Country')]/following::div[@role='button'][1]");
    continueButton = By.css('button.oen-ui-button--primary');

    constructor(driver) {
        this.driver = driver;
    }

    async validateRegistrationURL(expectedURL) {
        await this.driver.sleep(2000);
        const currentURL = await this.driver.getCurrentUrl();
        console.log(`Registration page URL: ${currentURL}`);
        return currentURL === expectedURL;
    }

    async verifyCountrySelectionPageDisplayed() {
        await this.driver.wait(until.elementLocated(this.countryDropdownLabel), 10000);
        await this.driver.wait(until.elementLocated(this.continueButton), 10000);

        const dropdown = await this.driver.findElement(this.countryDropdownLabel);
        const continueBtn = await this.driver.findElement(this.continueButton);

        const isDropdownDisplayed = await dropdown.isDisplayed();
        const isContinueDisplayed = await continueBtn.isDisplayed();

        console.log(`Country selection elements - Dropdown: ${isDropdownDisplayed}, Continue: ${isContinueDisplayed}`);

        return isDropdownDisplayed && isContinueDisplayed;
    }

}

module.exports = RiaRegistrationPage;

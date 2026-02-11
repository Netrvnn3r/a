require('dotenv').config();
const { By, Key, until } = require('selenium-webdriver');

class RiaChallengePage {

    //MAIN CALCULATOR VIEW
    youSendInput = By.css('#amount-from');
    TheyReceiveButton = By.css('button[aria-label="Select destination"]');
    getSelectedCurrency = By.css('button[aria-label="Select destination"]');
    TheyReceiveInput = By.css('#amount-to');
    paymentMethodButton = By.xpath("//span[text()='Payment method']/following::button[1]");
    DeliveryMethodButton = By.xpath("//span[text()='Delivery method']/following::button[1]");
    getFeesAmount = By.xpath("//span[text()='Fee']/ancestor::div[1]/following-sibling::div");
    getTotalToPayAmount = By.xpath("//span[text()='Total to pay']/following-sibling::span");
    SubmitButton = By.xpath("//a[contains(text(), 'Start your transfer')]");

    //SELECT DESTINATION POPUP
    CurrencyOrCountryInput = By.css('input[placeholder="Search currency or country"]');
    selectCurrency = By.css('button[role="option"]');

    //SELECT PAYMENT METHOD POPUP
    payDirectBank = By.xpath("//button[@role='option'][.//span[contains(text(), 'Direct bank')]]");
    payInPerson = By.xpath("//button[@role='option'][.//span[contains(text(), 'Pay in person')]]");

    //SELECT DELIVERY METHOD POPUP
    deliveryCashPickup = By.xpath("//button[@role='option'][.//span[contains(text(), 'Cash pickup')]]");
    deliveryBank = By.xpath("//button[@role='option'][.//span[text()='Bank']]");
    deliveryMobileWallet = By.xpath("//button[@role='option'][.//span[contains(text(), 'Mobile wallet')]]");


    constructor(driver) {
        this.driver = driver;
        this.baseUrl = process.env.BASE_URL;
    }

    async launchBrowser() {
        if (!this.baseUrl) throw new Error('BASE_URL is not defined in .env file');
        await this.driver.get(this.baseUrl);
        await this.driver.manage().window().maximize();
    }

    async verifyCoreElements() {
        await this.driver.wait(until.elementLocated(this.youSendInput), 20000);
        const amountInput = await this.driver.findElement(this.youSendInput);
        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", amountInput);
        await this.driver.sleep(2000);
        await this.driver.wait(until.elementLocated(this.TheyReceiveButton), 10000);
        await this.driver.wait(until.elementLocated(this.paymentMethodButton), 10000);
        await this.driver.wait(until.elementLocated(this.DeliveryMethodButton), 10000);
    }

    async enterAmount(amount) {
        await this.driver.wait(until.elementLocated(this.youSendInput), 10000);
        const amountInput = await this.driver.findElement(this.youSendInput);
        await amountInput.clear();
        await amountInput.sendKeys(amount.toString());
        await this.driver.sleep(1000);
    }

    async selectDestinationCountry(country) {
        await this.driver.wait(until.elementLocated(this.TheyReceiveButton), 10000);
        const destinationButton = await this.driver.findElement(this.TheyReceiveButton);
        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", destinationButton);
        await this.driver.sleep(500);

        try {
            await destinationButton.click();
        } catch (error) {
            await this.driver.executeScript("arguments[0].click();", destinationButton);
        }

        await this.driver.wait(until.elementLocated(this.CurrencyOrCountryInput), 10000);
        const searchInput = await this.driver.findElement(this.CurrencyOrCountryInput);
        await this.driver.wait(until.elementIsVisible(searchInput), 10000);
        await this.driver.sleep(500);

        await searchInput.sendKeys(country);
        await this.driver.sleep(500);

        const countryOption = await this.driver.findElement(
            By.xpath(`//button[@role='option'][contains(., '${country}')]`)
        );
        await countryOption.click();
        await this.driver.sleep(1000);
    }

    async selectPaymentMethod(method) {
        await this.driver.wait(until.elementLocated(this.paymentMethodButton), 10000);
        const paymentButton = await this.driver.findElement(this.paymentMethodButton);
        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", paymentButton);
        await this.driver.sleep(500);

        try {
            await paymentButton.click();
        } catch (error) {
            await this.driver.executeScript("arguments[0].click();", paymentButton);
        }

        await this.driver.sleep(500);

        let paymentOption;
        if (method.toLowerCase().includes('direct bank')) {
            paymentOption = await this.driver.findElement(this.payDirectBank);
        } else if (method.toLowerCase().includes('person')) {
            paymentOption = await this.driver.findElement(this.payInPerson);
        }

        await paymentOption.click();
        await this.driver.sleep(1000);
    }

    async selectDeliveryMethod(method) {
        await this.driver.wait(until.elementLocated(this.DeliveryMethodButton), 10000);
        const deliveryButton = await this.driver.findElement(this.DeliveryMethodButton);
        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", deliveryButton);
        await this.driver.sleep(500);

        try {
            await deliveryButton.click();
        } catch (error) {
            await this.driver.executeScript("arguments[0].click();", deliveryButton);
        }

        await this.driver.sleep(500);

        let deliveryOption;
        if (method.toLowerCase().includes('bank')) {
            deliveryOption = await this.driver.findElement(this.deliveryBank);
        } else if (method.toLowerCase().includes('cash')) {
            deliveryOption = await this.driver.findElement(this.deliveryCashPickup);
        } else if (method.toLowerCase().includes('mobile')) {
            deliveryOption = await this.driver.findElement(this.deliveryMobileWallet);
        }

        await deliveryOption.click();
        await this.driver.sleep(1000);
    }

    async validateTotalAndFees() {
        await this.driver.wait(until.elementLocated(this.getTotalToPayAmount), 10000);
        const totalElement = await this.driver.findElement(this.getTotalToPayAmount);
        const totalText = await totalElement.getText();
        console.log(`Total to pay: ${totalText}`);

        await this.driver.wait(until.elementLocated(this.getFeesAmount), 10000);
        const feesElement = await this.driver.findElement(this.getFeesAmount);
        const feesText = await feesElement.getText();
        console.log(`Fees: ${feesText}`);

        return { total: totalText, fees: feesText };
    }

    async getSelectedCurrencyCode() {
        await this.driver.sleep(2000);
        await this.driver.wait(until.elementLocated(this.getSelectedCurrency), 10000);
        const buttonElement = await this.driver.findElement(this.getSelectedCurrency);

        const buttonText = await this.driver.executeScript(
            "return arguments[0].innerText || arguments[0].textContent;",
            buttonElement
        );
        console.log(`Selected destination button text: '${buttonText}'`);
        const currencyMatch = buttonText.match(/\b([A-Z]{3})\b/);
        if (currencyMatch) {
            console.log(`Extracted currency code: ${currencyMatch[1]}`);
            return currencyMatch[1];
        }

        console.log(`Warning: No currency code found in text: '${buttonText}'`);
        return buttonText.trim();
    }

    async clickStartTransferButton() {
        await this.driver.wait(until.elementLocated(this.SubmitButton), 10000);
        const startButton = await this.driver.findElement(this.SubmitButton);

        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", startButton);
        await this.driver.sleep(500);

        try {
            await startButton.click();
        } catch (error) {
            await this.driver.executeScript("arguments[0].click();", startButton);
        }

        await this.driver.sleep(1000);
    }

    async editTheyReceiveAmount(amount) {
        await this.driver.wait(until.elementLocated(this.TheyReceiveInput), 10000);
        const receiveInput = await this.driver.findElement(this.TheyReceiveInput);

        await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", receiveInput);
        await this.driver.sleep(500);

        await receiveInput.clear();
        await receiveInput.sendKeys(amount.toString());
        await this.driver.sleep(2000); // Wait for conversion to happen

        console.log(`Updated "They receive" amount to: ${amount}`);
    }

    async getYouSendAmount() {
        await this.driver.wait(until.elementLocated(this.youSendInput), 10000);
        const sendInput = await this.driver.findElement(this.youSendInput);
        const value = await sendInput.getAttribute('value');
        console.log(`Current "You send" amount: ${value}`);
        return value.trim();
    }

}

module.exports = RiaChallengePage;

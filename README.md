# Selenium Cucumber BDD Framework

A specialized test automation framework for web applications, integrating Selenium WebDriver with Cucumber and JavaScript. This project utilizes the Page Object Model (POM) and includes a specialized module for API testing using Axios.

## Installation and Setup

To get the project running on your local machine, follow these steps:

### 1. Prerequisites
- **Node.js**: Ensure you have Node.js (v14 or later) installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Google Chrome**: The tests are configured to run on Chrome.

### 2. Install Dependencies
Clone the repository and run the following command in the project root:
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory (or edit the existing one) to specify your base URL:
```env
BASE_URL=https://www.riamoneytransfer.com/en-cl/
HEADLESS=false
```

### 4. Browser Drivers (Required for UI Tests)
Selenium requires a matching driver executable to interact with your browser.
- **Location**: You **must** place your browser drivers (e.g., `chromedriver.exe`) inside the `drivers/` folder.
- **Version**: Ensure the `chromedriver` version matches your installed Chrome version.
- **Download**: You can find drivers at the [official ChromeDriver site](https://googlechromelabs.github.io/chrome-for-testing/).

## Directory Structure

Understanding the folder organization is key to working with the framework:

```
Hauyon-Selenium-bdd/
├── features/                # Test-related files
│   ├── api/                 # API client and logic (Axios)
│   ├── pages/               # UI Page Objects (Locators and logic)
│   ├── steps/               # Step Definitions (Glue code)
│   ├── support/             # Hooks and environment setup
│   ├── api_tasks.feature    # API Scenarios
│   └── ria_challenge.feature # UI Scenarios in Gherkin
├── drivers/                 # Vital: Folder for browser executables
├── reports/                 # Auto-generated test results
├── .env                     # Environment variables
├── cucumber.js              # Cucumber configuration
└── package.json             # Scripts and library dependencies
```

## Running Tests

You can execute tests using the following terminal commands:

### UI Tests
**Run all UI tests (Default):**
```bash
npm test
```

**Run in Headless mode (No browser window):**
```bash
npm run test:headless
```

### API Tests
API tests are inherently headless as they do not require a browser.
**Run only API tests:**
```bash
npx cucumber-js --tags "@api"
```

**Generate Reports:**
After execution, a detailed HTML report is generated in `reports/cucumber-report.html`.

## How the BDD Framework Works

### 1. UI Layer (Selenium)
- **Features**: Tests written in Gherkin (Given, When, Then).
- **Page Objects**: Centralized classes for element locators and Selenium interaction methods.
- **Step Definitions**: Connect Gherkin steps to Page Object methods.

### 2. API Layer (Axios)
- **API Helper**: A centralized utility (`features/api/api_helper.js`) that handles HTTP requests (GET, POST, etc.) using Axios.
- **Optimization**: The framework is configured to skip browser initialization for tests tagged with `@api`, making them extremely fast and fully headless.

## Best Practices
- **Thin Steps**: Keep Step Definitions simple; move all interaction logic into Page Objects or API Helpers.
- **Hooks**: Use `@api` tag to avoid unnecessary browser startup for API-only scenarios.
- **Wait for Elements**: In UI tests, always use Selenium's `until.elementLocated()` to ensure stability.

#Test Requirements for TASK 1: 
#1 Input Validation: verify that the amount field shows the error message "please enter a valid amount"
# When non numeric characters are entered
#2 Country Selection: verify that the send to dropdown allows selecting a country.
#3 Dynamic conversion: Verify the conversion happens instantly when correct amount is updated.
#NOTE 1: I LOCKED THE WEBNSITE TO SUBDOMAIN EN-CL TO AVOID UNEXPECTED REDIRECTS
#NOTE 2: Challenge is outdated, instead of dropdown it uses popupwindows
#NOTE 3: Challenge DOES NOT allow non numerical characters, but it accepts , and . without int input
Feature: UI Test Automation to RIA website using Selenium BDD Framework

  Background:
    Given I am on the homepage
    When the website core elements are displayed

  @currencyConversionTests
  Scenario Outline: Verify the functionality of the calculator on the homepage
    As a non registered user,
    I want to send 25,000 CLP to Haiti,
    so that I can validate the converted amount after calculation.

    When I enter the amount of <amount> CLP
    And I select the "<destination>" country of the receiver
    And I validate the selected currency is "<currency>"
    And I select the payment method "<payment_method>"
    And I select the delivery method "<delivery_method>"
    Then I validate the total amount to pay after fees is correct
    And I start the transfer process clicking on the button "Start your transfer"

    Examples:
      | amount | destination | currency | payment_method | delivery_method |
      |  25000 | Haiti       | HTG      | Direct bank    | Bank            |

  @dynamicConverterTests
  Scenario Outline: Verify that the conversion happens instantly when the send amount is updated.
    As a non registered user,
    I want to send 25,000 CLP to Haiti,
    so I can verify the conversion happens instantly when the send amount is updated.

    When I enter the amount of <amount> CLP
    And I select the "<destination>" country of the receiver
    And I validate the selected currency is "<currency>"
    And I edit the amount in They receive with <new_amount>
    Then I validate that new CLP amount is displayed in You send input field
    Then I validate the total amount to pay after fees is correct

    Examples:
      | amount | destination | currency | new_amount |
      |  25000 | Haiti       | HTG      |       7500 |

  @RegistrationNavigationTests
  Scenario Outline: Verify navigation to the registration page from homepage
    As a non registered user,
    I want to navigate to the registration page,
    so that I can register an account.

    When I enter the amount of <amount> CLP
    And I select the "<destination>" country of the receiver
    And I validate the selected currency is "<currency>"
    And I select the payment method "<payment_method>"
    And I select the delivery method "<delivery_method>"
    Then I validate the total amount to pay after fees is correct
    And I start the transfer process clicking on the button "Start your transfer"
    And I click on "Continue to website" button
    Then I validate that URL contains "secure.riamoneytransfer.com"
    Then I validate the elements on this login page are displayed
    And I click on "Register" hyperlink
    Then I validate I am on the registration page with URL "https://secure.riamoneytransfer.com/registration"
    Then I validate the new view display the Country Selection Page.

    Examples:
      | amount | destination | currency | payment_method | delivery_method |
      |  25000 | Haiti       | HTG      | Direct bank    | Bank            |

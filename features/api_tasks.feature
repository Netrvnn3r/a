Feature: API Testing Tasks

  @api @task1
  Scenario: Task 1 - GET Request and Content Validation
    Given I send a GET request to "https://jsonplaceholder.typicode.com/posts/"
    Then the response status code should be 200
    And all objects in the response should have non-empty "title" and "body" fields
    And the response content should not contain the word "zombie"

  @api @task2
  Scenario: Task 2 - POST Request and Data Validation
    Given I send a POST request to "https://httpbin.org/post" with the following body:
      """
      {
        "student": "Tim Allen",
        "email_address": "tim@homeimprovement.com",
        "phone": "(408) 8674530",
        "current_grade": "B+",
        "topping": [
          "bacon",
          "cheese",
          "mushroom"
        ]
      }
      """
    Then the response status code should be 200 or 201
    And the response "topping" should include "bacon", "cheese", and "mushroom"
    And the response "topping" should not contain "chicken"

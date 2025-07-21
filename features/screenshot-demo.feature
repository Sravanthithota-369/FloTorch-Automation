@screenshot-demo @smoke
Feature: Screenshot Demo for Allure Reports
  As a tester
  I want to see screenshots in Allure reports
  So that I can visually verify test execution

 
  @positive @screenshots  
  Scenario: Login flow with step-by-step screenshots
    Given I am on the Flotorch QA Console login page
    When I enter valid email address
    And I enter valid password
    And I click the login button
    Then I should be successfully logged in

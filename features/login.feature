@login @smoke
Feature: Flotorch QA Console Login
  As a user of the Flotorch QA Console
  I want to be able to login to the system
  So that I can access the dashboard and use the application

  Background:
    Given I am on the Flotorch QA Console login page

  @positive @valid-login
  Scenario: Successful login with valid credentials
    When I enter valid email address
    And I enter valid password
    And I click the login button
    Then I should be successfully logged in
    And I should see the dashboard page
    And I should be redirected away from the login page

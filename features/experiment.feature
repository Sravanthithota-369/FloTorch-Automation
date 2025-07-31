Feature: Experiments Management
  As a user of the FloTorch platform
  I want to create and run the Experiments

  Background:
    Given I am logged in to FloTorch
    And I am on the dashboard page

    @experiment @end-to-end
    Scenario: Experiment Menu
        When I navigate to the workspaces section
        When I click on "AutomationWorkspace" workspace
  Then I should see the "AutomationWorkspace" Dashboard
When I click on Experiments menu
And I click on Projects button
Then I should see Projects page

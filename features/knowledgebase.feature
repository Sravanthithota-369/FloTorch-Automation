Feature: Knowledge Base Management
  As a user of the FloTorch platform
  I want to create and manage knowledge bases
  So that I can store and retrieve information efficiently

  Background:
    Given I am logged in to FloTorch
    And I am on the dashboard page

    @knowledge-base @end-to-end
    Scenario: End-to-end Knowledge Base workflow
        When I navigate to the workspaces section
        When I click on "AutomationWorkspace" workspace
  Then I should see the "AutomationWorkspace" Dashboard
  Then I click on Knowledge Bases menu
  Then I should see Repository submenu
  And I should see Knowledge base Providers submenu 
  When I click on knowledge base providers submenu
  Then I should be on the knowledge base providers page
  When I click on "Add Vector Storage Provider" button
  Then I should see Add Vector Storage Provider modal
   And I fill knowledge base provider details:
  | field       | value                                    |
  | name        | aws-east-region                         |
    | description | AWS East Region Vector Storage Provider |
    | provider    | Amazon Bedrock                          |
    | region      | us-east-1                               |
    | accessKey   | AKIAZ3MGM2KHPSGSKJ7E                    |
    | secretKey   | SEM5gFCOT+rz6BuxMna85baYlIXLO7hWwAlKBqY |
    And I click on Create button
    Then I should see a green success toast notification
    #And the toast should contain "provider created successfully" message
    When I click on Repositories submenu
    Then I should be on the repositories page
    When I click on "Add KB" button
    Then I should see Add Knowledge Base modal
    And I fill knowledge base details:
      | field       | value                                    |
      | name        | aws-east-kb                              |
      | description | AWS East Region Knowledge Base           |
      | provider    | Amazon Bedrock                           |
      | database name | knowledge-base-Amazonbedrock           |
    And I click on Create button
    Then I should see a green success toast notification
    And the toast should contain "Vector storage created successfully" message

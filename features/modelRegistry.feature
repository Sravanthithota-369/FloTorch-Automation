Feature: Model Registry Management
  As a user of the FloTorch platform
  I want to manage models and providers in the Model Registry
  So that I can create and configure AI models and their providers

  Background:
    Given I am logged in to FloTorch
    And I am on the dashboard page

  @model-registry @comprehensive @smoke
  Scenario: Complete Model Registry workflow - Create Provider and Model
    When I click on "Model Registry" menu
    And I click on "Providers" submenu
    Then I should be on the providers page
    
    When I click on "Add LLM Provider" button
    And I fill provider details:
      | field       | value                                     |
      | name        | amazonbedrock-1                          |
      | description | Amazon Bedrock Provider-1                |
      | provider    | Amazon Bedrock                          |
      | region      | us-east-1                               |
      | accessKey   | AKIAZ3MGM2KHPSGSKJ7E                    |
      | secretKey   | SEM5gFCOT+rz6BuxMna85baYlIXLO7hWwAlKBqY |
    And I click "Create" button for provider
    Then I should see a green success toast notification
    And the toast should contain "provider created successfully" message
    
    # Model Creation
    When I click on "Models" submenu
    Then I should be on the models page
    
    When I click on "New Model" button
    And I fill model details:
      | name        | amazonbedrock       |
      | description | Amazon Bedrock AI Model |
    And I click "Create" button for model
    Then I should see a green success toast notification
    And the toast should contain "model created successfully" message
    
    # Model Configuration
    Then I should see another green success toast notification
    And the toast should contain "model created successfully and configure it" message
    
    When I click on "Add Model Configuration" button
    Then I should see the model configuration page
    
    # Final Verification
    And I verify the provider "amazonbedrock" exists in the provider list
    And I verify the model "amazonbedrock" exists in the model list

  @model-registry @navigation @smoke
  Scenario: Verify Models and Providers menu items in Model Registry
    When I click on "Model Registry" menu
    Then I should see Models submenu
    And I should see Providers submenu

  @model-registry @add-model-configuration @positive
  Scenario: Add Model Configuration for Amazon Bedrock Claude Model
    When I click on "Model Registry" menu
    And I click on "Models" submenu
    And I click on Add Model Configuration button
    And I select "amazonbedrock" from the Provider dropdown
    And I select "anthropic.claude-v2" from the Model Name dropdown
    And I click on Create button
    Then I should see a success notification
    And the model configuration should be added successfully
    When I click on Actions menu button in Model Registry
    And I click on "Publish Latest" option
    And I select "Published(1)" from the version dropdown
    And I click on Publish button in the dialog
    Then I should see a success notification for model publishing

    @model-registry @end-to-end
  Scenario: End-to-end Model Registry workflow
  When I navigate to the workspaces section
  #And I click on create workspace button
  #And I fill in the workspace name as "AutomationWorkspace-1"
  #And I fill in the workspace description as "This is a test workspace for automation"
  #Then I submit the workspace creation
  #And I should see a success notification
  #And the workspace "AutomationWorkspace-1" should be created successfully
  #When I click on "AutomationWorkspace" workspace
  #Then I should see the "AutomationWorkspace" Dashboard
  #When I click on "Model Registry" menu
  #Then I should see Models submenu
  #And I should see Providers submenu
  #When I click on "Providers" submenu
  #Then I should be on the providers page
    #When I click on "Add LLM Provider" button
    #And I fill provider details:
     # | field       | value                                     |
      #| name        | amazonbedrock-1                          |
      #| description | Amazon Bedrock Provider-1                |
      #| provider    | Amazon Bedrock                          |
      #| region      | us-east-1                               |
      #| accessKey   | AKIAZ3MGM2KHPSGSKJ7E                    |
      #| secretKey   | SEM5gFCOT+rz6BuxMna85baYlIXLO7hWwAlKBqY |
    #And I click "Create" button for provider
    #Then I should see a green success toast notification
    #And the toast should contain "provider created successfully" message
    When I click on "AutomationWorkspace" workspace
    Then I should see the "AutomationWorkspace" Dashboard
    When I click on "Model Registry" menu
    When I click on "Models" submenu
    Then I should be on the models page
    When I click on "New Model" button
    And I fill model details:
      | name        | amazonbedrock       |
      | description | Amazon Bedrock AI Model | 
        And I click on Create button
      Then I should see a green success toast notification
    And the toast should contain "model created successfully" message
    Then I should see another green success toast notification
    And the toast should contain "model created successfully and configure it" message
    When I click on "Add Model Configuration" button
    Then I should see the model configuration page
        And I select "amazonbedrock" from the Provider dropdown
    And I select "anthropic.claude-v2" from the Model Name dropdown
    And I click on Create button
    Then I should see a success notification
    And the model configuration should be added successfully
    When I click on Actions menu button in Model Registry
    And I click on "Publish Latest" option
    And I select "Published(1)" from the version dropdown
    And I click on Publish button in the dialog
    Then I should see a success notification for model publishing


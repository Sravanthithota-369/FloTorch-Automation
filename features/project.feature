Feature: Project Management and Create Experiments
  As a user of the FloTorch platform
  I want to create and run the Experiments
    So that I can create experiments efficiently
  Background:
    Given I am logged in to FloTorch
    And I am on the dashboard page

    @project-creation @regression
    Scenario: Project Management and Create Experiments
        When I navigate to the workspaces section
        When I click on "AutomationWorkspace" workspace
        Then I should see the "AutomationWorkspace" Dashboard
        When I click on Experiments menu
        And I click on Projects button
        #Then I should see Projects page
        When I click on Create Project button
        Then I should see Create Project modal
        When I fill in the Project Name with "testautomationproject-01"
        And I click on Knowledge Base dropdown 
        And I select "aws-east-kb" from Knowledge Base dropdown
        And I upload "custom_qa.json" for Ground Truth File
        And I select "3" from N Shot Prompts
        And I upload "AmazonBedrockPrompt_new.json" for Shot Prompt File
        #And I fill in the System Prompt with "You are a helpful assistant"
        #And I fill in the User Prompt with "Answer the following question"
        And I select "amazonbedrock" from Retrieval Models
        And I set KNN Number to "5"
        And I set Evaluation Service to "Ragas"
        And I select an Evaluation Model as "amazonbedrock"
        And I select an Evaluation Embedding Model Provider as "Amazon Bedrock"
        And I set Evaluation Embedding Model to "text-embedding-3-small"
        And I take a screenshot of the Create Project modal
        When I click on Create Project submit button
        Then the project should be created successfully


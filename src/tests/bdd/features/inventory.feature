Feature: Inventory Management
  As a user
  I want to generate inventory reports
  So that I can track stock value

  Scenario: Generate inventory for a supply
    Given I am on the inventory page
    When I select a supply and enter date range
    And I click generate inventory
    Then inventory records should be created
    And I should see them in the inventory list

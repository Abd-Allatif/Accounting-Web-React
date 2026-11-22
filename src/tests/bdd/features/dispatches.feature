Feature: Dispatch Supplies
  As a user
  I want to dispatch supplies
  So that I can track inventory usage

  Scenario: Dispatch supplies with sufficient funds
    Given I am on the dispatch supplies page
    And I have sufficient permanent fund
    When I select a supply and enter quantity and buy price
    And I click dispatch
    Then the dispatch should be recorded
    And the permanent fund should be reduced by the total cost

  Scenario: Dispatch supplies with insufficient funds
    Given I am on the dispatch supplies page
    And I have insufficient permanent fund
    When I try to dispatch supplies
    Then I should see an error about insufficient funds
    And the dispatch should not be recorded

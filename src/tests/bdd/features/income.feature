Feature: Income Management
  As a user
  I want to record income
  So that I can track my revenue

  Scenario: Add a new income record
    Given I am on the income page
    When I fill in money from, total, and date
    And I click add income
    Then the income should appear in the list
    And the sells fund should be increased by the total

Feature: Payment Management
  As a user
  I want to add, edit, and delete payments
  So that I can track my expenses

  Scenario: Add a new payment
    Given I am on the payments page
    When I fill in money for, total, and date
    And I click add payment
    Then the payment should appear in the list
    And the permanent fund should be reduced by the total

  Scenario: Edit an existing payment
    Given I have a payment in the list
    When I click edit on that payment
    And I change the total amount
    And I click save
    Then the payment should reflect the updated total
    And the permanent fund should be adjusted accordingly

  Scenario: Delete a payment
    Given I have a payment in the list
    When I click delete on that payment
    And I confirm the deletion
    Then the payment should be removed from the list
    And the permanent fund should be refunded

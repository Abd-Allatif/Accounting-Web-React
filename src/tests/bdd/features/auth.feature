Feature: User Authentication
  As a user
  I want to log in and register
  So that I can access the accounting system

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid username and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see my user data in localStorage

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter invalid username or password
    And I click the login button
    Then I should see an error message
    And I should not be redirected

  Scenario: Guest login
    Given I am on the login page
    When I choose to continue as guest
    Then I should be in guest mode
    And I should be redirected to the dashboard

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

Feature: Data Export/Import
  As a user
  I want to export and import data
  So that I can backup or transfer my data

  Scenario: Export data to Excel
    Given I am on the options page
    When I click download Excel
    Then an Excel file should be downloaded

  Scenario: Upload Excel data
    Given I am on the options page
    When I select an Excel file and upload
    Then the data should be imported into the system

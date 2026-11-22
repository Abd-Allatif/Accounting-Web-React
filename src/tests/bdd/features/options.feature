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

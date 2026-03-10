# Frontend Tests

This folder contains unit and end-to-end tests related to frontend components, UI behavior, and user workflows.

## User Registration Tests

These tests include email validation, password validation, error handling, and end-to-end registraion completion.

**User Registration Gerkin**

Feature: User Registration

- Scenario: Successful registration with valid details
  - Given the user is on the registration page
  - When the user enters a valid email and password
  - And the user clicks the register button
  - Then the user should be redirected to the welcome page
  - And the user should see a registration confirmation message
- Scenario: Unsuccessful registration with invalid email
  - Given the user is on the registration page
  - When the user enters a valid upassword, but an invalid email address
  - And the user clicks the register button
  - Then the user should see an error message indicating an invalid email
- Scenario: Unsuccessful registration with invalid password
  - Given the user is on the registration page
  - When the user enters a valid email address, but an invalid password
  - And the user clicks the register button
  - Then the user should see an error message indicating an invalid password
- Scenario: Unsuccessful registration with missing fields
  - Given the user is on the registration page
  - When the user leaves the passowrd or email fields blank
  - And the user clicks the register button
  - Then the user should see a validation error message indicating required fields

**User Registration Test Cases**
 
- **Client-Side Password Verification Unit Tests**
  - Is password NOT blank?
  - Is password at least 8 characters?
  - Is password less than 30 characters?
  - Does password contain at least one uppercase letter?
  - Does password contain at least one lowercase letter?
  - Does password contain at least one number?
  - Does passowrd contain at least one special character?
  - Does password NOT contain any forbidden charaters? (tab, space, etc.)
  - Does the UI show the correct error message when a password is invalid?
  - Is the signUp function called when the password is valid?
  - Is the signUp function NOT called when the password is invalid?
- **Password Verification Integration Test**

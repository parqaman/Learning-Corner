import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { authContext, initialAuthContext } from '../providers/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { RegisterPage } from './RegisterPage';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

// Create a mock login function
const registerMock = jest.fn();

// Create a test user
const testUser = {
    firstName: "User",
    lastName: "Test",
    email: 'test@example.com',
    password: 'password123',
    photo: 'profile_empty.png'
};

test('register form submits successfully', async () => {
  // Render the login form
  const { getByTestId } = render(
    <BrowserRouter>
    <authContext.Provider
      value={{ ...initialAuthContext, actions: { ...initialAuthContext.actions, register: registerMock } }}
    >
      <RegisterPage />
    </authContext.Provider>
    ,
    </BrowserRouter>
  );

  act(() => {
    const firstNameInput = getByTestId('firstName');
    fireEvent.change(firstNameInput, { target: { value: testUser.firstName } });

    const lastNameInput = getByTestId('lastName');
    fireEvent.change(lastNameInput, { target: { value: testUser.lastName } });

    const emailInput = getByTestId('email');
    fireEvent.change(emailInput, { target: { value: testUser.email } });

    const passwordInput = getByTestId('password');
    fireEvent.change(passwordInput, { target: { value: testUser.password } });

    // Simulate clicking the submit button
    const submitButton = getByTestId("register-btn");
    fireEvent.click(submitButton);
  })

  // Wait for the register function to complete
  await waitFor(() => {
    expect(registerMock).toHaveBeenCalledWith(testUser);
  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { authContext, initialAuthContext } from '../providers/AuthProvider';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

// Create a mock login function
const loginMock = jest.fn();

// Create a test user
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

test('login form submits successfully', async () => {
  // Render the login form
  const { getByTestId, getByText } = render(
    <BrowserRouter>
    <authContext.Provider
      value={{ ...initialAuthContext, actions: { ...initialAuthContext.actions, login: loginMock } }}
    >
      <LoginPage />
    </authContext.Provider>
    ,
    </BrowserRouter>
  );

  act(() => {
    // Simulate typing in the email and password fields
    const emailInput = getByTestId('email');
    fireEvent.change(emailInput, { target: { value: testUser.email } });
    const passwordInput = getByTestId('password');
    fireEvent.change(passwordInput, { target: { value: testUser.password } });

    // Simulate clicking the submit button
    const submitButton = getByText(/Login/i);
    fireEvent.click(submitButton);

  })

  // Wait for the login function to complete
  await waitFor(() => {
    expect(loginMock).toHaveBeenCalledWith(testUser);
  });
});

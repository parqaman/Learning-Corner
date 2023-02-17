import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { authContext, AuthProvider, initialAuthContext } from '../providers/AuthProvider';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import { HomePage } from './HomePage';

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

test('login form submits successfully', async () => {
  // Render the login form
  const { getByTestId, getByText, debug } = render(
    <BrowserRouter>
    <AuthProvider>
      <HomePage />
    </AuthProvider>
    ,
    </BrowserRouter>
  );
  debug();
});
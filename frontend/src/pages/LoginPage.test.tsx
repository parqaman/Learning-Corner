import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '../utils/tests';
import { authContext, initialAuthContext } from '../providers/AuthProvider';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

const loginMock = jest.fn();

//start of describe
describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockClear();
  });

  it('is able to login', async () => {
    
    const { getByLabelText, getByText, debug } = render(
        <BrowserRouter>
        <authContext.Provider
          value={{ ...initialAuthContext, actions: { ...initialAuthContext.actions, login: loginMock } }}
        >
          <LoginPage />
        </authContext.Provider>
        ,
        </BrowserRouter>
    );
    debug();
    const user = userEvent.setup();

    const testUser = {
        email: 'test',
        password: '123456',
    };

    user.type(screen.getByTestId('email'),  testUser.email)

    user.type(screen.getByTestId('password'),  testUser.password)

    user.click(screen.getByText(/Login/i))
    // const submitButton = getByText(/Login/i);

    await waitFor(() =>
        expect(loginMock).toHaveBeenCalledWith(testUser),
    )
  });
});

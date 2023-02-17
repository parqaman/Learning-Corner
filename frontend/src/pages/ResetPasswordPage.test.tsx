import { render, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../providers/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { ResetPasswordPage } from './ResetPasswordPage';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn();

// Create a mock create function
const resetPasswordMock = jest.fn();

// Create a test password
const testPassword = {
  current: 'New Course',
  new: 'Description',
};

test('successfully reset the password', async () => {
  // Render the page
  const { getByTestId } = render(
    <BrowserRouter>
      <AuthProvider>
        <ResetPasswordPage />
      </AuthProvider>
    </BrowserRouter>,
  );

  const form = getByTestId('form');
  form.onsubmit = resetPasswordMock;

  const currentPasswordInput = getByTestId('current');
  fireEvent.change(currentPasswordInput, { target: { value: testPassword.current } });

  const newPasswordInput = getByTestId('new');
  fireEvent.change(newPasswordInput, { target: { value: testPassword.new } });

  // Simulate clicking the button
  const resetButton = getByTestId('reset-btn');
  fireEvent.click(resetButton);

  expect(currentPasswordInput).toHaveValue(testPassword.current);
  expect(newPasswordInput).toHaveValue(testPassword.new);
  expect(resetPasswordMock).toHaveBeenCalledTimes(1);
});

import React from 'react';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import { authContext, AuthProvider, initialAuthContext } from '../providers/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { ProfilePage } from './ProfilePage';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

test('check that you can not upload an image when not clicking on edit ', async () => {
    // Render the login form
    const { getByText } = render(
      <BrowserRouter>
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
      ,
      </BrowserRouter>
    );
  
    expect(() => getByText("Upload image")).toThrow();
  });

test('check that you can upload an image when clicking on edit ', async () => {
  // Render the login form
  const { getByTestId } = render(
    <BrowserRouter>
    <AuthProvider>
      <ProfilePage />
    </AuthProvider>
    ,
    </BrowserRouter>
  );

  act(() => {
    // Simulate clicking the edit button
    const submitButton = getByTestId("editButton");
    fireEvent.click(submitButton);
  })

  await waitFor(() => {
    const { getByText } = within(screen.getByTestId('profilePage'))
    expect(getByText("Upload image")).toBeTruthy();
  });
});

test('If you edit your profile and save, the new profile is shown', async () => {
    // Test User
    const testUser = {
        firstName: "Max",
        lastName: "Mustermann",
        email: 'test@test.com'
    };

    // Render the profile page
    const { getByTestId, debug } = render(
      <BrowserRouter>
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
      ,
      </BrowserRouter>
    );
    debug();

    // Enter profile information on the inputs
    

  });
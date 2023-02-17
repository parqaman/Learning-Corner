import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { authContext, AuthProvider, initialAuthContext } from '../providers/AuthProvider';
import { LoginPage } from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import { HomePage } from './HomePage';
import { CourseDetailPage } from './CourseDetailPage';
import { MyCoursesPage } from './MyCoursesPage';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

const testUser = {
    id: "1",
    firstName: "Mockup",
    lastName: "User",
    email: 'test@example.com',
    password: 'password123',
    photo: 'profile_empty.png'
};

test('my courses page contains courses the user joined successfully', async () => {
  // Render the login form
  const { getByTestId, debug } = render(
    <BrowserRouter>
        <authContext.Provider value={{  ...initialAuthContext, user: {...testUser}}}>
            <MyCoursesPage />
        </authContext.Provider>
    ,
    </BrowserRouter>
  );
  debug();

  act(() => {
    const courseList = getByTestId('course-inner-list');
    expect(courseList.textContent).toBe('No courses found') //since user does not joined or have any single course
})
});
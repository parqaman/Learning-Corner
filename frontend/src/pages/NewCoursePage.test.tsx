import { render, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { AuthProvider } from '../providers/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { NewCoursePage } from './NewCoursePage';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn();

// Create a mock create function
const createCourseMock = jest.fn();

// Create a test course
const testCourse = {
  name: 'New Course',
  description: 'Description',
};

test('successfully create a new course', async () => {
  // Render the page
  const { getByTestId } = render(
    <BrowserRouter>
      <AuthProvider>
        <NewCoursePage />
      </AuthProvider>
    </BrowserRouter>,
  );

  const form = getByTestId('form');
  form.onsubmit = createCourseMock;

  const nameInput = getByTestId('name');
  fireEvent.change(nameInput, { target: { value: testCourse.name } });

  const descriptionInput = getByTestId('description');
  fireEvent.change(descriptionInput, { target: { value: testCourse.description } });

  // Simulate clicking the button
  const createButton = getByTestId('create-btn');
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(nameInput).toHaveValue(testCourse.name);
    expect(descriptionInput).toHaveValue(testCourse.description);
    expect(createCourseMock).toHaveBeenCalledTimes(1);
  });
});

test('cannot create a new course if the input is empty', async () => {
  const history = createMemoryHistory({ initialEntries: ['/courses/newcourse'] });

  // Render the page
  const { getByTestId, getByText } = render(
    <BrowserRouter>
      <AuthProvider>
        <NewCoursePage />
      </AuthProvider>
    </BrowserRouter>,
  );

  const form = getByTestId('form');
  form.onsubmit = createCourseMock;

  const nameInput = getByTestId('name');

  const descriptionInput = getByTestId('description');

  // Simulate clicking the button
  const createButton = getByTestId('create-btn');
  fireEvent.click(createButton);

  await waitFor(() => {
    expect(nameInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
    expect(history.location.pathname).toBe('/courses/newcourse');
  });
});

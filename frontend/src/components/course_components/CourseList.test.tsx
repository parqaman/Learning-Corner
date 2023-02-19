import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Course } from '../../adapter/api/__generated/api';
import { CourseList } from './CourseList';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

test('given a course, shows the course name and lecturer firstname and lastname', async () => {

  

  const courses: Course[] = [{
    id: '1',
    name: 'Kurstest 1',
    description: 'Beschreibung von Kurstest 1',
    lecturer: {
        id: '1',
        email: 'test@test.de',
        photo: 'profile_empty.png',
        firstName: 'Max', 
        lastName:'Mustermann'
    },
  }]
  
  const { } = render(
    <CourseList courses={courses!} />
  );

  const lecturerFullName = courses[0].lecturer.firstName + " " + courses[0].lecturer.lastName;

  const { getByText } = within(screen.getByTestId('courseListTest'))
  expect(getByText(courses[0].name)).toBeInTheDocument();
  expect(getByText(lecturerFullName)).toBeInTheDocument();

});
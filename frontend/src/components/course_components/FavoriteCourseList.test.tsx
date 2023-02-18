import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Course } from '../../adapter/api/__generated/api';
import { FavoriteCourseList } from './FavoriteCourseList';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

test('given one course, shows the course name and lecturer firstname and lastname', async () => {

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
  
  const {  } = render(
    <FavoriteCourseList courses={courses!} />
  );

  const lecturerFullName = courses[0].lecturer.firstName + " " + courses[0].lecturer.lastName;

  const { getByText } = within(screen.getByTestId('favoriteCourseListTest'))
  expect(getByText(courses[0].name)).toBeInTheDocument();
  expect(getByText(lecturerFullName)).toBeInTheDocument();

});

test('given three course, shows the three course name and lecturer firstname and lastname', async () => {

    const courses: Course[] = [
      {
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
      }, 
      {
        id: '2',
        name: 'Kurstest 2',
        description: 'Beschreibung von Kurstest 2',
        lecturer: {
            id: '1',
            email: 'test@test.de',
            photo: 'profile_empty.png',
            firstName: 'Max', 
            lastName:'Mustermann'
        },
      }, 
      {
        id: '3',
        name: 'Kurstest 3',
        description: 'Beschreibung von Kurstest 3',
        lecturer: {
            id: '2',
            email: 'test2@test.de',
            photo: 'profile_empty.png',
            firstName: 'Maximus', 
            lastName:'Mustermannimus'
        },
      },
    ]
    
    const {  } = render(
      <FavoriteCourseList courses={courses!} />
    );
  
    const { getAllByText } = within(screen.getByTestId('favoriteCourseListTest'))

    for(let i = 0; i < courses.length; i++){
        const lecturerFullName = courses[i].lecturer.firstName + " " + courses[i].lecturer.lastName;
        expect(getAllByText(courses[i].name)).toBeTruthy();
        expect(getAllByText(lecturerFullName)).toBeTruthy();
    }
});


test('given four course, shows only first three course name and lecturer firstname and lastname', async () => {

    const courses: Course[] = [
      {
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
      }, 
      {
        id: '2',
        name: 'Kurstest 2',
        description: 'Beschreibung von Kurstest 2',
        lecturer: {
            id: '1',
            email: 'test@test.de',
            photo: 'profile_empty.png',
            firstName: 'Max', 
            lastName:'Mustermann'
        },
      }, 
      {
        id: '3',
        name: 'Kurstest 3',
        description: 'Beschreibung von Kurstest 3',
        lecturer: {
            id: '2',
            email: 'test2@test.de',
            photo: 'profile_empty.png',
            firstName: 'Maximus', 
            lastName:'Mustermannimus'
        },
      },
      {
        id: '4',
        name: 'Ppp',
        description: 'Beschreibung von Kurstest 4',
        lecturer: {
            id: '3',
            email: 'test3@test.de',
            photo: 'profile_empty.png',
            firstName: 'Maximustus', 
            lastName:'Mustermannimustus'
        },
      },
    ]
    
    const {  } = render(
      <FavoriteCourseList courses={courses!} />
    );
  
    const { getAllByText } = within(screen.getByTestId('favoriteCourseListTest'))

    for(let i = 0; i < courses.length; i++){
        // Check if first 3 are in the list
        if(i < 3){
            const lecturerFullName = courses[i].lecturer.firstName + " " + courses[i].lecturer.lastName;
            expect(getAllByText(courses[i].name)).toBeTruthy();
            expect(getAllByText(lecturerFullName)).toBeTruthy();
        }else{
            // all other should throw an error
            const lecturerFullName = courses[i].lecturer.firstName + " " + courses[i].lecturer.lastName;
            expect(() => getAllByText(courses[i].name)).toThrow();
            expect(() => getAllByText(lecturerFullName)).toThrow();
        }
    }
});
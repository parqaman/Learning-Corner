import { render, waitFor } from '@testing-library/react';
import { AuthProvider } from '../providers/AuthProvider';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CourseDetailPage } from './CourseDetailPage';
import fetchMock from "jest-fetch-mock";

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn()

fetchMock.enableMocks();

test('course detail page has a join course button', async () => {    
    const mockResponse = {
        id: '100',
        name: 'Programmieren Algorithmen und Datenstruktur',
        description: 'Description 6',
        lecturer: {
            id: "1",
            firstName: "Mockup",
            lastName: "User",
        },
    };
    //fetch mock
    fetchMock.mockResponse(JSON.stringify(mockResponse));    

    const { getByTestId } = render(
        <MemoryRouter initialEntries={["/courses/100"]}>
            <AuthProvider>
                <Routes>
                    <Route path="/courses/:id" element={<CourseDetailPage/>}/>
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );

    await waitFor(() => {
        const element = getByTestId("course-detail");
        expect(element.textContent).toContain("Join course");
    });
});
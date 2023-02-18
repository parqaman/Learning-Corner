import { render, fireEvent, screen } from '@testing-library/react';
import { AuthProvider } from '../providers/AuthProvider';
import { MemoryRouter, Route, RouteProps, Routes } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { SearchPage } from './SearchPage';

// useNavigate mock
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

// scrollTo mock
global.scrollTo = jest.fn();

const testSearchInput = 'testName';

test('successfully show the search result', async () => {
  const path = `/searchresult/${testSearchInput}`;
  const { getByTestId, getByText } = render(
    <MemoryRouter initialEntries={[`/searchresult/${testSearchInput}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/searchresult/:name" element={<SearchPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );

  expect(screen.getByTestId('searchInput')).toHaveTextContent(testSearchInput);
  expect(screen.getByTestId('courseListTest')).toBeInTheDocument();
});

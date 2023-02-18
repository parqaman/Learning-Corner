import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { Course } from '../../adapter/api/__generated/api';
import { SingleCourse } from './SingleCourse';

export const FavoriteCourseList = ({ courses }: { courses: Course[] | undefined }) => {
  const MAX_NUM_OF_SHOWN_COURSES = 3;
  const [shownCourses, setShownCourses] = useState<Course[]>();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (courses && courses.length > 0) {
      const slicedArray = courses.slice(offset, MAX_NUM_OF_SHOWN_COURSES + offset);
      setShownCourses(slicedArray);
    }
  }, [courses]);

  const handleNextPage = () => {
    if (courses && courses.length > 0) {
      if (offset + MAX_NUM_OF_SHOWN_COURSES < courses.length) {
        // already at the bottom of the list
        const localOffset = offset + 3;
        setOffset((oldVal) => oldVal + 3);
        const slicedArray = courses.slice(localOffset, MAX_NUM_OF_SHOWN_COURSES + localOffset);
        setShownCourses(slicedArray);
      }
    }
  };

  const handlePreviousPage = () => {
    if (courses && courses.length > 0) {
      if (offset !== 0) {
        // already on the top of the list
        const localOffset = offset - 3;
        setOffset((oldVal) => oldVal - 3);
        const slicedArray = courses.slice(localOffset, MAX_NUM_OF_SHOWN_COURSES - localOffset);
        setShownCourses(slicedArray);
      }
    }
  };

  return (
    <Box w={'47rem'} flexDir={'column'} alignItems={'center'} mt="0.25rem" mb={'1.5rem'} data-testid="favoriteCourseListTest">
      {shownCourses && shownCourses.length > 0 ? (
        <Flex width={'100%'} overflowX={'hidden'} gap="1rem">
          {shownCourses
            .sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1))
            .map((course) => (
              <SingleCourse key={course.id} course={course} />
            ))}
        </Flex>
      ) : (
        <Text>No favorite courses found</Text>
      )}
      <Flex gap="0.5rem" justifyContent="flex-end" pt={'0.5rem'}>
        <Text
          onClick={handlePreviousPage}
          cursor={'pointer'}
          bg={'rgba(0, 0, 0, 0.75)'}
          borderRadius="full"
          color="white"
          p="0.25rem"
        >
          <AiOutlineLeft />
        </Text>
        <Text
          onClick={handleNextPage}
          cursor={'pointer'}
          bg={'rgba(0, 0, 0, 0.75)'}
          borderRadius="full"
          color="white"
          p="0.25rem"
        >
          <AiOutlineRight />
        </Text>
      </Flex>
    </Box>
  );
};

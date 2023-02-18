import { SlideFade, Heading, Flex, Box } from '@chakra-ui/react';
import { CourseList } from '../components/course_components/CourseList';
import { AppLayout } from '../layout/AppLayout';
import { Course } from '../adapter/api/__generated/api';
import { useEffect, useState } from 'react';
import { useApiClient } from '../adapter/api/useApiClient';
import { useParams } from 'react-router-dom';

export const SearchPage = () => {
  const { name } = useParams();
  const apiClient = useApiClient();
  const [foundCourses, setFoundCourses] = useState<Course[]>();

  const fetchUser = async () => {
    if (name) {
      const res = await apiClient.getCourses(name);

      setFoundCourses(res.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppLayout display={'flex'} flexDir="column" alignItems="center" mt={'3rem'}>
      <SlideFade delay={0.2} in={true}>
        <Box display="flex" flexDirection={'column'}>
          <Flex mb={'1.5rem'} justifyContent={'flex-start'}>
            <Heading fontSize={'4xl'} fontWeight="semibold" display={'flex'}>
              Search result for&nbsp;
            </Heading>
            <Heading
              as={'u'}
              fontSize={'4xl'}
              fontWeight="normal"
              display={'flex'}
              flexDir={'column'}
              justifyContent={'flex-end'}
              data-testid="searchInput"
            >
              {name}
            </Heading>
          </Flex>
          <CourseList courses={foundCourses!} />
        </Box>
      </SlideFade>
    </AppLayout>
  );
};

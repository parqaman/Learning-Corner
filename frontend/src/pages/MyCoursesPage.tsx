import { SlideFade, Heading, Flex, Box, Button, Text, Switch } from '@chakra-ui/react';
import { CourseList } from '../components/course_components/CourseList';
import { AppLayout } from '../layout/AppLayout';
import { useAuth } from '../providers/AuthProvider';
import { Course, User } from '../adapter/api/__generated/api';
import { useEffect, useState } from 'react';
import { useApiClient } from '../adapter/api/useApiClient';
import { useNavigate } from 'react-router-dom';

const FilterButton = ({
  courses,
  setCourses,
  user,
}: {
  courses: Course[] | undefined;
  setCourses: React.Dispatch<React.SetStateAction<Course[] | undefined>>;
  user: User | null;
}) => {
  const handleFilterCourse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (courses && user && isChecked) {
      const filteredCourses = courses.filter((iterateCourse) => iterateCourse.lecturer.id === user.id);
      setCourses(filteredCourses);
    } else if (courses && user && !isChecked) {
      setCourses(user.joinedCourses);
    }
  };

  return (
    <Flex alignItems={'center'} gap="0.5rem" mb={'0.5rem'}>
      <Text>Only created by me</Text>
      <Switch
        id="switch"
        onChange={(e) => {
          handleFilterCourse(e);
        }}
      />
    </Flex>
  );
};

const NewCourseTile = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDir={'column'} alignItems="center" justifyContent={'flex-end'}>
      <Button
        onClick={() => navigate('/courses/newcourse')}
        variant={'link'}
        color="rgba(0, 0, 0, 0.75)"
        _active={{}}
        size={'sm'}
      >
        Create your own course?
      </Button>
    </Box>
  );
};

export const MyCoursesPage = () => {
  const [user, setUser] = useState<User | null>(useAuth().user);
  const apiClient = useApiClient();
  const [courses, setCourses] = useState<Course[]>();

  const fetchUser = async () => {
    if (user) {
      const fetchedUser = await apiClient
        .getUsersId(user.id)
        .then((data) => {
          setUser(data.data);
          setCourses(data.data.joinedCourses);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppLayout display={'flex'} flexDir="column" alignItems="center" mt={'3rem'}>
      <SlideFade delay={0.2} in={true}>
        <Box display="flex" flexDirection={'column'}>
          <Flex mb={'1.5rem'} justifyContent={'space-between'}>
            <Heading fontSize={'5xl'} fontWeight="semibold">
              My Courses
            </Heading>
            <NewCourseTile />
          </Flex>
          <Box>
            <FilterButton courses={courses} setCourses={setCourses} user={user} />
          </Box>
          <CourseList courses={courses} />
        </Box>
      </SlideFade>
    </AppLayout>
  );
};

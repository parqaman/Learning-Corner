import { SlideFade, Heading, Flex, Box, Text } from '@chakra-ui/react'
import { CourseList } from '../components/course_components/CourseList'
import { SingleCourse } from '../components/course_components/SingleCourse'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { AiOutlinePlus } from 'react-icons/ai'
import { Course, SearchBar } from './HomePage'


const NewCourseTile = () => {
    return (
        <Text fontSize={'large'} display='flex' flexDir={'column'} alignItems='center' justifyContent={'flex-end'} mb='0.5rem'>
            Create a new course?
        </Text>
    )
}

export const MyCoursesPage = () => {
    const user = useAuth().user;
    const mockCourses: Course[] = [
        {
          id: 1,
          courseName: "Advanced Web Development",
          courseAuthor: "Author 1"
        },
        {
          id: 2,
          courseName: "Graphische Datenverarbeitung",
          courseAuthor: "Author 2"
        },
        {
          id: 3,
          courseName: "Datenbanken 2",
          courseAuthor: "Author 3"
        },
        {
          id: 4,
          courseName: "Data Warehouse Techonologien",
          courseAuthor: "Author 4"
        },
        {
          id: 5,
          courseName: "Unix for Developers",
          courseAuthor: "Author 5"
        },
        {
          id: 6,
          courseName: "Programmieren Algorithmen und Datenstruktur",
          courseAuthor: "This is the author 6"
        },
      ]

  return (
    <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
      <SlideFade delay={0.2} in={true}>
        <Box display='flex' flexDirection={'column'}>
            <Flex mb={'1.5rem'}>
                <Heading flex={1} fontSize={'5xl'} fontWeight='semibold'>
                    My Courses
                </Heading>
                <NewCourseTile/>
            </Flex>
            <CourseList courses={mockCourses}/>
        </Box>
      </SlideFade>
    </AppLayout>
  )
}

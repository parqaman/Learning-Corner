import { Box, Flex, Heading, Input, SlideFade, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { AiOutlineSearch } from 'react-icons/ai'
import { CourseList } from '../components/course_components/CourseList'

interface SeacrhBarProps {
  searchVal: string;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>
}

export const SearchBar = ({searchVal, setSearchVal}: SeacrhBarProps) => {
  return (
    <Box 
      bg={'white'}
      padding={'0.5rem 1.15rem'}
      boxShadow={'0 0.25rem 0.25rem rgba(0, 0, 0, 0.25)'}
      borderRadius='1rem'
      display={'flex'}
      gap='0.15rem'
      minW={'13rem'}
      mt='3em'
    >
      <Input value={searchVal} onChange={(e)=>setSearchVal(e.target.value)} placeholder='Search for a course' _placeholder={{color: '#8E8E8E', fontSize: 'sm'}} variant='unstyled'/>
      <Box display={'flex'} flexDir='column' alignItems={'center'} justifyContent='center' fontSize={'larger'}>
        <AiOutlineSearch/>
      </Box>
    </Box>
  )
}

export interface Course {
  id: number;
  courseName: string;
  courseAuthor: string;
}

export const HomePage = () => {
  const user = useAuth().user;
  const [searchVal, setSearchVal] = useState("");
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
        <Box display='flex' flexDirection={'column'} alignItems={'center'}>
          <Heading fontSize={'5xl'} fontWeight='semibold'>
            Hi there, {user?.firstName}!
          </Heading>
          <SearchBar searchVal={searchVal} setSearchVal={setSearchVal}/>
          <Box display={'flex'} flexDir='column' gap='0.25rem' mt={'4rem'}>
            <Heading fontSize={'xl'} fontWeight={'medium'} borderBottom={'solid 0.075rem'} borderBottomColor={'#0194F3'}>
              All courses
            </Heading>
            <CourseList courses={mockCourses}/>
            <Flex justifyContent={'center'}>
              <Text as={'u'} cursor={'pointer'}>Show more</Text>
            </Flex>
          </Box>
        </Box>
      </SlideFade>
    </AppLayout>
  )
}

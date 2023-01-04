import { Box, Flex, Heading, Input, SlideFade, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { AiOutlineSearch } from 'react-icons/ai'
import { CourseList } from '../components/course_components/CourseList'
import { useApiClient } from '../adapter/api/useApiClient'
import { Course } from '../adapter/api/__generated/api'
import { MockupCourses } from '../mockup/mockup_course'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  searchVal: string;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>
}

export const SearchBar = ({searchVal, setSearchVal}: SearchBarProps) => {
  const navigate = useNavigate()
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/searchresult/'+searchVal)
  }

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
      <form onSubmit={(e)=>handleSearch(e)}>
        <Input value={searchVal} onChange={(e)=>setSearchVal(e.target.value)} placeholder='Search for a course' _placeholder={{color: '#8E8E8E', fontSize: 'sm'}} variant='unstyled'/>
      </form>
      <Box display={'flex'} flexDir='column' alignItems={'center'} justifyContent='center' fontSize={'larger'}>
        <AiOutlineSearch/>
      </Box>
    </Box>
  )
}

export const HomePage = () => {
  const user = useAuth().user;
  const [searchVal, setSearchVal] = useState("");
  const [courses, setCourses] = useState<Course[]>();
  const apiClient = useApiClient();

  const fetchData = async () => {
    const res = await apiClient.getCourses();
    const data = res.data;
    if(data){
      setCourses(data)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

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
            <CourseList courses={courses!}/>
            <Flex justifyContent={'center'}>
              <MockupCourses/>
            </Flex>
          </Box>
        </Box>
      </SlideFade>
    </AppLayout>
  )
}

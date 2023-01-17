import { Box, Heading, Input, SlideFade } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { AiOutlineSearch } from 'react-icons/ai'
import { CourseList } from '../components/course_components/CourseList'
import { useApiClient } from '../adapter/api/useApiClient'
import { Course } from '../adapter/api/__generated/api'
import { useNavigate } from 'react-router-dom'
import { FavoriteCourseList } from '../components/course_components/FavoriteCourseList'

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
  const auth = useAuth();
  const user = auth.user;
  const [searchVal, setSearchVal] = useState("");
  const [courses, setCourses] = useState<Course[]>();
  const [favCourses, setFavCourses] = useState<Course[]>();
  const apiClient = useApiClient();

  const mockupFavs: Course[] = [
    {
      id: "1",
      name: "test 1",
      description: "test course",
      lecturer: user!
    },
    {
      id: "2",
      name: "test 2",
      description: "test course",
      lecturer: user!
    },
    {
      id: "3",
      name: "test 3",
      description: "test course",
      lecturer: user!
    },
    {
      id: "4",
      name: "test 4",
      description: "test course",
      lecturer: user!
    },
    {
      id: "5",
      name: "test 5",
      description: "test course",
      lecturer: user!
    },
  ]

  const fetchData = async () => {
    await apiClient.getCourses()
    .then(async (res) => {
      const theCourses = res.data;
      setCourses(theCourses);
      if(user) {
        await apiClient.getUserFavoriteCourses(user.id)
        .then((res2) => {
          const theFavCourses: Course[] = [];
          res2.data.map((learner_in_course) => {
            if(learner_in_course.course) {
              theFavCourses.push(learner_in_course.course)
            }
          })     
          setFavCourses(theFavCourses);
        })
      }
    })
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
              Favorite courses
            </Heading>
            <FavoriteCourseList courses={favCourses}/>
          </Box>
          <Box display={'flex'} flexDir='column' gap='0.25rem' mt={'3rem'}>
            <Heading fontSize={'xl'} fontWeight={'medium'} borderBottom={'solid 0.075rem'} borderBottomColor={'#0194F3'}>
              All courses
            </Heading>
            <CourseList courses={courses!}/>
          </Box>
        </Box>
      </SlideFade>
    </AppLayout>
  )
}

import { SlideFade, Heading, Flex, Box, Button } from '@chakra-ui/react'
import { CourseList } from '../components/course_components/CourseList'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { User } from '../adapter/api/__generated/api'
import { useEffect, useState } from 'react'
import { useApiClient } from '../adapter/api/useApiClient'
import { useNavigate } from 'react-router-dom'


const NewCourseTile = () => {
  const navigate = useNavigate()
    return (
      <Box display='flex' flexDir={'column'} alignItems='center' justifyContent={'flex-end'}>
        <Button onClick={()=>navigate('/courses/newcourse')} variant={'link'} color='rgba(0, 0, 0, 0.75)' _active={{}} size={'sm'}>
            Create your own course?
        </Button>
      </Box>
    )
}

export const MyCoursesPage = () => {
  const [user, setUser] = useState<User | null>(useAuth().user)
  const apiClient = useApiClient();

  const fetchUser = async () => {
    if(user){
      const fetchedUser = await apiClient.getUsersId(user.id)
      .then((data) => {
        setUser(data.data)
      })
      .catch((e)=>{
        console.log(e);
      })
    }
  }

  useEffect(()=>{
    fetchUser()
  }, [])

  return (
    <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
      <SlideFade delay={0.2} in={true}>
        <Box display='flex' flexDirection={'column'}>
            <Flex mb={'1.5rem'} justifyContent={'space-between'}>
                <Heading fontSize={'5xl'} fontWeight='semibold'>
                    My Courses
                </Heading>
                <NewCourseTile/>
            </Flex>
            <Flex flexDir={'column'}>
              <Heading fontSize={'2xl'} fontWeight='semibold'>
                  Created by you
              </Heading>
              <CourseList courses={user?.courses!}/>
            </Flex>
            <Flex flexDir={'column'}>
              <Heading fontSize={'2xl'} fontWeight='semibold'>
                  Joined by you
              </Heading>
              <CourseList courses={user?.joinedCourses!}/>
            </Flex>
        </Box>
      </SlideFade>
    </AppLayout>
  )
}

import { SlideFade, Heading, Flex, Box, Text } from '@chakra-ui/react'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { Course, Group, LearnerInCourse, LearnerInGroup, User } from '../adapter/api/__generated/api'
import { useEffect, useState } from 'react'
import { useApiClient } from '../adapter/api/useApiClient'
import { useNavigate } from 'react-router-dom'
import { GroupList } from '../components/group_components/GroupList'
import { SingleGroup } from '../components/group_components/SingleGroup'

export const MyGroupsPage = () => {
    const [groups, setGroups] = useState<LearnerInGroup[]>()
    const [user, setUser] = useState<User>(useAuth().user!)
    const [courses, setCourses] = useState<Course[]>()
    const apiClient = useApiClient();
    const [array, setArray] = useState<string[][]>()
  
    const fetchData = async () => {
        const res = await apiClient.getUsersId(user.id)
        const courseList = res.data.joinedCourses
        
        var arr: LearnerInGroup[] = []

        await apiClient.getUsersUseridGroups(user.id)
        .then((res) => {
          const tempGroupsInCourse = res.data
          tempGroupsInCourse.map((group) => {
            arr.push(group)
          })
          setGroups(arr);
        })
    }
  
    useEffect(()=>{
      fetchData();
    }, [])

    return (
      <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
        <SlideFade delay={0.2} in={true}>
          <Box display='flex' flexDirection={'column'}>
              <Flex mb={'1.5rem'} justifyContent={'space-between'}>
                  <Heading fontSize={'5xl'} fontWeight='semibold'>
                      My Groups
                  </Heading>
              </Flex>
              <Flex minW={'47rem'} flexDir={'column'} mt='0.25rem' mb={'1.5rem'} gap='1.25rem'>
                {
                    groups && groups.length > 0 ? ( groups
                    .sort((a, b) =>
                      a && a.group && a.group.course && a.group.course.name && a.group.course.name.toLocaleLowerCase()
                      >
                      b && b.group && b.group.course && b.group.course.name && b.group.course.name.toLocaleLowerCase()
                      ? 1 : -1
                    )
                    .map((val) => (
                      val.group && val.group.course &&
                            <SingleGroup
                                key={val.group.id}
                                course={val.group.course}
                                group={val.group}
                                myGroupPage={true}
                            />    
                        ))
                    ) : (
                        <Text>No groups found</Text>
                    )
                }
            </Flex>
          </Box>
        </SlideFade>
      </AppLayout>
    )
  }
  
import { SlideFade, Heading, Flex, Box, Text, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from '@chakra-ui/react'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { Course, LearnerInGroup, User } from '../adapter/api/__generated/api'
import { useEffect, useState } from 'react'
import { useApiClient } from '../adapter/api/useApiClient'
import { useNavigate } from 'react-router-dom'
import { GroupList } from '../components/group_components/GroupList'
import { SingleGroup } from '../components/group_components/SingleGroup'

interface FilterGroupProps {
  courses: Course[] | undefined;
  groups: LearnerInGroup[] | undefined;
  originalGroups: LearnerInGroup[] | undefined;
  setGroups: React.Dispatch<React.SetStateAction<LearnerInGroup[] | undefined>>
}

const FilterGroupButton = ({courses, groups, originalGroups, setGroups}: FilterGroupProps) => {

  const handleGroupFilter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const filterValue = e.currentTarget.value;

    if(filterValue === 'no-filter'){
      setGroups(originalGroups)
    } else {
      if(originalGroups) {
        const localCopyOfGroups = originalGroups;
        const filteredGroups = localCopyOfGroups.filter((group) => group.group?.course?.id === filterValue)
        setGroups(filteredGroups)
      }
    }
  }

  return(
    <Box display='flex' flexDir={'column'} alignItems='center' justifyContent={'flex-end'}>
      <Menu closeOnSelect={true}>
      <MenuButton _hover={{textDecoration:'underline'}}>
        Filter by course
      </MenuButton>
      <MenuList >
        <MenuOptionGroup defaultValue='no-filter' type='radio'>
          <MenuItemOption value='no-filter' onClick={(e)=>handleGroupFilter(e)} >No filter</MenuItemOption>
          {
            courses &&
              courses.map((course)=>(
                <MenuItemOption key={course.id} value={course.id} onClick={(e)=>handleGroupFilter(e)}>{course.name}</MenuItemOption>
              ))
          }
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  </Box>
  )
}

export const MyGroupsPage = () => {
  const [courses, setCourses] = useState<Course[]>();
  const [originalGroups, setOriginalGroups] = useState<LearnerInGroup[]>()
    const [groups, setGroups] = useState<LearnerInGroup[]>()
    const [user, setUser] = useState<User>(useAuth().user!)
    const apiClient = useApiClient();

    const extractCoursesFromGroups = (arr: LearnerInGroup[]) => {
      if(arr && arr.length > 0) {
        const tempCourses: Course[] = []
        arr.map((group) => {
          if(group && group.group && group.group.course){
            if(!tempCourses.includes(group.group.course)) {              
              tempCourses.push(group.group.course)
            }
          }
        })
        //removing duplicates from array
        const tempCoursesUnique = tempCourses.filter((value, index) => {
          const _value: string = JSON.stringify(value);
          return index === tempCourses.findIndex(course => {
            return JSON.stringify(course) === _value;
          });
        });
        setCourses(tempCoursesUnique)
      }
    }  
  
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
          setOriginalGroups(arr);
          extractCoursesFromGroups(arr);
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
                  <FilterGroupButton courses={courses} groups={groups} originalGroups={originalGroups} setGroups={setGroups}/>
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
  
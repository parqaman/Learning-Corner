import { AuthCard } from '../components/AuthCard'
import { AppLayout } from '../layout/AppLayout'
import { useToast, Heading, Box, Text, Button, Input, Textarea } from '@chakra-ui/react'
import { useApiClient } from '../adapter/api/useApiClient';
import { useAuth } from '../providers/AuthProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewCourseCard } from '../components/course_components/NewCourseCard';
import { Course, User } from '../adapter/api/__generated';

export const NewCoursePage = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate()
  const toast = useToast();
  const [user, setUser] = useState<User | null>(useAuth().user)
  const [course, setCourse] = useState<Course>({
    name: "", lecturer: user!, description: ""
  })

  const handleNewCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if(course){
        await apiClient.postCourses(course)
        .then(async (res)=>{
          if(user) {
            const theCourse = res.data;
            if(theCourse.id) {
              await apiClient.putUsersUserIDCourseCourseID(user.id, theCourse.id)
              .then((e)=>{
                console.log(e);
                toast({
                      title: "Sucessful",
                      description: <Text>Course sucessfully created</Text>,
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      });
                  navigate(-1);      
              })
              .catch((e)=>{
                console.log(e);
                navigate(-1);      
              })
            }
          }
        })
        .catch(error=>{
            toast({
            title: "Error occured.",
            description: <Text>{error.response.data.errors}</Text>,
            status: "error",
            duration: 9000,
            isClosable: true,
            });
        })
    }
  }

  return (
    <AppLayout display={'flex'} flexDir='column' justifyContent={'center'} alignItems='center'>
        <NewCourseCard>
            <Heading >
                Create a new course
            </Heading>
            <form onSubmit={(e) => handleNewCourse(e)}>
              <Box width={'100%'} gap={'1em'} display='flex' flexDirection={'column'}>
                <Input value={course?.name} onChange={(e)=>setCourse({name: e.target.value, lecturer: user!, description: course?.description})} as={Input} isRequired padding={'0.75em'} variant={'unstyled'} placeholder="Course title" _placeholder={{color: '#8E8E8E'}} border={'solid 2px'} borderColor={'rgba(0, 0, 0, 30%)'} id="course-title" name="course-title" type="text"/>
                <Textarea value={course?.description} onChange={(e)=>setCourse({name: course?.name, lecturer: user!, description: e.target.value})} isRequired padding={'0.75em'} placeholder="Course description" _placeholder={{color: '#8E8E8E'}} border={'solid 2px'} borderColor={'rgba(0, 0, 0, 30%)'} id="course-desc" name="course-desc"/>
                <Button variant={'unstyled'} width={'100%'} type="submit" bg={'black'} color={'white'} borderRadius={'2rem'}>
                  Create!
                </Button>
                <Button variant={'unstyled'} width={'100%'} onClick={()=>navigate(-1)} bg={'gray'} color={'white'} borderRadius={'2rem'}>
                  Cancel
                </Button>
              </Box>
            </form>
        </NewCourseCard>
    </AppLayout>
  )
}
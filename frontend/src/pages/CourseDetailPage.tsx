import { Box, Button, Flex, Heading, Input, Text, Textarea } from '@chakra-ui/react'
import { CourseCard } from '../components/course_components/CourseCard'
import { AppLayout } from '../layout/AppLayout'
import { IoEnterOutline } from 'react-icons/io5'
import { AiFillEdit } from 'react-icons/ai'
import React, { useEffect, useState } from 'react'
import { useApiClient } from '../adapter/api/useApiClient'
import { useParams } from 'react-router-dom'
import { Course } from '../adapter/api/__generated'
import { useAuth } from '../providers/AuthProvider'

interface CourseDescProps {
    course: Course;
    setCourse: React.Dispatch<React.SetStateAction<Course | undefined>>
    updateHandler: (e: React.FormEvent<HTMLFormElement>) => void
    isOwner: boolean
}
const CourseDescriptionSection = ({course, setCourse, updateHandler, isOwner}: CourseDescProps) => {
    const [editMode, setEditMode] = useState(false);

    const handleEditSection = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditMode(false)
        updateHandler(e)   
    }

    return (
        <Box mt={'3rem'} >
            <Flex 
            borderBottom={'solid 0.075rem'}
            borderBottomColor={'#0194F3'}
            pl={'0.5rem'} pr={'0.5rem'}
            justifyContent='space-between'
            >
                <Text fontSize={'2xl'} fontWeight='normal'>
                    Course Description
                </Text>
                { isOwner && !editMode &&
                    <Flex alignItems={'center'} fontSize='larger' cursor='pointer'>
                        <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                    </Flex>
                }
            </Flex>
            { editMode ? (
                <form onSubmit={(e)=>handleEditSection(e)} style={{display: 'flex', gap: '0.75rem'}}>
                    <Textarea value={course.description} resize='none' height={'10rem'} onChange={(e)=>setCourse({name: course.name, lecturer: course.lecturer, description: e.target.value})} />
                    <Button mt={'1rem'} type='submit' variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                        Done
                    </Button>
                </form>
            ) : (
                <Box pl={'0.5rem'} pr={'0.5rem'} mt='0.5rem'>
                        {course.description}
                </Box>
            )
            }
        </Box>
    )
}

export const CourseDetailPage = () => {    
    const { id } = useParams()
    const currentUser = useAuth().user
    const apiClient = useApiClient();
    const [isOwner, setIsOwner] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [course, setCourse] = useState<Course>()
    
    const fetchData = async () => {        
        const theCourse = await apiClient.getCoursesId(id)
        .then((res)=>{
            const theCourse = res.data
            setCourse(theCourse)
            
            if(theCourse.lecturer.id === currentUser?.id){
                setIsOwner(true)
            }            
        })
        .catch((e)=>{
            console.log(e);
        })
    }
    
    React.useEffect(()=>{
        fetchData();
    }, [])

    const handleEditCourseInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditMode(false)
        const res = await apiClient.putCourse(id, currentUser?.id, course)
        .catch((e)=>{
            console.log(e);
        })
    }

  return (
    <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
        <CourseCard>
            <Flex id='course-heading' justifyContent={'space-between'}>
                <Box display={'flex'} gap='1.5rem'>
                    <Box id='course-info'>
                        {editMode ? (
                            <form onSubmit={(e)=>handleEditCourseInfo(e)}>
                                <Input value={course?.name} onChange={(e)=>setCourse({name: e.target.value, lecturer: course?.lecturer!, description: course?.description})} />
                                <Flex alignItems={'center'} fontSize='medium' mt={'0.5rem'}>
                                    <Button type='submit' variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                                        Done
                                    </Button>
                                </Flex>
                            </form>
                        ) : (
                            <>
                                <Heading>{course?.name}</Heading>
                                <Text>{course?.lecturer.firstName} {course?.lecturer.lastName}</Text>
                            </>
                        )
                        }
                    </Box>
                    {
                        isOwner && !editMode &&
                        <Flex alignItems={'center'} fontSize='larger'>
                            <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                        </Flex>
                    }
                </Box>
                <Flex gap={'1rem'} id='course-buttons' flexDir={'row'} alignItems='center' fontSize={'3xl'}>
                    {/* TODO:
                        check whether this user is registered in this course
                        if yes show leave button, otherwise enter button
                    */}
                    <Text color='green.400' cursor='pointer'><IoEnterOutline/></Text>
                </Flex>
            </Flex>
            { //course description section
                course? (
                    <CourseDescriptionSection course={course} setCourse={setCourse} updateHandler={handleEditCourseInfo} isOwner={isOwner}/>
                ) : (
                    <Box>Course Desciption not available</Box>
                )
            }
            {/*TODO: map course sections*/}
        </CourseCard>
    </AppLayout>
  )
}

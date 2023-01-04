import { Box, Button, Flex, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { CourseCard } from '../components/course_components/CourseCard'
import { AppLayout } from '../layout/AppLayout'
import { IoEnterOutline } from 'react-icons/io5'
import { AiFillEdit, AiOutlineCheck } from 'react-icons/ai'
import { RxCross1 } from 'react-icons/rx'
import React, { useState } from 'react'
import { useApiClient } from '../adapter/api/useApiClient'
import { Group, User } from '../adapter/api/__generated'
import { useNavigate, useParams } from 'react-router-dom'
import { Course, Section } from '../adapter/api/__generated'
import { useAuth } from '../providers/AuthProvider'
import { SectionList } from '../components/SectionList'
import { GroupList } from '../components/group_components/GroupList'

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
                    <Box mt={'1rem'}>
                        <Button type='submit' variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                            <AiOutlineCheck/>
                        </Button>
                        <Button onClick={()=>setEditMode(false)} variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'gray'} color='white' fontWeight={'medium'}>
                            <RxCross1/>
                        </Button>
                    </Box>
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
    const [user, setUser] = useState<User | null>(useAuth().user);
    const apiClient = useApiClient();
    const [isOwner, setIsOwner] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [course, setCourse] = useState<Course>()
    const [newSection, setNewSection] = useState<Section>({
        heading: "", content: ""
    })
    const [newGroup, setNewGroup] = useState<Group>({
        name: "", description: ""
    })
    const toast = useToast();
    const navigate = useNavigate()
    const newSectionDisclosure = useDisclosure()
    const newGroupDisclosure = useDisclosure()

    const fetchData = async () => {        
        const theCourse = await apiClient.getCoursesId(id!)
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
        const res = await apiClient.putCourse(id!, currentUser?.id!, course)
        .catch((e)=>{
            console.log(e);
        })
    }

    const handleDeleteCourse = async () => {
        if(course && currentUser) {
            const res = await apiClient.deleteCoursesCourseIDUsersUserID(course.id!, currentUser.id)
            .then(()=>{
                toast({
                    title: "Deleted",
                    description: <Text>Course sucessfully deleted</Text>,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    });
                navigate(-1);
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

    const handleNewSection = () => {
        if(course) {
            const mergedSections = [...course.sections!, newSection]
            course.sections = mergedSections            
            setNewSection({
                heading: "",
                content: ""
            })
            newSectionDisclosure.onClose()

            //send post section to backend
        }
    }

    const handleNewGroup = () => {
        if(newGroup && course) {
            if(course.groups) { //case: course already has groups
                const mergedGroups = [...course.groups, newGroup];
                course.groups = mergedGroups
            }
            else { //case: course does not have any groups yet
                course.groups = [newGroup]
            }
            setNewGroup({
                name: "",
                description: ""
            })
            newGroupDisclosure.onClose()

            //send post group to backend
        }

    }
        
    const joinCourse = async () => {
        if(course && currentUser) {
            const res = await apiClient.putUsersUserIDCourseCourseID(currentUser.id, course.id!)
            .then(()=>{
                toast({
                    title: "Joined",
                    description: <Text>Course sucessfully joined</Text>,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    });
                navigate(-1);
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
    <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
        <CourseCard>
            <Flex id='course-heading' justifyContent={'space-between'}>
                <Box display={'flex'} gap='1.5rem'>
                    <Box id='course-info' maxW={'36rem'}>
                        {editMode ? (
                            <form onSubmit={(e)=>handleEditCourseInfo(e)} style={{width: '100%'}}>
                                <Textarea w={'100%'} resize={'none'} value={course?.name} onChange={(e)=>setCourse({name: e.target.value, lecturer: course?.lecturer!, description: course?.description!})} />
                                <Flex alignItems={'center'} fontSize='medium' mt={'0.5rem'} gap={'0.25rem'}>
                                    <Button type='submit' variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                                        Done
                                    </Button>
                                    <Button onClick={()=>setEditMode(false)} variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'gray'} color='white' fontWeight={'medium'}>
                                        Cancel
                                    </Button>
                                </Flex>
                            </form>
                        ) : (
                            <>
                                <Heading>
                                    {course?.name}
                                </Heading>
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
                    <button onClick={()=>joinCourse()}><Text color='green.400' cursor='pointer'><IoEnterOutline/></Text></button>
                </Flex>
            </Flex>
            {
                //course description section
                course? (
                    <CourseDescriptionSection course={course} setCourse={setCourse} updateHandler={handleEditCourseInfo} isOwner={isOwner}/>
                ) : (
                    <Box>Course Desciption not available</Box>
                )
            }
            {/** Section List  **/}
            <Box mt={'2rem'}>
                <Text fontSize={'2xl'} fontWeight='normal'>
                    Sections
                </Text>
                { isOwner &&
                    <Box mb={'1rem'}>
                        <Button onClick={newSectionDisclosure.onOpen} variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                            Add new section
                        </Button>
                        <Modal blockScrollOnMount={false} isOpen={newSectionDisclosure.isOpen} onClose={newSectionDisclosure.onClose}>
                            <ModalOverlay />
                            <ModalContent>
                            <ModalHeader>New Section</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Flex mb={'0.5rem'}>
                                    <form style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%'}}>
                                        <Input placeholder='Section title' value={newSection?.heading} onChange={(e)=>setNewSection({
                                            heading: e.target.value,
                                            content: newSection!.content
                                        })}/>
                                        <Textarea placeholder='Section description' value={newSection?.content} onChange={(e)=>setNewSection({
                                            heading: newSection!.heading, 
                                            content: e.target.value
                                        })}/>
                                        
                                    </form>
                                </Flex>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={()=>handleNewSection()}>
                                    Add
                                </Button>
                                <Button variant='ghost' onClick={newSectionDisclosure.onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Box>
                }
                {
                    course && course.sections &&
                    <SectionList sections={course.sections}/>
                }
            </Box>
            {/** Groups list */}
            <Box mt={'2rem'}>
                <Text fontSize={'2xl'} fontWeight='normal'>
                    Group area
                </Text>
                <Box mb={'1rem'}> {/** New group modal */}
                    <Button onClick={newGroupDisclosure.onOpen} variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'rgba(0, 0, 0, 1)'} color='white' fontWeight={'medium'}>
                        Create a new group
                    </Button>
                    <Modal blockScrollOnMount={false} isOpen={newGroupDisclosure.isOpen} onClose={newGroupDisclosure.onClose}>
                        <ModalOverlay />
                        <ModalContent>
                        <ModalHeader>New Group</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex mb={'0.5rem'}>
                                <form style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%'}}>
                                    <Input placeholder='Group name' value={newGroup?.name} onChange={(e)=>setNewGroup({
                                        name: e.target.value,
                                        description: newGroup.description
                                    })}/>
                                    <Textarea placeholder='Group description' value={newGroup?.description} onChange={(e)=>setNewGroup({
                                        name: newGroup.name,
                                        description: e.target.value,
                                    })}/>
                                    
                                </form>
                            </Flex>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={()=>handleNewGroup()}>
                                Create
                            </Button>
                            <Button variant='ghost' onClick={newGroupDisclosure.onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
                {
                    course && course.groups &&
                        <GroupList course={course} groups={course.groups}/>
                }
            </Box>
            <Box display={'flex'} justifyContent='center' mt={'3rem'}>
            {
                isOwner &&
                <Button onClick={()=>handleDeleteCourse()} variant={'link'} color='red' _active={{}} size={'sm'}>
                    Delete course
                </Button>
            }
            </Box>
        </CourseCard>
    </AppLayout>
  )
}

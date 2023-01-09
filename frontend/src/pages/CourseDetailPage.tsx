import { Box, Button, Flex, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { CourseCard } from '../components/course_components/CourseCard'
import { AppLayout } from '../layout/AppLayout'
import { IoEnterOutline, IoExitOutline } from 'react-icons/io5'
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
    updateCourse: React.Dispatch<React.SetStateAction<Course>>
    updateHandler: (e: React.FormEvent<HTMLFormElement>) => void
    isOwner: boolean
}

const CourseDescriptionSection = ({course, updateCourse, updateHandler, isOwner}: CourseDescProps) => {
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
                    <Textarea value={course.description} resize='none' height={'10rem'} onChange={(e)=>updateCourse((prev) => {return {...prev, description: e.target.value}})} />
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
    const apiClient = useApiClient();
    const [isOwner, setIsOwner] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [joined, setJoined] = useState(false)
    const [course, setCourse] = useState<Course>({
        name: "",
        description: "",
        lecturer: currentUser!
    })
    const [sections, setSections] = useState<Section[]>()
    const [newSection, setNewSection] = useState<Section>({
        heading: "", description: "", text: "section text" //text dari sebuah section
    })
    const [groups, setGroups] = useState<Group[]>();
    const [newGroup, setNewGroup] = useState<Group>({
        name: "", description: "", course: course
    })
    const [oldCourse, setOldCourse] = useState<Course>(course)
    const toast = useToast();
    const navigate = useNavigate()
    const newSectionDisclosure = useDisclosure()
    const newGroupDisclosure = useDisclosure()

    const fetchData = async () => {
        await apiClient.getCoursesId(id!)
        .then((res)=>{
            const theCourse = res.data
            setCourse(theCourse)
            setOldCourse(theCourse)
            setSections(theCourse.sections)
            setGroups(theCourse.groups)
            
            if(theCourse.lecturer.id === currentUser?.id){
                setIsOwner(true)
            }

            const participants = theCourse.participants!.map((obj:any) => obj.id);
            
            if(participants.includes(currentUser?.id)){
                setJoined(true)
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
        await apiClient.putCourse(id!, course)
        .then(()=>{
            setOldCourse(course)
            setCourse(course)
            toast({
                title: "Updated",
                description: <Text>Course sucessfully updated</Text>,
                status: "success",
                duration: 5000,
                isClosable: true,
                });
        })
        .catch(error=>{
            setCourse(oldCourse)
            toast({
            title: "Error occured.",
            description: <Text>{error.response.data.errors}</Text>,
            status: "error",
            duration: 9000,
            isClosable: true,
            });
        })
    }

    const handleDeleteCourse = async () => {
        if(course && currentUser) {
            const res = await apiClient.deleteCoursesCourseIDUsersUserID(course.id!)
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

    const handleNewSection = async () => {
        if(course) {
            setNewSection({
                heading: "",
                description: "",
                text: newSection.text
            })
            
            if(course && course.id){
                await apiClient.postSectionCourse(course.id, newSection)
                .then((response)=>{
                    const theSection = response.data
                    const mergedSections = [...sections!, theSection]
                    setSections(mergedSections)
                    newSectionDisclosure.onClose()
                })
                .catch((e)=> {
                    console.log(e);
                })
            }        
        }
    }

    const handleNewGroup = async () => {
        if(newGroup) {
            await apiClient.postGroups(newGroup)
            .then((res) => {
                const theGroup = res.data;
                const mergedGroupList = [...groups!, theGroup];
                setGroups(mergedGroupList)
                setNewGroup({
                    name: "",
                    description: "",
                    course: course
                })
                
                const joinGroup = async () => {
                    if(currentUser && course && course.id && theGroup && theGroup.id) {
                        await apiClient.putUsersUseridCourseCourseidGroupGroupid(currentUser.id!, course.id, theGroup.id)
                    }
                } 

                joinGroup();

                toast({
                    title: "Created",
                    description: <Text>Group sucessfully created</Text>,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    });
                setJoined(true)

                newGroupDisclosure.onClose()
            })
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
                setJoined(true)
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

    const leaveCourse = async () => {
        if(course && currentUser) {
            const res = await apiClient.deleteUsersUserIDCourseCourseID(currentUser.id, course.id!)
            .then(()=>{
                toast({
                    title: "Left",
                    description: <Text>Course sucessfully left</Text>,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    });
                setJoined(false)
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
                <Flex gap={'1rem'} id='course-buttons' flexDir={'row'} alignItems='center'>
                    {
                        !isOwner && !joined &&
                        <button onClick={()=>joinCourse()}><HStack><Text>Join course</Text><Text color='green.400' cursor='pointer' fontSize={'3xl'}><IoEnterOutline/></Text></HStack></button>
                    }
                    {
                        !isOwner && joined &&
                        <button onClick={()=>leaveCourse()}><HStack><Text>Leave course</Text><Text color='red.400' cursor='pointer' fontSize={'3xl'}><IoExitOutline/></Text></HStack></button>
                    }
                </Flex>
            </Flex>
            {
                //course description section
                course ? (
                    <CourseDescriptionSection course={course} updateCourse={setCourse} updateHandler={handleEditCourseInfo} isOwner={isOwner}/>
                ) : (
                    <Box>Course Desciption not available</Box>
                )
            }
            {/** Section List  **/}
            { (joined || isOwner) && 
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
                                                description: newSection!.description,
                                                text: newSection!.text
                                            })}/>
                                            <Textarea placeholder='Section description' value={newSection?.description} onChange={(e)=>setNewSection({
                                                heading: newSection!.heading, 
                                                description: e.target.value,
                                                text: newSection!.text
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
                        course &&
                        <SectionList course={course} sections={sections} setSections={setSections} isOwner={isOwner}/>
                    }
                </Box>
            }
            {/** Groups list */}
            { (joined || isOwner) &&
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
                                            description: newGroup.description,
                                            course: course
                                        })}/>
                                        <Textarea placeholder='Group description' value={newGroup?.description} onChange={(e)=>setNewGroup({
                                            name: newGroup.name,
                                            description: e.target.value,
                                            course: course
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
                        course &&
                            <GroupList course={course} groups={groups} />
                    }
                </Box>
            }
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

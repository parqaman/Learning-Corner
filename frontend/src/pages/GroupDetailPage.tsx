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
import { GroupCard } from '../components/group_components/GroupCard'
import { ActionClose } from '../components/ChatWindow'

interface CourseDescProps {
    group: Group;
    updateGroup: React.Dispatch<React.SetStateAction<Group>>
    updateHandler: (e: React.FormEvent<HTMLFormElement>) => void
    isMember: boolean
}

const GroupDescriptionSection = ({group, updateGroup, updateHandler, isMember}: CourseDescProps) => {
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
                { isMember && !editMode &&
                    <Flex alignItems={'center'} fontSize='larger' cursor='pointer'>
                        <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                    </Flex>
                }
            </Flex>
            { editMode ? (
                <form onSubmit={(e)=>handleEditSection(e)} style={{display: 'flex', gap: '0.75rem'}}>
                    <Textarea value={group.description} resize='none' height={'10rem'} onChange={(e)=>updateGroup((prev) => {return {...prev, description: e.target.value}})} />
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
                        {group.description}
                </Box>
            )
            }
        </Box>
    )
}


export const GroupDetailPage = () => {    
    const params = useParams()
    const currentUser = useAuth().user
    const apiClient = useApiClient();
    const [editMode, setEditMode] = useState(false)
    const [joined, setJoined] = useState(false)
    const [group, setGroup] = useState<Group>({
        name: "",
        description: "",
    })
    const [sections, setSections] = useState<Section[]>()
    const [newSection, setNewSection] = useState<Section>({
        heading: "", description: "", text: "section text" //text dari sebuah section
    })
    const [oldGroup, setOldGroup] = useState<Group>(group)
    const toast = useToast();
    const navigate = useNavigate()
    const newSectionDisclosure = useDisclosure()

    const fetchData = async () => {
        await apiClient.getGroupId(params.groupID!)
        .then((res)=>{
            const theGroup = res.data
            
            setGroup(theGroup)
            setOldGroup(theGroup)
            setSections(theGroup.sections)
            
            const participants = theGroup.members!.map((obj:any) => obj.learner);            

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

    const handleEditGroupInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditMode(false)
        await apiClient.putGroup(params.groupID!, group)
        .then(()=>{
            setOldGroup(group)
            setGroup(group)
            toast({
                title: "Updated",
                description: <Text>Group sucessfully updated</Text>,
                status: "success",
                duration: 5000,
                isClosable: true,
                });
        })
        .catch(error=>{
            setGroup(oldGroup)
            toast({
            title: "Error occured.",
            description: <Text>{error.response.data.errors}</Text>,
            status: "error",
            duration: 9000,
            isClosable: true,
            });
        })
    }

    const handleDeleteGroup = async () => {
        if(group && currentUser && group.id) {
            const res = await apiClient.deleteCoursesCourseIDUsersUserID(group.id)
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
        if(group) {
            setNewSection({
                heading: "",
                description: "",
                text: newSection.text
            })
            
            if(group && group.id){
                await apiClient.postSectionCourse(group.id, newSection)
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
        
    const joinGroup = async () => {        
        if(currentUser && params.courseID && params.groupID) {
            const res = await apiClient.putUsersUseridCourseCourseidGroupGroupid(currentUser.id, params.courseID, params.groupID)
            .then(()=>{
                toast({
                    title: "Joined",
                    description: <Text>Group sucessfully joined</Text>,
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

    const leaveGroup = async () => {
        if(currentUser && params.courseID && params.groupID) {
            const res = await apiClient.deleteUsersUseridCourseCourseidGroupGroupid(currentUser.id, params.courseID, params.groupID)
            .then(()=>{
                ActionClose('group-card')
                toast({
                    title: "Left",
                    description: <Text>Group sucessfully left</Text>,
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
        <GroupCard joined={joined}>
            <Flex id='course-heading' justifyContent={'space-between'}>
                <Box display={'flex'} gap='1.5rem'>
                    <Box id='course-info' maxW={'36rem'}>
                        {editMode ? (
                            <form onSubmit={(e)=>handleEditGroupInfo(e)} style={{width: '100%'}}>
                                <Textarea w={'100%'} resize={'none'} value={group?.name} onChange={(e)=>setGroup({name: e.target.value})} />
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
                            {
                                group &&
                                <Heading>
                                    {group.name}
                                </Heading>
                            }
                            </>
                        )
                        }
                    </Box>
                    {
                        joined && !editMode &&
                        <Flex alignItems={'center'} fontSize='larger'>
                            <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                        </Flex>
                    }
                </Box>
                <Flex gap={'1rem'} id='course-buttons' flexDir={'row'} alignItems='center'>
                    {
                        !joined &&
                        <button onClick={()=>joinGroup()}><HStack><Text>Join group</Text><Text color='green.400' cursor='pointer' fontSize={'3xl'}><IoEnterOutline/></Text></HStack></button>
                    }
                    {
                        joined &&
                        <button onClick={()=>leaveGroup()}><HStack><Text>Leave group</Text><Text color='red.400' cursor='pointer' fontSize={'3xl'}><IoExitOutline/></Text></HStack></button>
                    }
                </Flex>
            </Flex>
            {
                //course description section
                group ? (
                    <GroupDescriptionSection group={group} updateGroup={setGroup} updateHandler={handleEditGroupInfo} isMember={joined}/>
                ) : (
                    <Box>Course Desciption not available</Box>
                )
            }
            {/** Section List  **/}
            { (joined) && 
                <Box mt={'2rem'}>
                    <Text fontSize={'2xl'} fontWeight='normal'>
                        Sections
                    </Text>
                    { joined &&
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
                        group &&
                        <SectionList course={group} sections={sections} setSections={setSections} isOwner={joined}/>
                    }
                </Box>
            }
            <Box display={'flex'} justifyContent='center' mt={'3rem'}>
            {
                joined &&
                <Button onClick={()=>handleDeleteGroup()} variant={'link'} color='red' _active={{}} size={'sm'}>
                    Delete group
                </Button>
            }
            </Box>
        </GroupCard>
    </AppLayout>
  )
}

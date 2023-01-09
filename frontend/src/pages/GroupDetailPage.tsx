import { Box, Button, Flex, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { GroupCard } from '../components/group_components/GroupCard'
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
import { GroupDetailCard } from '../components/group_details_components/GroupDetailsCard'

interface GroupDescProps {
    group: Group;
    updateGroup: React.Dispatch<React.SetStateAction<Group>>
    updateHandler: (e: React.FormEvent<HTMLFormElement>) => void
    isOwner: boolean
}

const GroupDescriptionSection = ({group, updateGroup, updateHandler, isOwner}: GroupDescProps) => {
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
                    Group Description
                </Text>
                { isOwner && !editMode &&
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
    const { courseId, groupId } = useParams()
    const currentUser = useAuth().user
    const apiClient = useApiClient();
    const [isOwner, setIsOwner] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [joined, setJoined] = useState(false)
    const [group, setGroup] = useState<Group>({
        name: "",
        description: ""
    })
    const [course, setCourse] = useState<Course>({
        name: "",
        description: "",
        lecturer: currentUser!
    })
    const [oldGroup, setOldGroup] = useState<Group>(group)
    const toast = useToast();
    const navigate = useNavigate()
    const newSectionDisclosure = useDisclosure()
    const newGroupDisclosure = useDisclosure()

    const fetchData = async () => {
        await apiClient.getGroupId(groupId!)
        .then((res)=>{
            const theGroup = res.data
            setGroup(theGroup)
            setOldGroup(theGroup)

            // Check if user is member of the group
            const members = theGroup.members!.map((obj:any) => obj.learner);
            
            if(members.includes(currentUser?.id)){
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
        await apiClient.putGroup(groupId!, group)
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
        if(group && currentUser) {
            const res = await apiClient.deleteGroup(group.id!)
            .then(()=>{
                toast({
                    title: "Deleted",
                    description: <Text>Group sucessfully deleted</Text>,
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
        
    const joinGroup = async () => {
        if(group && currentUser) {
            const res = await apiClient.putUsersUseridCourseCourseidGroupGroupid(currentUser.id, group.course!.id!, group.id!)
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
        if(group && currentUser) {
            const res = await apiClient.deleteUsersUseridCourseCourseidGroupGroupid(currentUser.id, group.course!.id!, group.id!)
            .then(()=>{
                toast({
                    title: "Left",
                    description: <Text>Gruop sucessfully left</Text>,
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
        <GroupDetailCard>
            <Flex id='group-heading' justifyContent={'space-between'}>
                <Box display={'flex'} gap='1.5rem'>
                    <Box id='group-info' maxW={'36rem'}>
                        {editMode ? (
                            <form onSubmit={(e)=>handleEditGroupInfo(e)} style={{width: '100%'}}>
                                <Textarea w={'100%'} resize={'none'} value={group?.name} onChange={(e)=>setGroup({name: e.target.value, description: group?.description!})} />
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
                                <Text>
                                    Course: {group?.course?.name}
                                </Text>
                                <Heading>
                                    {group?.name}
                                </Heading>
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
                <Flex gap={'1rem'} id='group-buttons' flexDir={'row'} alignItems='center'>
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
            {/** Member list */}
            <Box display={'flex'} justifyContent='center' mt={'3rem'}>
            {
                joined &&
                <Button onClick={()=>handleDeleteGroup()} variant={'link'} color='red' _active={{}} size={'sm'}>
                    Delete group
                </Button>
            }
            </Box>
        </GroupDetailCard>
    </AppLayout>
  )
}
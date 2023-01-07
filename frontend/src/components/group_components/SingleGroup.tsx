import { Flex, Heading, HStack, Text, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { IoEnterOutline, IoExitOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom"
import { useApiClient } from "../../adapter/api/useApiClient";
import { Course, Group } from "../../adapter/api/__generated/api"
import { useAuth } from "../../providers/AuthProvider";

export const SingleGroup = ({course, group, myGroupPage}: {course: Course; group: Group; myGroupPage: boolean}) => {
    const [joined, setJoined] = useState(false)
    const [currentUser, setCurrentUser] = useState(useAuth().user)
    const navigate = useNavigate()
    const apiClient = useApiClient()
    const toast = useToast()

    const fetchData = async () => {
        const groupID: string[] = []
        if(currentUser) {
            await apiClient.getUsersUseridGroups(currentUser.id)
            .then((res) => {
                res.data.map((learnerInGroup)=> {
                    if(learnerInGroup && learnerInGroup.group && learnerInGroup.group.id) {
                        groupID.push(learnerInGroup.group.id)
                    }
                })
                if(group.id) {
                    groupID.includes(group.id) ? (
                        setJoined(true)
                    ) : (
                        setJoined(false)
                    )

                }
            })

        }
    }

    useEffect(()=>{
        fetchData()
    }, [])
    

    const joinGroup = async () => {
        if(currentUser && course && course.id && group && group.id) {
            await apiClient.putUsersUseridCourseCourseidGroupGroupid(currentUser.id, course.id, group.id)
            .then((res) => {
                toast({
                    title: "Joined",
                    description: <Text>Group sucessfully joined</Text>,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });    
                setJoined(true)
            })
        }
    }

    const leaveGroup = async () => {
        if(currentUser && course && course.id && group && group.id) {
            await apiClient.deleteUsersUseridCourseCourseidGroupGroupid(currentUser.id, course.id, group.id)
            .then((res) => {
                toast({
                    title: "Left",
                    description: <Text>Group sucessfully left</Text>,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });    
                setJoined(false)
            })
        }
    }

    return (
        <Flex alignItems={'center'} gap='0.5rem'>
            <Flex
            padding='1rem 0.75rem'
            width={'100%'}
            borderBottom={'solid 0.025rem'}
            borderTop={'solid 0.025rem'}
            borderColor={'black'}
            justifyContent='space-between'
            alignItems={'center'}
            >
                <Heading fontSize={'lg'} fontWeight={'medium'} onClick={()=>navigate('/courses/'+course.id+'/groups/'+group.id)} cursor='pointer'>
                    {group.name}
                    {
                        myGroupPage &&
                        <Text fontSize={'sm'} fontWeight='normal' mt={'0.5rem'} >
                            {course.name}
                        </Text>
                    }
                </Heading>
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
        </Flex>
)
}
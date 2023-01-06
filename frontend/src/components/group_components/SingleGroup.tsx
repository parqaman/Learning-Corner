import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { IoEnterOutline, IoExitOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom"
import { useApiClient } from "../../adapter/api/useApiClient";
import { Course, Group } from "../../adapter/api/__generated/api"
import { useAuth } from "../../providers/AuthProvider";

export const SingleGroup = ({course, group}: {course: Course; group: Group}) => {
    const [joined, setJoined] = useState(false)
    const [currentUser, setCurrentUser] = useState(useAuth().user)
    const navigate = useNavigate()
    const apiClient = useApiClient()

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
                console.log(res);
            })
        }
    }

    const leaveGroup = async () => {
        if(currentUser && course && course.id && group && group.id) {
            await apiClient.deleteUsersUseridCourseCourseidGroupGroupid(currentUser.id, course.id, group.id)
            .then((res) => {
                console.log(res);
            })
        }
    }

    return (
        <Flex alignItems={'center'} gap='0.5rem'>
            <Flex
            bg={'#F0F2F5'}
            padding='1rem 0.75rem'
            width={'100%'}
            borderRadius={'0.5rem'}
            boxShadow={'0 0.05rem 0.15rem rgba(0, 0, 0, 0.25)'}
            justifyContent='space-between'
            alignItems={'center'}
            >
                <Heading fontSize={'lg'} fontWeight={'medium'} onClick={()=>navigate('/courses/'+course.id+'/groups/'+group.id)} cursor='pointer'>
                    {group.name}
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
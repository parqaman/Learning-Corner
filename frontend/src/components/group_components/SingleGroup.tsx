import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { Course, Group } from "../../adapter/api/__generated/api"

export const SingleGroup = ({course, group}: {course: Course; group: Group}) => {
    const navigate = useNavigate()

    return (
        <Flex alignItems={'center'} gap='0.5rem'>
            <Box
            bg={'#F0F2F5'}
            padding='1rem 0.75rem'
            width={'100%'}
            cursor='pointer'
            onClick={()=>navigate('/courses/'+course.id+'/groups/'+group.id)}
            borderRadius={'0.5rem'}
            boxShadow={'0 0.05rem 0.15rem rgba(0, 0, 0, 0.25)'}
            >
                <Heading fontSize={'lg'} fontWeight={'medium'}>
                    {group.name}
                </Heading>
            </Box>
        </Flex>
)
}
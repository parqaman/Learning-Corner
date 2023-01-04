import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { Course, Group } from "../../adapter/api/__generated/api"

export const SingleGroup = ({course, group}: {course: Course; group: Group}) => {
    const navigate = useNavigate()

    return (
        <Flex alignItems={'center'} gap='0.5rem'>
            <Text>•</Text>
            <Heading
                as={'u'}
                fontSize={'lg'}
                fontWeight={'semibold'}
                maxWidth={'15rem'}
                maxHeight={'3rem'}
                cursor='pointer'
                mt={'0.5rem'}
                mb={'0.5rem'}
                onClick={()=>navigate('/courses/'+course.id+'/groups/'+group.id)}    
            >
                {group.name}
            </Heading>
        </Flex>
)
}
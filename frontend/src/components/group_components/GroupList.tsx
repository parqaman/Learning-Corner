import { Box, Text, Flex, Grid, GridItem } from "@chakra-ui/react"
import { Course, Group } from '../../adapter/api/__generated/api'
import { SingleGroup } from "./SingleGroup";

export const GroupList = ({course}: {course: Course | null}) => {
    return (
        <Flex flexDir={'column'} mt='0.25rem' mb={'1.5rem'}>
            {
                course && course.groups && course.groups.length > 0 ? (
                    course.groups.map((group) => (
                        <SingleGroup
                            key={group.id}
                            course={course}
                            group={group}                                       
                        />    
                    ))    
                ) : (
                    <Text>No groups found</Text>
                )
            }
        </Flex>
    )
}

import { Box, Text, Flex, Grid, GridItem } from "@chakra-ui/react"
import { Course, Group } from '../../adapter/api/__generated/api'
import { SingleGroup } from "./SingleGroup";

export const GroupList = ({course, groups}: {course: Course | null; groups: Group[] | null}) => {
    return (
            course && groups ? (
                <Flex flexDir={'column'} mt='0.25rem' mb={'1.5rem'}>
                    {
                        groups.map((group) => (
                            <SingleGroup
                                key={group.id}
                                course={course}
                                group={group}                                       
                            />    
                        ))
                    }
                </Flex>
            ) : (
                <Text>No groups found</Text>
            )
    )
}

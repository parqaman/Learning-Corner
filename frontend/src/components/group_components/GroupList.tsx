import { Box, Text, Flex, Grid, GridItem } from "@chakra-ui/react"
import { Course, Group } from '../../adapter/api/__generated/api'
import { SingleGroup } from "./SingleGroup";

export const GroupList = ({course, groups}: {course: Course | null; groups: Group[] | undefined;}) => {
    return (
        <Flex minW={'47rem'} flexDir={'column'} mt='0.25rem' mb={'1.5rem'} gap='1.25rem' >
            {
                course && groups && groups.length > 0 ? (
                    groups.map((group) => (
                        <SingleGroup
                            key={group.id}
                            course={course}
                            group={group}
                            myGroupPage={false}
                        />    
                    ))    
                ) : (
                    <Text>No groups found</Text>
                )
            }
        </Flex>
    )
}

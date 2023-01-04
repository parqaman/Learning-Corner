import { Box, Text, Flex, Grid, GridItem } from "@chakra-ui/react"
import { Course } from '../../adapter/api/__generated/api'
import { SingleCourse } from "./SingleCourse";

export const CourseList = ({courses}: {courses: Course[] | undefined}) => {
    return (
            <Flex minW={'47rem'} flexDir={'column'} alignItems={'center'} mt='0.25rem' mb={'1.5rem'}>
                {
                    courses && courses.length > 0 ? (
                        <Grid templateColumns={'repeat(3, 1fr)'} gap='1rem'>
                            {
                                courses.map((course)=>(
                                    <GridItem key={course.id}>
                                        <SingleCourse
                                            key={course.id} 
                                            course={course}
                                            />
                                    </GridItem>    
                                ))
                            }
                        </Grid>
                    ) : (
                        <Text  width='100%'>No courses found</Text>
                    )
                }
                
            </Flex>
    )
}
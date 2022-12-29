import { Box, Flex, Grid, GridItem } from "@chakra-ui/react"
import { Course } from '../../adapter/api/__generated/api'
import { SingleCourse } from "./SingleCourse";

export const CourseList = ({courses}: {courses: Course[]}) => {
    return (
            <Flex flexDir={'column'} alignItems={'center'} mt='0.25rem' mb={'1.5rem'}>
                <Grid templateColumns={'repeat(3, 1fr)'} gap='1rem'>
                    {
                        courses ? (
                            courses.map((course)=>(
                                <GridItem key={course.id}>
                                    <SingleCourse
                                        key={course.id} 
                                        course={course}
                                        />
                                </GridItem>    
                            ))
                        ) : (
                            <Box>No courses available</Box>
                        )
                        
                    }
                </Grid>
            </Flex>
    )
}
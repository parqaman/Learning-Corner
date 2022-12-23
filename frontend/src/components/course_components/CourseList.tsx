import { Flex, Grid, GridItem } from "@chakra-ui/react"
import { Course } from "../../pages/HomePage"
import { SingleCourse } from "./SingleCourse";

export interface CourseProps {
    courses: Course[];
}

export const CourseList = ({courses}: CourseProps) => {
    return (
            <Flex flexDir={'column'} alignItems={'center'} mt='0.25rem' mb={'1.5rem'}>
                <Grid templateColumns={'repeat(3, 1fr)'} gap='1rem'>
                    {
                        courses.map((course)=>(
                            <GridItem key={course.id}>
                                <SingleCourse
                                    id={course.id}
                                    courseName={course.courseName}
                                    courseAuthor={course.courseAuthor}
                                    key={course.id}
                                />
                            </GridItem>    
                        ))
                    }
                </Grid>
            </Flex>
    )
}
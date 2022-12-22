import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react"
import { Course } from "../pages/HomePage"

interface CourseListProps {
    courses: Course[];
}

export const SingleCourse = (course: Course) => {
    return (
        <Box
            bg={'white'}
            p='0.75rem'
            boxShadow={'0 0 0.25rem rgba(0, 0, 0, 0.1)'}
            borderRadius='0.5rem'
            onClick={()=>console.log("Single Course Clicked")}
            cursor='pointer'
            width={'15rem'}
            height={'7rem'}
            gap='0.25rem'
            display={'flex'}
            flexDir='column'
            justifyContent={'center'}
        >
            <Heading
                fontSize={'larger'}
                fontWeight={'semibold'}
                maxWidth={'15rem'}
                maxHeight={'3rem'}
                overflowX='hidden'
                overflowY={'hidden'}
                borderBottom={'solid 0.075rem'}
                borderBottomColor={'rgba(0, 0, 0, 20%)'}
                noOfLines={2}
                height={'100%'}
            >
                {course.courseName}
            </Heading>
            <Text 
                noOfLines={1}
            >
                {course.courseAuthor}
            </Text>
        </Box>
    )
}

export const CourseList = ({courses}: CourseListProps) => {
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
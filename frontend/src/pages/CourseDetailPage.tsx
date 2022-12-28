import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { CourseCard } from '../components/course_components/CourseCard'
import { AppLayout } from '../layout/AppLayout'
import { IoEnterOutline } from 'react-icons/io5'
import React from 'react'

export const CourseSection = (section: {title: string; content: string;}) => {
    return (
        <Box mt={'3rem'} >
            <Box 
            borderBottom={'solid 0.075rem'}
            borderBottomColor={'#0194F3'}
            pl={'0.5rem'} pr={'0.5rem'}
            >
                <Text fontSize={'2xl'} fontWeight='normal'>{section.title}</Text>
            </Box>
            <Box pl={'0.5rem'} pr={'0.5rem'} mt='0.5rem'>
                {section.content}
            </Box>
        </Box>
    )
}

export const CourseDetailPage = () => {
    const sections = [
        {
            title: "Course Description",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit "
        },
        {
            title: "Documents",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit "
        },
        {
            title: "Available groups",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit "
        },
    ]

    const fetchData = () => {
        //TODO: get course by id
        console.log("get course ", );
        
    }

    React.useEffect(()=>{
        fetchData();
    }, [])

  return (
    <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
        <CourseCard>
            <Flex id='course-heading' >
                <Box id='course-info' flex={1}>
                    <Heading>Course Name</Heading>
                    <Text>Course Author</Text>
                </Box>
                <Flex id='course-buttons' flexDir={'column'} cursor='pointer' justifyContent='center' fontSize={'3xl'} color='green.400'>
                    <IoEnterOutline/>
                </Flex>
            </Flex>
            {
                sections.map((section)=> (
                    <CourseSection title={section.title} content={section.content}/>
                ))
            }

        </CourseCard>
    </AppLayout>
  )
}

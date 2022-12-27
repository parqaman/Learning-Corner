import { Box, Button, Flex, Heading, Input, Text, Textarea } from '@chakra-ui/react'
import { CourseCard } from '../components/course_components/CourseCard'
import { AppLayout } from '../layout/AppLayout'
import { IoEnterOutline } from 'react-icons/io5'
import { AiFillEdit } from 'react-icons/ai'
import React, { useState } from 'react'

export const CourseSection = (section: {title: string; content: string; owner: boolean;}) => {
    const [editMode, setEditMode] = useState(false)
    const [theSection, setTheSection] = useState({
        title: section.title, content: section.content
    })

    const handleEditSection = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditMode(!editMode)
        console.log(section.title);
        
        //TODO: send put request to update section title
    }

    return (
        <Box mt={'3rem'} >
            <Flex 
            borderBottom={'solid 0.075rem'}
            borderBottomColor={'#0194F3'}
            pl={'0.5rem'} pr={'0.5rem'}
            justifyContent='space-between'
            >
                { editMode ? (
                    <form onSubmit={(e)=>handleEditSection(e)} style={{display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'space-between'}}>
                        <Input value={theSection.title} onChange={(e)=>setTheSection({title: e.target.value, content: theSection.content})} width='50%'/>
                        <Flex flexDir={'column'} alignItems={'center'} fontSize='medium' mt={'0.5rem'}>
                            <Button type='submit' variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                                Done
                            </Button>
                        </Flex>
                    </form>

                ) : (
                    <Text fontSize={'2xl'} fontWeight='normal'>{theSection.title}</Text>
                )
                }
                { section.owner && !editMode &&
                        <Flex alignItems={'center'} fontSize='larger' cursor='pointer'>
                            <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                        </Flex>
                }
            </Flex>
            { editMode ? (
                <form onSubmit={(e)=>handleEditSection(e)} style={{display: 'flex', gap: '0.75rem'}}>
                    <Textarea value={theSection.content} resize='none' height={'10rem'} onChange={(e)=>setTheSection({title: theSection.title, content: e.target.value})} />
                </form>

            ) : (
                <Box pl={'0.5rem'} pr={'0.5rem'} mt='0.5rem'>
                        {theSection.content}
                </Box>
            )
            }
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
    
    const owner = true
    const [editMode, setEditMode] = useState(false)
    const [courseInfo, setCourseInfo] = useState({
        courseName: "", courseAuthor: ""
    })
    const fetchData = () => {
        //TODO: get course by id
        //TODO: if user === owner, set editor state to true
        //TODO: set editCourseInfo initial state to according to course info after fetching the data
        setCourseInfo({
            courseName: "Course Name",
            courseAuthor: "Course Author"
        })
    }

    React.useEffect(()=>{
        fetchData();
    }, [])

    const handleEditCourseInfo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditMode(!editMode)
        //TODO: send put request
    }

  return (
    <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
        <CourseCard>
            <Flex id='course-heading' justifyContent={'space-between'}>
                <Box display={'flex'} gap='1.5rem'>
                    <Box id='course-info'>
                        {editMode ? (
                            <form onSubmit={(e)=>handleEditCourseInfo(e)}>
                                <Input value={courseInfo.courseName} onChange={(e)=>setCourseInfo({courseName: e.target.value, courseAuthor: courseInfo.courseAuthor})} />
                                <Input value={courseInfo.courseAuthor} onChange={(e)=>setCourseInfo({courseName: courseInfo.courseName, courseAuthor: e.target.value})} />
                                <Flex alignItems={'center'} fontSize='medium' mt={'0.5rem'}>
                                    <Button type='submit' variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                                        Done
                                    </Button>
                                </Flex>
                            </form>
                        ) : (
                            <>
                                <Heading>{courseInfo.courseName}</Heading>
                                <Text>{courseInfo.courseAuthor}</Text>
                            </>
                        )
                        }
                    </Box>
                    {
                        owner && !editMode &&
                        <Flex alignItems={'center'} fontSize='larger'>
                            <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                        </Flex>
                    }
                </Box>
                <Flex gap={'1rem'} id='course-buttons' flexDir={'row'} alignItems='center' fontSize={'3xl'}>
                    {/* TODO:
                        check whether this user is registered in this course
                        if yes show leave button, otherwise enter button
                    */}
                    <Text color='green.400' cursor='pointer'><IoEnterOutline/></Text>
                </Flex>
            </Flex>
            {
                sections.map((section)=> (
                    <CourseSection title={section.title} content={section.content} owner={owner}/>
                ))
            }

        </CourseCard>
    </AppLayout>
  )
}

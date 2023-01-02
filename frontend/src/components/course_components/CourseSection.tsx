import { Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react'
import { AiFillEdit } from 'react-icons/ai'
import React, { useState } from 'react'

interface SectionProps {
    title: string;
    content: string;
    isOwner: boolean;
}

export const CourseSection = (sectionProps: SectionProps) => {
    const [editMode, setEditMode] = useState(false)
    const [theSection, setTheSection] = useState({
        title: sectionProps.title, content: sectionProps.content
    })
    
    const handleEditSection = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditMode(!editMode)
        console.log(sectionProps.title);
        
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
                    <Text fontSize={'2xl'} fontWeight='normal'>
                        {theSection.title}
                    </Text>
                )
                }
                { sectionProps.isOwner && !editMode &&
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

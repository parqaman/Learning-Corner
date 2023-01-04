import { Box, Button, Flex, Image, Input, Text, Textarea } from '@chakra-ui/react'
import { AiFillEdit, AiOutlineCheck, AiFillFile } from 'react-icons/ai'
import React, { useRef, useState } from 'react'
import { ModelFile, Section } from '../adapter/api/__generated';
import { RxCross1 } from 'react-icons/rx';
import profile_empty  from '../assets/profile_empty.png'
import axios from 'axios';

interface SectionProps {
    section: Section;
    isOwner: boolean;
}

const SingleSectionTile = (sectionProp: SectionProps) => {
    const [editMode, setEditMode] = useState(false);
    const [editSection, setEditSection] = useState<Section>(sectionProp.section);
    const [files, setFiles] = useState<ModelFile[]>()
    const MAX_FILE_SIZE = 5242880;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = () => {
        setEditSection(sectionProp.section)
    }

    useRef(()=>{
        fetchData()
    })

    const handleEditSection = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditMode(false)


        //TODO: send put request to update section title
    }
    
    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if(e.target.files){
            const inputedFile = e.target.files[0];
            if(inputedFile.size > MAX_FILE_SIZE){
                alert("file size too big")
            }
            else {
                const reader = new FileReader()
                reader.readAsDataURL(inputedFile);
                reader.onload = () => {
                    if(reader.result){
                        const theFile: ModelFile = {
                            name: inputedFile.name,
                            content: reader.result.toString()
                        }                        
                        if(files) {
                            const mergedFileList: ModelFile[] = [...files, theFile]
                            sectionProp.section.files = mergedFileList
                            setFiles(mergedFileList)
                        }
                        else{
                            const mergedFileList: ModelFile[] = [theFile]
                            sectionProp.section.files = mergedFileList
                            setFiles(mergedFileList)
                        }
                    }
                }
                //posting file to server's file folder
                const formData = new FormData();
                formData.append("myFile", inputedFile);

                axios.post(profile_empty, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
                });
            }
          }
        }

    return (
        <Box mt={'1.5rem'} mb='1.5rem' id='section-tile' >
            <Flex 
            borderBottom={'solid 0.075rem'}
            borderBottomColor={'#0194F3'}
            pl={'0.5rem'} pr={'0.5rem'}
            justifyContent='space-between'
            >
                { editMode ? (
                        <form onSubmit={(e)=>handleEditSection(e)} style={{display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'space-between'}}>
                            <Input value={editSection.heading} onChange={(e)=>setEditSection({
                                heading: e.target.value,
                                content: editSection.content
                            })}/>
                            <Flex gap={'0.25rem'} alignItems='center' >
                                <Button onClick={()=>setEditMode(false)} variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'gray'} color='white' fontWeight={'medium'}>
                                    <RxCross1/>
                                </Button>
                                <Button type='submit' variant={'solid'} _hover={{}} _active={{}} size='xs' bg={'black'} color='white' fontWeight={'medium'}>
                                    <AiOutlineCheck/>
                                </Button>
                            </Flex>
                        </form>
                ) : (
                    <>
                        <Text fontSize={'2xl'} fontWeight='normal'>
                            {editSection.heading}
                        </Text>
                        { sectionProp.isOwner && !editMode &&
                            <Flex alignItems={'center'} fontSize='larger' cursor='pointer'>
                                <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                            </Flex>
                        }
                    </>
                )
                }
            </Flex>
            { editMode ? (
                <form onSubmit={(e)=>handleEditSection(e)} style={{display: 'flex', gap: '0.75rem'}}>
                    <Textarea value={editSection.content} resize='none' height={'10rem'} 
                    onChange={(e)=>setEditSection({
                        heading: editSection.heading,
                        content: e.target.value
                    })}/>
                </form>
            ) : (
                <Box pl={'0.5rem'} pr={'0.5rem'} mt='0.5rem'>
                        {editSection.content}
                </Box>
            )
            }
            { sectionProp.isOwner &&
                <Box>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'} bg='#D0D0D0' borderRadius='50%' overflow={'hidden'}>
                        <Input type={'file'} onChange={handleUploadFile} display={'none'} ref={fileInputRef}/>
                    </Box>
                    <Text as={'u'} width={'5rem'} onClick={()=>fileInputRef.current?.click()} mt={'1em'} p={'0.7em'} borderRadius={'0.375em'} cursor={'pointer'} color='#0194F3' fontSize={'xs'} fontWeight={'semibold'}>
                        Upload file
                    </Text>
                </Box>
            }
            <Flex id='files-list' flexDir={'column'}>
                { files &&
                    files.map((file) => (
                        <Flex pl={'0.5rem'} mt='1rem' mb='1rem' alignItems={'center'} gap='0.25rem'>
                            <AiFillFile/>
                            <Text>File name</Text>
                        </Flex>
                    ))
                }
            </Flex>

        </Box>
    )
}

export const SectionList = ({sections}: {sections: Section[] | null}) => {
    return (
        <Flex flexDir={'column'} alignItems={'center'} mt='0.25rem' mb={'1.5rem'} id='sectionlist'>
            {
                sections && sections.length > 0 ? (
                    <Box width={'100%'}>
                        {
                            sections.map((section)=>(
                                <SingleSectionTile key={section.id} section={section} isOwner={true} /> //TODO: isOwner to be changed
                            ))
                        }
                    </Box>
                ) : (
                    <Text width='100%'>No sections available</Text>
                )
            }
        </Flex>
    )
}
import { Box, Button, Flex, Image, Input, Link, Text, Textarea } from '@chakra-ui/react'
import { AiFillEdit, AiOutlineCheck, AiFillFile } from 'react-icons/ai'
import React, { useRef, useState } from 'react'
import { Group, ModelFile, Section } from '../../adapter/api/__generated';
import { RxCross1 } from 'react-icons/rx';
import profile_empty  from '../../assets/profile_empty.png'
import axios from 'axios';
import { IoTrash } from 'react-icons/io5';
import { useApiClient } from '../../adapter/api/useApiClient';

interface SectionProps {
    section: Section;
    deleteHandler: (sectionID: string) => void;
    updateHandler: (e: React.FormEvent<HTMLFormElement>, section: Section, setEditMode: React.Dispatch<React.SetStateAction<boolean>>) => void;
    isOwner: boolean;
}

const SingleSectionTile = (sectionProp: SectionProps) => {
    const [editMode, setEditMode] = useState(false);
    const [editSection, setEditSection] = useState<Section>(sectionProp.section);
    const [files, setFiles] = useState<ModelFile[]>(sectionProp.section.files!)
    const MAX_FILE_SIZE = 5242880;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const apiClient = useApiClient()
    
    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if(e.target.files){
            console.log("File: ", e.target.files)
            const inputedFile = e.target.files[0];
            if(inputedFile.size > MAX_FILE_SIZE){
                alert("file size too big")
            }
            else {
                //posting file to server's file folder
                const updatedSection = await apiClient.postSectionFile(sectionProp.section.id!, inputedFile)
                setFiles(updatedSection.data.files!);
            }
          }
    }


    return (
        <Box mt={'1.5rem'} mb='1.5rem'>
            <Flex 
            borderBottom={'solid 0.075rem'}
            borderBottomColor={'#0194F3'}
            pl={'0.5rem'} pr={'0.5rem'}
            justifyContent='space-between'
            >
                { editMode ? (
                        <form onSubmit={(e)=>sectionProp.updateHandler(e, editSection, setEditMode)} style={{display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'space-between'}}>
                            <Input value={editSection.heading} onChange={(e)=>setEditSection({
                                id: editSection.id,
                                heading: e.target.value,
                                description: editSection.description,
                                text: editSection.text
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
                            <Flex alignItems={'center'} fontSize='larger' gap={'1rem'}>
                                <AiFillEdit onClick={()=>setEditMode(!editMode)}  cursor='pointer'/>
                                <IoTrash color='red' cursor='pointer' onClick={()=>sectionProp.deleteHandler(sectionProp.section.id!)}/>
                            </Flex>
                        }
                    </>
                )
                }
            </Flex>
            { editMode ? (
                <form onSubmit={(e)=>sectionProp.updateHandler(e, editSection, setEditMode)} style={{display: 'flex', gap: '0.75rem'}}>
                    <Textarea value={editSection.description} resize='none' height={'10rem'} 
                    onChange={(e)=>setEditSection({
                        id: editSection.id,
                        heading: editSection.heading,
                        description: e.target.value,
                        text: editSection.text
                    })}/>
                </form>
            ) : (
                <Box pl={'0.5rem'} pr={'0.5rem'} mt='0.5rem'>
                        {editSection.description}
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
                        <Flex key={file.id} pl={'0.5rem'} mt='1rem' mb='1rem' alignItems={'center'} gap='0.25rem'>
                            <Link href={`http://localhost:4000/upload/files/${sectionProp.section.id}/${file.name}`} target='_blank'>
                                <Flex alignItems={'center'} gap='0.25rem'>
                                    <AiFillFile/>
                                    <Text>{file.name}</Text>
                                </Flex>
                            </Link>
                        </Flex>
                    ))
                }
            </Flex>

        </Box>
    )
}

interface SectionListProps {
    group: Group | null;
    sections: Section[] | undefined;
    setSections: React.Dispatch<React.SetStateAction<Section[] | undefined>>;
    isOwner: boolean
}

export const GroupSectionList = ({group, sections, setSections, isOwner}: SectionListProps) => {
    const apiClient = useApiClient();

    const handleDeleteSection = async (sectionID: string) => {        
        await apiClient.deleteSectionGroup(group!.id!, sectionID)
        .then(async ()=>{
            setSections(sections!.filter((iterateSection) => sectionID !== iterateSection.id))
        })
        .catch((e)=>console.log(e))
    }

    const handleUpdateSection = async (e: React.FormEvent<HTMLFormElement>, section: Section, setEditMode: React.Dispatch<React.SetStateAction<boolean>>) => {
        e.preventDefault()
        await apiClient.putSectionGroup(group!.id!, section.id!, section)
        .then(()=>{
            setEditMode(false)
        })
    }

    return (
        <Flex flexDir={'column'} alignItems={'center'} mt='0.25rem' mb={'1.5rem'} id='sectionlist'>
            {
                group && sections && sections.length > 0 ? (
                    <Box width={'100%'}>
                        {
                            sections
                            .sort((a, b) => a.createdAt! > b.createdAt! ? 1 : -1)
                            .map((section)=>(
                                section && section.id &&
                                <SingleSectionTile key={section.id} section={section} isOwner={isOwner} updateHandler={handleUpdateSection} deleteHandler={handleDeleteSection} />
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
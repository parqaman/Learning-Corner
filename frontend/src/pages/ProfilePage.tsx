import {Box, Button, Heading, Text, Image, Input, Flex, Spinner} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { ProfileCard } from '../components/ProfileCard'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import { User } from '../adapter/api/__generated'
import { useApiClient } from '../adapter/api/useApiClient'
import { useNavigate } from 'react-router-dom'
import {useReducedMotion} from "framer-motion";

interface ProfileProps {
  description: string,
  data: string | undefined,
  edit: boolean,
  editDetail: {
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
  },
  setEditDetail: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
  }>>
  editHandler: (e: React.FormEvent)=>void
}

const ProfileDetailTile = ({description, data, edit, editDetail, setEditDetail, editHandler}: ProfileProps) => {
    return (
      <Box p='0.25rem 0.5rem 0.5rem 0.5rem' border={'solid 0.075rem'} borderRadius='0.25rem' borderColor={'rgba(0, 0, 0, 30%)'}>
        <Text color={'rgba(0, 0, 0, 65%)'} fontSize='xs' pb={'0.1rem'}>
          {description}:
        </Text>
        {
          edit? (
            <form onSubmit={(e)=>editHandler(e)}>
              {
                description == "First name" &&
                <Input autoFocus={true} isRequired value={editDetail.firstName} onChange={(e)=>setEditDetail({firstName: e.target.value, lastName: editDetail.lastName, email: editDetail.email, photo: editDetail.photo})} variant={'unstyled'}/>
              }
              {
                description == "Last name" &&
                <Input isRequired value={editDetail.lastName} onChange={(e)=>setEditDetail({firstName: editDetail.firstName, lastName: e.target.value, email: editDetail.email, photo: editDetail.photo})} variant={'unstyled'}/>
              }
              {
                description == "Email" &&
                  <Input isRequired value={editDetail.email} onChange={(e)=>setEditDetail({firstName: editDetail.firstName, lastName: editDetail.lastName, email: e.target.value, photo: editDetail.photo})} variant={'unstyled'} type={'email'}/>
              }
            </form>
          ) :
            <Text>
                {data}
            </Text>
        }
      </Box>
    );
}

export const ProfilePage = () => {
  const useLogout = useAuth().actions.logout;
  const apiClient = useApiClient()
  const navigate = useNavigate()
  const MAX_FILE_SIZE = 1048576;

  //use state for input of attributes
  const [editDetail, setEditDetail] = useState({
    firstName: "", lastName: "", email: "", photo: ""
  });  

  //state for edit mode
  const [edit, setEdit] = useState(false);

  //state for uploading profile photo
  const [photo, setPhoto] = useState("");
  const [photoRaw, setPhotoRaw] = useState<File>();

  const [user, setUser] = useState<User | null>(useAuth().user)

  //referencing input type file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    if(user){
      const fetchedUser = await apiClient.getUsersId(user.id)      
      setUser(fetchedUser.data);
      //setPhoto(fetchedUser.data.photo);

      setEditDetail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photo: user.photo
      })
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (e: React.FormEvent) => {    
    if(user){
      user.firstName = editDetail.firstName;
      user.lastName = editDetail.lastName;
      user.email = editDetail.email;

      setEditDetail({
        firstName: editDetail.firstName,
        lastName: editDetail.lastName,
        email: editDetail.email,
        photo: user?.photo
      })

      const data = await apiClient.putUsersId(user.id, user.id, user.firstName, user.lastName, user.email, photoRaw);
    }
    setEdit(!edit);
  }

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      const inputedPhoto = e.target.files[0];
      if(inputedPhoto.size > MAX_FILE_SIZE){
        alert("file size too big")
      }
      else {
        setPhotoRaw(inputedPhoto);
        const reader = new FileReader()
        reader.readAsDataURL(inputedPhoto);
        reader.onload = () => {
          if(reader.result){
            setPhoto(reader.result.toString());
          }
        }
      }
    }
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(user){
      await apiClient.deleteUsersId(user.id);
      useLogout()
    }
  }

  const ProfilePhoto = () => {
    if(photo){
      return (
          <Image src={ photo } h={'7.5rem'} w={'7.5rem'} objectFit={'cover'}/>
      )
    }
    if(user?.photo){
      return (
          <Image src={ 'http://localhost:4000/upload/tmp/' + user?.photo } h={'7.5rem'} w={'7.5rem'} objectFit={'cover'}/>
      )
    }
    return <Spinner/>
  }

  return (
    <AppLayout display={'flex'} flexDir='column' alignItems='center' mt={'3rem'}>
      <ProfileCard>
        <Heading fontSize={'5xl'}>
          My Profile
        </Heading>
        {
            <>
              <Box display={'flex'} justifyContent='center' flexDir={'column'} alignItems='center'>
                {
                  edit ? (
                    <>
                      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'} bg='#D0D0D0' borderRadius='50%' overflow={'hidden'}>
                        <ProfilePhoto/>
                        <Input type={'file'} accept='image/png, image/jpeg, image/gif' onChange={handleUploadPhoto} display={'none'} ref={fileInputRef}/>
                      </Box>
                      <Text onClick={()=>fileInputRef.current?.click()} mt={'1em'} p={'0.7em'} borderRadius={'0.375em'} cursor={'pointer'} size='xs' bg={'black'} color='#D0D0D0' fontSize={'x-small'} fontWeight={'semibold'}>
                        Upload image
                      </Text>
                    </>
                  ) : (
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'} bg='#D0D0D0' borderRadius='50%' overflow={'hidden'}>
                      <ProfilePhoto/>
                    </Box>
                  )
                }
              </Box>
              <ProfileDetailTile description='First name' data={user?.firstName} edit={edit} editDetail={editDetail} setEditDetail={setEditDetail} editHandler={handleEdit}/>
              <ProfileDetailTile description='Last name' data={user?.lastName} edit={edit} editDetail={editDetail} setEditDetail={setEditDetail} editHandler={handleEdit}/>
              <ProfileDetailTile description='Email' data={user?.email} edit={edit} editDetail={editDetail} setEditDetail={setEditDetail} editHandler={handleEdit}/>
            </>
        }
        <Box display={'flex'} justifyContent='space-between'>
            {
              !edit ?
              (
                <Button onClick={()=>setEdit(!edit)} variant={'solid'} _hover={{}} _active={{}} size='sm' bg={'black'} color='white' fontWeight={'medium'}>
                  Edit
                </Button>
              ) : (
                <Flex justifyContent={'space-between'} width='100%'>
                  <Flex gap={'0.25rem'}>
                    <Button onClick={(e)=>handleEdit(e)} variant={'solid'} _hover={{}} _active={{}} size='sm' bg={'black'} color='white' fontWeight={'medium'}>
                      Done
                    </Button>
                    <Button onClick={()=>setEdit(false)} variant={'solid'} _hover={{}} _active={{}} size='sm' bg={'gray'} color='white' fontWeight={'medium'}>
                        Cancel
                    </Button>
                  </Flex>
                  <Text color={'rgba(220, 0, 0, 100%)'} onClick={()=>{navigate('./resetpassword'); setEdit(!edit)}} cursor='pointer' fontSize='xs' fontWeight={'medium'} pb={'0.1rem'} pt={'0.5em'}>
                    Reset password
                  </Text>
                </Flex>
              )
            }
          {!edit &&
            <Button onClick={(e)=>handleDelete(e)} variant={'link'} color='red' _active={{}} size={'sm'}>
              Delete account
            </Button>}
          {!edit && <Button onClick={useLogout} variant={'solid'} _hover={{}} _active={{}} size='sm' bg={'#DC0000'} color='white' fontWeight={'medium'}>Logout</Button>}
        </Box>
      </ProfileCard>
    </AppLayout>
  )
}

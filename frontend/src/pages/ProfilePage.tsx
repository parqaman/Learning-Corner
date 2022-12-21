import { Box, Button, Heading, Text, Image, Input } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { ProfileCard } from '../components/ProfileCard'
import { AppLayout } from '../layout/AppLayout'
import { useAuth } from '../providers/AuthProvider'
import profile_empty from '../assets/profile_empty.png'

interface ProfileProps {
  description: string,
  data: string,
  edit: boolean,
  editDetail: {
    firstName: string;
    lastName: string;
    email: string;
    newPassword: string;
    image: string;
  },
  setEditDetail: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    newPassword: string;
    image: string;
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
                <Input autoFocus={true} isRequired value={editDetail.firstName} onChange={(e)=>setEditDetail({firstName: e.target.value, lastName: editDetail.lastName, email: editDetail.email, newPassword: editDetail.newPassword, image: editDetail.image})} variant={'unstyled'}/>
              }
              {
                description == "Last name" &&
                <Input isRequired value={editDetail.lastName} onChange={(e)=>setEditDetail({firstName: editDetail.firstName, lastName: e.target.value, email: editDetail.email, newPassword: editDetail.newPassword, image: editDetail.image})} variant={'unstyled'}/>
              }
              {
                description == "Email" &&
                <>
                  <Input isRequired value={editDetail.email} onChange={(e)=>setEditDetail({firstName: editDetail.firstName, lastName: editDetail.lastName, email: e.target.value, newPassword: editDetail.newPassword, image: editDetail.image})} variant={'unstyled'} type={'email'}/>
                  {/* <Text color={'rgba(0, 0, 0, 65%)'} fontSize='xs' pb={'0.1rem'} pt={'0.5em'}>
                    New password:
                  </Text>
                  <Input isRequired value={editDetail.newPassword} onChange={(e)=>setEditDetail({firstName: editDetail.firstName, lastName: editDetail.lastName, email: editDetail.email, newPassword: e.target.value, image: editDetail.image})} variant={'unstyled'} type={'password'}/> */}
                </>
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
  const user = useAuth().user

  //use state for profile attributes
  const [profileDetails, setProfileDetails] = useState({
    firstName: "", lastName: "", email: "", image: ""
  });

  //use state for input of attributes
  const [editDetail, setEditDetail] = useState({
    firstName: "", lastName: "", email: "", newPassword: "", image: ""
  });  

  //state for edit mode
  const [edit, setEdit] = useState(false);

  //state for uploading profile image
  const [image, setImage] = useState("");

  //referencing input type file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = () => {
    if(user){
      image == "" ? setImage(profile_empty) : setImage(image)
      user.image = profile_empty; //later to be changed with image from backend
      setProfileDetails({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image
      })

      setEditDetail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        newPassword: "",
        image: user.image
      })
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();    

    setProfileDetails({
      firstName: editDetail.firstName,
      lastName: editDetail.lastName,
      email: editDetail.email,
      image: image
    });

    setEditDetail({
      firstName: editDetail.firstName,
      lastName: editDetail.lastName,
      email: editDetail.email,
      newPassword: "", //new password input always starts with an empty string
      image: image
    })

    setEdit(!edit);
    
    //TODO: send update to backend
  }

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("image uploaded");
    console.log(e.target.files);
    if(e.target.files){
      const image = e.target.files[0];
      const reader = new FileReader()
      reader.readAsDataURL(image);
      reader.onload = () => {
        console.log(reader.result);
        if(reader.result){
          setImage(reader.result.toString());
        }
      }
      }
  }

  return (
    <AppLayout>
      <ProfileCard>
        <Heading>
          My Profile
        </Heading>
        {
            <>
              <Box display={'flex'} justifyContent='center' flexDir={'column'} alignItems='center'>
                {
                  edit ? (
                    <>
                      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'} bg='#D0D0D0' borderRadius='50%' overflow={'hidden'}>
                        <Image src={image} maxH={'6.5rem'} objectFit={'cover'}/>
                        <Input type={'file'} accept='image/png, image/jpeg, image/gif' onChange={handleUploadImage} display={'none'} ref={fileInputRef}/>
                      </Box>
                      <Text onClick={()=>fileInputRef.current?.click()} mt={'1em'} p={'0.7em'} borderRadius={'0.375em'} cursor={'pointer'} size='xs' bg={'black'} color='#D0D0D0' fontSize={'x-small'} fontWeight={'light'}>
                        Upload image
                      </Text>
                    </>
                  ) : (
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'} bg='#D0D0D0' borderRadius='50%' overflow={'hidden'}>
                      <Image src={image} maxH={'6.5rem'} objectFit={'cover'}/>
                    </Box>
                  )
                }
              </Box>
              <ProfileDetailTile description='First name' data={profileDetails.firstName} edit={edit} editDetail={editDetail} setEditDetail={setEditDetail} editHandler={handleEdit}/>
              <ProfileDetailTile description='Last name' data={profileDetails.lastName} edit={edit} editDetail={editDetail} setEditDetail={setEditDetail} editHandler={handleEdit}/>
              <ProfileDetailTile description='Email' data={profileDetails.email} edit={edit} editDetail={editDetail} setEditDetail={setEditDetail} editHandler={handleEdit}/>
            </>
        }
        <Box display={'flex'} justifyContent='space-between'>
          <Box>
            {
              !edit ?
              (
                <Button onClick={()=>setEdit(!edit)} variant={'solid'} _hover={{}} _active={{}} size='sm' bg={'black'} color='white' fontWeight={'medium'}>
                  Edit
                </Button>
              ) : (
                <Button onClick={(e)=>handleEdit(e)} variant={'solid'} _hover={{}} _active={{}} size='sm' bg={'black'} color='white' fontWeight={'medium'}>
                  Done
                </Button>
              )
            }
          </Box>
          {!edit && <Button variant={'link'} color='red' _active={{}} size={'sm'}>Delete account</Button>}
          {!edit && <Button onClick={useLogout} variant={'solid'} _hover={{}} _active={{}} size='sm' bg={'#DC0000'} color='white' fontWeight={'medium'}>Logout</Button>}
        </Box>
      </ProfileCard>
    </AppLayout>
  )
}

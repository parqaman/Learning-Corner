import { Box, Flex, Heading, HTMLChakraProps, Input, ModalContent, Text, Textarea } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { BsFillChatDotsFill } from 'react-icons/bs'
import { AiOutlineMinus } from 'react-icons/ai';
import { BiSend } from 'react-icons/bi';


const remToPixel = (val: any) => {
  return val * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const ActionOpen = () => {

  const rem25 = remToPixel(25) + "px";
  const rem4 = remToPixel(4) + "px";

  const theCourseCard = document.getElementById("course-card");
  const chatArea = document.getElementById("chat-area")
  const chatWindow = document.getElementById("chat-window")
  const chatButton = document.getElementById("chat-disclosure-button")
  const chatContents = document.getElementById("chat-contents")
  if(theCourseCard && chatArea && chatWindow && chatButton && chatContents){
    theCourseCard.style.marginRight = rem25;
    chatArea.style.right = rem4
    chatWindow.hidden = false
    chatButton.hidden = true
    chatArea.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.15)'
    chatArea.style.position = 'fixed'
    chatContents.scrollTop = chatContents.scrollHeight
  }
}

const ActionClose = () => {
  const rem10 = remToPixel(10) + "px";

  const theCourseCard = document.getElementById("course-card");
  const chatArea = document.getElementById("chat-area")
  const chatButton = document.getElementById("chat-disclosure-button")
  const chatWindow = document.getElementById("chat-window")
  if(theCourseCard && chatArea && chatButton && chatWindow){
    theCourseCard.style.marginRight = "0";
    chatArea.style.right = rem10;
    chatButton.hidden = false
    chatWindow.hidden = true;
    chatArea.style.boxShadow = '0 0 rgba(0, 0, 0, 0)';
    chatArea.style.position = 'static'
  }
}

const mockup_chat = [
  {
    "id": 1,
    "content": "hallo"
  },
  {
    "id": 2,
    "content": "mein"
  },
  {
    "id": 3,
    "content": "name"
  },
  {
    "id": 4,
    "content": "ist"
  },
  {
    "id": 5,
    "content": "jsadscnvjfpodenkvwdjfdqknldsjvipd asdoiasnklf avpfnkwel mvdsnf andspckl vwfenqpsdk wefpinvdkl wefnqpadc adsnpkqwdeaf"
  },
  {
    "id": 6,
    "content": "hallo"
  },
  {
    "id": 7,
    "content": "mein"
  },
  {
    "id": 8,
    "content": "name"
  },
  {
    "id": 9,
    "content": "ist"
  },
  {
    "id": 10,
    "content": "jsadscnvjfpodenkvwdjfdqknldsjvipd asdoiasnklf avpfnkwel mvdsnf andspckl vwfenqpsdk wefpinvdkl wefnqpadc adsnpkqwdeaf"
  },
]

export const OutcomingSingleChatTile = ({content}: {content: string}) => {
  return(
    <Flex m={'0.75rem auto'} justifyContent={'flex-start'}>
      <Flex flexDir='column' display={'inline-flex'} alignItems='flex-start'>
        <Text
        bg='#E2E8F0'
        p='0.25rem 0.75rem'
        borderRadius={'0 1.2rem 1.2rem 1.2rem'}
        >
          {content}
        </Text>
        <Text as={'span'} alignSelf={'flex-end'} p='0rem 0.5rem' fontSize={'small'} color={'rgba(0, 0, 0, 0.85)'} >
          Farouq
        </Text>
      </Flex>
    </Flex>
  )
}

export const IncomingSingleChatTile = ({content}: {content: string}) => {
  return(
    <Flex m={'0.75rem auto'} justifyContent={'flex-end'}>
      <Flex flexDir='column' display={'inline-flex'} alignItems='flex-end'>
        <Text
        bg='#D5D8DC'
        p='0.25rem 0.75rem'
        borderRadius={'1.2rem 0 1.2rem 1.2rem'}
        flex={1}
        >
          {content}
        </Text>
        <Text as={'span'} alignSelf={'flex-end'} p='0rem 0.5rem' fontSize={'small'} color={'rgba(0, 0, 0, 0.85)'} >
          Farouq
        </Text>
      </Flex>
    </Flex>
  )
}

export const ChatDisclosureButton = (buttonProps: HTMLChakraProps<"div">) => {
  return (
    <Text
      id='chat-disclosure-button'
      bg={'white'}
      p='1rem'
      fontSize={'1.5rem'}
      color='#0194F3'
      onClick={()=>ActionOpen()}
      cursor='pointer'
      borderRadius={'1rem'}
      boxShadow={'0 0.125rem 0.25rem rgba(0, 0, 0, 0.15)'}    
    >
        <BsFillChatDotsFill/>
    </Text>
  )
}

export const ChatWindow = (disclosureProps: any) => {
  return (
    <Flex
    id='chat-window'
    bg='white'
    height={'100%'}
    hidden={true}
    width={'25rem'}
    maxWidth={'25rem'}
    padding={'0.5rem 1.5rem 1rem 1.5rem'}
    flexDir='column'
    >
      <Flex 
        alignItems={'center'}
        justifyContent='space-between'
        borderBottom={'0.08rem solid #0194F3'}
      >
        <Text fontSize={'3xl'} fontWeight={'bold'}>
          Chat
        </Text>
        <Text bg={'#F56565'} borderRadius='100%' p={'0.35rem'} fontSize={'xl'} alignItems='center' cursor={'pointer'} onClick={()=>ActionClose()} >
          <AiOutlineMinus/>
        </Text>
      </Flex>
      <Text
          id='chat-contents'
          maxH={'31rem'}
          overflowY='scroll'
          m='0.5rem auto'
          flex={1}
          width={'100%'}
      >
        {
          mockup_chat.map((val)=>(
            <>
              <OutcomingSingleChatTile key={val.id} content={val.content} />
              <IncomingSingleChatTile key={val.id} content={val.content} />
            </>
          ))
        }
      </Text>
      <Flex
        columnGap={'0.5rem'}
        borderRadius='2rem'
        p={'0.5rem'}
        alignItems={'center'}
        bg='#E2E8F0'
        bottom={'0'}
      >
        <Textarea 
        alignItems={'center'} 
        minH={'0rem'}
        p={'0 0 0 0.5rem'}
        height='1.25rem'
        lineHeight='1' 
        resize='none' 
        width={'90%'} 
        variant='unstyled'/>
        <Text fontSize={'2xl'} cursor={'pointer'} alignSelf='center' bg={'#0194F3'} p='0.25rem' borderRadius={'100%'} >
          <BiSend/>
        </Text>
      </Flex>
    </Flex>
  )
}
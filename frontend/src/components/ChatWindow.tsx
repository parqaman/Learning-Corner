import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { BsFillChatDotsFill } from 'react-icons/bs'
import { AiOutlineMinus } from 'react-icons/ai';
import { BiSend } from 'react-icons/bi';


const remToPixel = (val: any) => {
  return val * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const ActionOpen = (cardID: string) => {

  const rem25 = remToPixel(25) + "px";
  const rem4 = remToPixel(4) + "px";

  const theCard = document.getElementById(cardID);
  const chatArea = document.getElementById("chat-area")
  const chatWindow = document.getElementById("chat-window")
  const chatButton = document.getElementById("chat-disclosure-button")
  const chatContents = document.getElementById("chat-contents")
  if(theCard && chatArea && chatWindow && chatButton && chatContents){
    theCard.style.marginRight = rem25;
    chatArea.style.right = rem4
    chatWindow.hidden = false
    chatButton.hidden = true
    chatArea.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.15)'
    chatArea.style.position = 'fixed'
    chatContents.scrollTop = chatContents.scrollHeight
  }
}

export const ActionClose = (cardID: string) => {
  const rem10 = remToPixel(10) + "px";  

  const theCard = document.getElementById(cardID);
  const chatArea = document.getElementById("chat-area")
  const chatButton = document.getElementById("chat-disclosure-button")
  const chatWindow = document.getElementById("chat-window")
  if(theCard && chatArea && chatButton && chatWindow){
    theCard.style.marginRight = "0";
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

export const IncomingSingleChatTile = ({content}: {content: string}) => {
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
        <Text as={'span'} alignSelf={'flex-start'} p='0rem 0.5rem' fontSize={'small'} color={'rgba(0, 0, 0, 0.85)'} >
          Admin
        </Text>
      </Flex>
    </Flex>
  )
}

export const OutcomingSingleChatTile = ({content}: {content: string}) => {
  return(
    <Flex m={'0.75rem auto'} justifyContent={'flex-end'}>
      <Flex flexDir='column' display={'inline-flex'} alignItems='flex-end'>
        <Text
        bg='#D5D8DC'
        p='0.25rem 0.75rem'
        borderRadius={'1.2rem 1.2rem 0 1.2rem'}
        flex={1}
        >
          {content}
        </Text>
        <Text as={'span'} alignSelf={'flex-end'} p='0rem 0.5rem' fontSize={'small'} color={'rgba(0, 0, 0, 0.85)'} >
          You
        </Text>
      </Flex>
    </Flex>
  )
}

export const ChatDisclosureButton = ({cardID}: {cardID: string}) => {
  return (
    <Text
      id='chat-disclosure-button'
      bg={'white'}
      p='1rem'
      fontSize={'1.5rem'}
      color='#0194F3'
      onClick={()=>ActionOpen(cardID)}
      cursor='pointer'
      borderRadius={'1rem'}
      boxShadow={'0 0.125rem 0.25rem rgba(0, 0, 0, 0.15)'}    
    >
        <BsFillChatDotsFill/>
    </Text>
  )
}

export const ChatWindow = ({cardID}: {cardID: string}) => {
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
        <Text bg={'#F56565'} borderRadius='100%' p={'0.35rem'} fontSize={'xl'} alignItems='center' cursor={'pointer'} onClick={()=>ActionClose(cardID)} >
          <AiOutlineMinus/>
        </Text>
      </Flex>
      <Box
          id='chat-contents'
          maxH={'31rem'}
          overflowY='scroll'
          m='0.5rem auto'
          flex={1}
          width={'100%'}
      >
        {
          mockup_chat.map((val)=>(
            <Box key={val.id}>
              <OutcomingSingleChatTile content={val.content} />
              <IncomingSingleChatTile content={val.content} />
            </Box>
          ))
        }
      </Box>
      <Flex
        columnGap={'0.5rem'}
        borderRadius='2rem'
        p={'0.5rem'}
        alignItems={'center'}
        bg='#E2E8F0'
        bottom={'0'}
      >
        <Input 
        alignItems={'center'}
        pl='0.5rem'
        variant='unstyled'/>
        <Text fontSize={'2xl'} cursor={'pointer'} alignSelf='center' bg={'#0194F3'} p='0.25rem' borderRadius={'100%'} >
          <BiSend/>
        </Text>
      </Flex>
    </Flex>
  )
}
import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { BsFillChatDotsFill } from 'react-icons/bs'
import { AiOutlineMinus } from 'react-icons/ai';
import { BiSend } from 'react-icons/bi';
import {useEffect, useState} from "react";
import * as io from "socket.io-client";
import {Socket} from "socket.io-client";
import {useAuth} from "../providers/AuthProvider";
import {User} from "../adapter/api/__generated";
import {KeyboardEvent} from "react"


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

export const IncomingSingleChatTile = ({message}: { message: ChatMessage }) => {
  return(
    <Flex m={'0.75rem auto'} justifyContent={'flex-start'}>
      <Flex flexDir='column' display={'inline-flex'} alignItems='flex-start'>
        <Text
        bg='#E2E8F0'
        p='0.25rem 0.75rem'
        borderRadius={'0 1.2rem 1.2rem 1.2rem'}
        >
          {message.message}
        </Text>
        <Text as={'span'} alignSelf={'flex-start'} p='0rem 0.5rem' fontSize={'small'} color={'rgba(0, 0, 0, 0.85)'} >
          {message.sender.firstName} - {new Date(message.time).toLocaleTimeString()}
        </Text>
      </Flex>
    </Flex>
  )
}

export const OutcomingSingleChatTile = ({message}: { message: ChatMessage }) => {
  return(
    <Flex m={'0.75rem auto'} justifyContent={'flex-end'}>
      <Flex flexDir='column' display={'inline-flex'} alignItems='flex-end'>
        <Text
        bg='#D5D8DC'
        p='0.25rem 0.75rem'
        borderRadius={'1.2rem 1.2rem 0 1.2rem'}
        flex={1}
        >
          {message.message}
        </Text>
        <Text as={'span'} alignSelf={'flex-end'} p='0rem 0.5rem' fontSize={'small'} color={'rgba(0, 0, 0, 0.85)'} >
          You - {new Date(message.time).toLocaleTimeString()}
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

interface ChatMessage {
  message: string
  time: number,
  sender: User
}

export const ChatWindow = ({cardID, roomID}: {cardID: string, roomID: string}) => {

  const auth = useAuth();
  const user = auth.user as User;
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState<string>('')

  const scrollToBottom = () => {
    const lM = messages[messages.length - 1];
    if(lM){
      const lastMessage = document.getElementById(lM.time.toString())
      lastMessage?.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    if(!socket) {
      let s = io.connect('http://localhost:4000', {
        auth:{
          user: user,
          token: auth.accessToken
        }
      });
      setSocket(s)
    } else {
      if(!socket.connected) socket.connect();
      socket.on('connect',() =>{
        socket.emit("helloRoom", {user: user, room: roomID})
      });

      socket.on('message', (args: ChatMessage) => {
        console.log('message:', args)
        setMessages((messages) => {
          return [...messages, args]
        })
      });
    }
    return () => {
      socket?.disconnect();
    }
  }, [socket])

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  function handleEnterKeyPress<T = Element>(f: () => void){
    return handleKeyPress<T>(f, "Enter")
  }

  function handleKeyPress<T = Element>(f: () => void, key: string){
    return (e: KeyboardEvent<T>) => {
      if(e.key === key){
        f()
      }
    }
  }
  const handleOnClick = () => {
    if(!newMessage) return;
    socket?.emit("message", {room: roomID, message: newMessage})
    setNewMessage('')
  }

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
          overflowY='scroll'
          m='0.5rem auto'
          flex={1}
          width={'100%'}
      >
        {
          messages.map((val)=>(
            <Box key={val.time} id={val.time.toString()}>
              {val.sender.id === user.id ? <OutcomingSingleChatTile message={val} /> : <IncomingSingleChatTile message={val} /> }
            </Box>
          ))
        }
      </Box>
      <Flex
        columnGap={'0.5rem'}
        borderRadius='2rem'
        p={'0.5rem'}
        alignItems={'center'}
        bg='#D5D8DC'
        bottom={'0'}
      >
        <Input 
        alignItems={'center'}
        pl='0.5rem'
        variant='unstyled'
        value={newMessage}
        onChange={(args) => setNewMessage(args.target.value)}
        onKeyDown={handleEnterKeyPress(handleOnClick)}
        />
        <Text fontSize={'2xl'} cursor={'pointer'} alignSelf='center' bg={'#0194F3'} p='0.25rem' borderRadius={'100%'} >
          <BiSend onClick={handleOnClick}/>
        </Text>
      </Flex>
    </Flex>
  )
}
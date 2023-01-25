import React, { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { Box } from '@chakra-ui/react'
import 'quill/dist/quill.snow.css'
import * as io from "socket.io-client";
import {Socket} from "socket.io-client";
import { useAuth } from '../providers/AuthProvider'
import { Message, User } from '../adapter/api/__generated'
import { useParams } from 'react-router-dom';


const TOOLBAR_OPTIONS = [
  [{header: [1, 2, 3, 4, 5, 6, 7, 8, false]}],
  [{font: []}],
  [{'list': 'ordered'}, {'list': 'bullet' }],
  [{script: "sub"}, {script: "super"}],
  ["image", "blockquote", "code-block"],
]

const SAVE_INTERVAL_MS = 2000

export const TextEditor = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [quill, setQuill] = useState<Quill | null>(null)
  const auth = useAuth();
  const user = auth.user as User;
  const { groupID } = useParams()  
  
  const wrapperRef = useCallback((wrapper: any)=>{
    if(!wrapper) return

    wrapper.innerHTML = ""
    const editor = document.createElement('div')
    wrapper.append(editor)
    const q = new Quill(editor, {theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS}})
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])

  useEffect(()=>{
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
    }
    return () => {
      socket?.disconnect();
    }
  }, [socket])

  useEffect(() => {
    if(!quill || !socket) return
    
    const handler = (delta: any) => {
      quill.updateContents(delta)
    }
    
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if(!quill) return

    const handler = (delta: any, oldDelta: any, source: any) => {
      if(source !== "user" || !socket) return
      socket.emit("send-changes", delta)
    }

    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if(!socket || !quill || !groupID) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })
    
    socket.emit("get-document", groupID)

  }, [socket, quill, groupID])

  useEffect(() => {
    if(!socket || !quill) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  return (
    <Box className='quill-container' bg={'#F3F3F3'} ref={wrapperRef}></Box>
  )
}

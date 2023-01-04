import { Box, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useApiClient } from '../adapter/api/useApiClient'
import { Course } from '../adapter/api/__generated/api'
import { useAuth } from '../providers/AuthProvider'

export const MockupCourses = () => {
    const user = useAuth().user!
    const apiClient = useApiClient()
    const mockCourses: Course[] = [
        {
          id: '1',
          name: "Advanced Web Development",
          lecturer: user,
          description: "Description 1"
        },
        {
          id: '2',
          name: "Graphische Datenverarbeitung",
          lecturer: user,
          description: "Description 2"
        },
        {
          id: '3',
          name: "Datenbanken 2",
          lecturer: user,
          description: "Description 3"
        },
        {
          id: '4',
          name: "Data Warehouse Techonologien",
          lecturer: user,
          description: "Description 4"
        },
        {
          id: '5',
          name: "Unix for Developers",
          lecturer: user,
          description: "Description 5"
        },
        {
          id: '6',
          name: "Programmieren Algorithmen und Datenstruktur",
          lecturer: user,
          description: "Description 6"
        },
    ]

    const handleFillCourse = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        mockCourses.map(async (course) => {
            const res = await apiClient.postCourses(course)
        })
        window.location.reload()
    }

    const [show, setShow] = useState(true)
    const getCourses = async () => {
      const res = await apiClient.getCourses()
      const courses: Course[] = res.data;

      if(courses.length > 0){
        setShow(false)
      }
      else{
        setShow(true)
      }
    }

    useEffect(()=>{
      getCourses()
    })
      

  return (
    <Box>
      {
        show && <Button onClick={(e)=>handleFillCourse(e)}>
            Fill courses
        </Button>
      }
    </Box>
  )
}

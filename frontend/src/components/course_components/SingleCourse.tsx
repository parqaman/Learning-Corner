import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../adapter/api/__generated/api';
import { BsCircleFill } from 'react-icons/bs';
import { useAuth } from '../../providers/AuthProvider';

export const SingleCourse = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  const currentUser = useAuth().user;

  return (
    <Box
      bg={'white'}
      p="0.75rem"
      boxShadow={'0 0 0.25rem rgba(0, 0, 0, 0.1)'}
      borderRadius="0.5rem"
      cursor="pointer"
      width={'15rem'}
      height={'7rem'}
      gap="0.25rem"
      display={'flex'}
      flexDir="column"
      justifyContent={'center'}
      onClick={() => navigate('/courses/' + course.id)}
    >
      <Flex
        borderBottom={'solid 0.075rem'}
        borderBottomColor={'rgba(0, 0, 0, 20%)'}
        justifyContent="space-between"
        height={'60%'}
      >
        <Heading
          fontSize={'larger'}
          fontWeight={'semibold'}
          maxWidth={'15rem'}
          maxHeight={'3rem'}
          overflowX="hidden"
          overflowY={'hidden'}
          noOfLines={2}
          height={'100%'}
        >
          {course.name}
        </Heading>
        {currentUser && currentUser.id === course.lecturer.id && (
          <Text fontSize={'sm'} color="#0194F3">
            <BsCircleFill />
          </Text>
        )}
      </Flex>
      <Text noOfLines={1}>
        {course.lecturer.firstName} {course.lecturer.lastName}
      </Text>
    </Box>
  );
};

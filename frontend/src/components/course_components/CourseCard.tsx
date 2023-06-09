import { SlideFade, Box, Flex, useDisclosure } from '@chakra-ui/react';
import { ChatDisclosureButton, ChatWindow } from '../ChatWindow';

export const CourseCard = ({
  children,
  joined,
  courseID,
}: {
  children: React.ReactNode;
  joined: boolean;
  courseID: string;
}) => {
  const { getDisclosureProps, getButtonProps } = useDisclosure();
  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();

  return (
    <SlideFade
      delay={0.2}
      in={true}
      style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
    >
      <Box
        id="course-card"
        data-testid="course-detail"
        minW="500px"
        bg={'white'}
        color={'black'}
        width={'75%'}
        padding="1.75rem"
        display="flex"
        flexDirection={'column'}
        borderRadius={'1rem'}
        boxShadow={'0 0.25rem 1.25rem rgba(0, 0, 0, 0.15)'}
        mb="3rem"
        position="relative"
      >
        {children}
      </Box>
      {joined && (
        <Flex
          as="span"
          id="chat-area"
          position={'static'}
          right={'10rem'}
          height={'40rem'}
          overflowY={'hidden'}
          borderRadius={'1rem'}
        >
          <Box>
            <ChatWindow cardID={'course-card'} roomID={courseID} />
          </Box>
          <Box>
            <ChatDisclosureButton cardID="course-card" />
          </Box>
        </Flex>
      )}
    </SlideFade>
  );
};

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  UnorderedList,
  ListItem,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  Modal,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { AppLayout } from '../layout/AppLayout';
import { IoEnterOutline, IoExitOutline } from 'react-icons/io5';
import { AiFillEdit, AiOutlineCheck } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import React, { useState } from 'react';
import { useApiClient } from '../adapter/api/useApiClient';
import { Group, User } from '../adapter/api/__generated';
import { useNavigate, useParams } from 'react-router-dom';
import { Section } from '../adapter/api/__generated';
import { useAuth } from '../providers/AuthProvider';
import { GroupSectionList } from '../components/group_components/GroupSectionList';
import { GroupDetailCard } from '../components/group_details_components/GroupDetailsCard';

interface GroupDescProps {
  group: Group;
  updateGroup: React.Dispatch<React.SetStateAction<Group>>;
  updateHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  joined: boolean;
}

const GroupDescriptionSection = ({ group, updateGroup, updateHandler, joined }: GroupDescProps) => {
  const [editMode, setEditMode] = useState(false);

  const handleEditSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditMode(false);
    updateHandler(e);
  };

  return (
    <Box mt={'3rem'}>
      <Flex
        borderBottom={'solid 0.075rem'}
        borderBottomColor={'#0194F3'}
        pl={'0.5rem'}
        pr={'0.5rem'}
        justifyContent="space-between"
      >
        <Text fontSize={'2xl'} fontWeight="normal">
          Group Description
        </Text>
        {joined && !editMode && (
          <Flex alignItems={'center'} fontSize="larger" cursor="pointer">
            <AiFillEdit onClick={() => setEditMode(!editMode)} cursor="pointer" />
          </Flex>
        )}
      </Flex>
      {editMode ? (
        <form onSubmit={(e) => handleEditSection(e)} style={{ display: 'flex', gap: '0.75rem' }}>
          <Textarea
            value={group.description}
            resize="none"
            height={'10rem'}
            onChange={(e) =>
              updateGroup((prev) => {
                return { course: prev.course, name: prev.name, description: e.target.value };
              })
            }
          />
          <Box mt={'1rem'}>
            <Button
              type="submit"
              variant={'solid'}
              _hover={{}}
              _active={{}}
              size="xs"
              bg={'black'}
              color="white"
              fontWeight={'medium'}
            >
              <AiOutlineCheck />
            </Button>
            <Button
              onClick={() => setEditMode(false)}
              variant={'solid'}
              _hover={{}}
              _active={{}}
              size="xs"
              bg={'gray'}
              color="white"
              fontWeight={'medium'}
            >
              <RxCross1 />
            </Button>
          </Box>
        </form>
      ) : (
        <Box pl={'0.5rem'} pr={'0.5rem'} mt="0.5rem">
          {group.description}
        </Box>
      )}
    </Box>
  );
};

const MemberList = ({ members }: { members: User[] }) => {
  const name = new Array();
  members.forEach((i) => {
    name.push(i.firstName + ' ' + i.lastName);
  });
  return (
    <>
      {name.map((item) => (
        <ListItem key={item}>{item}</ListItem>
      ))}
    </>
  );
};

export const GroupDetailPage = () => {
  const param = useParams();
  const currentUser = useAuth().user;
  const apiClient = useApiClient();
  const [editMode, setEditMode] = useState(false);
  const [joined, setJoined] = useState(false);
  const [group, setGroup] = useState<Group>({
    name: '',
    description: '',
  });
  const [newSection, setNewSection] = useState<Section>({
    heading: '',
    description: '',
    text: 'section text', // text von einem Section
  });
  const [members, setMembers] = useState<User[]>();
  const [sections, setSections] = useState<Section[]>();
  const [oldGroup, setOldGroup] = useState<Group>(group);
  const toast = useToast();
  const navigate = useNavigate();
  const newSectionDisclosure = useDisclosure();

  const fetchData = async () => {
    if (param.groupID) {
      await apiClient
        .getGroupId(param.groupID)
        .then((res) => {
          const theGroup = res.data;
          if (theGroup.sections) {
            setSections(theGroup.sections);
          }
          setGroup(theGroup);
          setOldGroup(theGroup);

          // Check if user is member of the group
          if (theGroup.members) {
            const members = theGroup.members.map((obj: any) => obj.learner.id);
            setMembers(theGroup.members!.map((obj: any) => obj.learner));
            if (currentUser && members.includes(currentUser.id)) {
              setJoined(true);
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleEditGroupInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditMode(false);
    if (param.groupID) {
      await apiClient
        .putGroup(param.groupID, group)
        .then(() => {
          setOldGroup(group);
          setGroup(group);
          toast({
            title: 'Updated',
            description: <Text>Group sucessfully updated</Text>,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          setGroup(oldGroup);
          toast({
            title: 'Error occured.',
            description: <Text>{error.response.data.errors}</Text>,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  const handleDeleteGroup = async () => {
    if (group && currentUser) {
      const res = await apiClient
        .deleteGroup(group.id!)
        .then(() => {
          toast({
            title: 'Deleted',
            description: <Text>Group sucessfully deleted</Text>,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          navigate(-1);
        })
        .catch((error) => {
          toast({
            title: 'Error occured.',
            description: <Text>{error.response.data.errors}</Text>,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  const handleNewSection = async () => {
    if (group && group.id) {
      await apiClient
        .postSectionGroup(group.id, newSection)
        .then((response) => {
          const theSection = response.data;
          if (sections && sections.length > 0) {
            const mergedSections = [...sections, theSection];
            setSections(mergedSections);
          } else {
            setSections([theSection]);
          }
          newSectionDisclosure.onClose();
          setNewSection({
            heading: '',
            description: '',
            text: newSection.text,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const joinGroup = async () => {
    if (group && currentUser) {
      await apiClient
        .putUsersUseridCourseCourseidGroupGroupid(currentUser.id, group.course!.id!, group.id!)
        .then((res2) => {
          toast({
            title: 'Joined',
            description: <Text>Group sucessfully joined</Text>,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          if (res2.data.member) {
            const newMember = res2.data.member.learner;
            if (members && newMember) {
              setMembers([...members, newMember]);
            } else if (!members && newMember) {
              setMembers([newMember]);
            }
          }
          setJoined(true);
        })
        .catch((error) => {
          toast({
            title: 'Error occured.',
            description: <Text>{error.response.data.errors}</Text>,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  const leaveGroup = async () => {
    if (group && currentUser) {
      await apiClient
        .deleteUsersUseridCourseCourseidGroupGroupid(currentUser.id, group.course!.id!, group.id!)
        .then(() => {
          toast({
            title: 'Left',
            description: <Text>Gruop sucessfully left</Text>,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          if (members) {
            setMembers(members.filter((member) => member.id !== currentUser.id));
          }
          setJoined(false);
        })
        .catch((error) => {
          toast({
            title: 'Error occured.',
            description: <Text>{error.response.data.errors}</Text>,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <AppLayout display={'flex'} flexDir="column" alignItems="center" mt={'3rem'}>
      <GroupDetailCard joined={joined} groupID={group.id!}>
        <Flex id="group-heading" justifyContent={'space-between'}>
          <Box display={'flex'} gap="1.5rem">
            <Box id="group-info" maxW={'36rem'}>
              {editMode ? (
                <form onSubmit={(e) => handleEditGroupInfo(e)} style={{ width: '100%' }}>
                  <Textarea
                    w={'100%'}
                    resize={'none'}
                    value={group?.name}
                    onChange={(e) => setGroup({ name: e.target.value, description: group?.description! })}
                  />
                  <Flex alignItems={'center'} fontSize="medium" mt={'0.5rem'} gap={'0.25rem'}>
                    <Button
                      type="submit"
                      variant={'solid'}
                      _hover={{}}
                      _active={{}}
                      size="xs"
                      bg={'black'}
                      color="white"
                      fontWeight={'medium'}
                    >
                      Done
                    </Button>
                    <Button
                      onClick={() => setEditMode(false)}
                      variant={'solid'}
                      _hover={{}}
                      _active={{}}
                      size="xs"
                      bg={'gray'}
                      color="white"
                      fontWeight={'medium'}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </form>
              ) : (
                <>
                  <Text>Course: {group?.course?.name}</Text>
                  <Heading>{group?.name}</Heading>
                </>
              )}
            </Box>
            {joined && !editMode && (
              <Flex alignItems={'center'} fontSize="larger">
                <AiFillEdit onClick={() => setEditMode(!editMode)} cursor="pointer" />
              </Flex>
            )}
          </Box>
          <Flex gap={'1rem'} id="group-buttons" flexDir={'row'} alignItems="center">
            {!joined && (
              <button onClick={() => joinGroup()}>
                <HStack>
                  <Text>Join group</Text>
                  <Text color="green.400" cursor="pointer" fontSize={'3xl'}>
                    <IoEnterOutline />
                  </Text>
                </HStack>
              </button>
            )}
            {joined && (
              <button onClick={() => leaveGroup()}>
                <HStack>
                  <Text>Leave group</Text>
                  <Text color="red.400" cursor="pointer" fontSize={'3xl'}>
                    <IoExitOutline />
                  </Text>
                </HStack>
              </button>
            )}
          </Flex>
        </Flex>
        {
          // group description section
          group ? (
            <GroupDescriptionSection
              group={group}
              updateGroup={setGroup}
              updateHandler={handleEditGroupInfo}
              joined={joined}
            />
          ) : (
            <Box>Group Desciption not available</Box>
          )
        }
        <Box mt={'2rem'}>
          <Flex
            borderBottom={'solid 0.075rem'}
            borderBottomColor={'#0194F3'}
            pl={'0.5rem'}
            pr={'0.5rem'}
            justifyContent="space-between"
          >
            <Text fontSize={'2xl'} fontWeight="normal">
              Member list
            </Text>
          </Flex>
          <Box pl={'0.5rem'} pr={'0.5rem'} mt="0.5rem">
            <UnorderedList>
              {members && members.length > 0 ? <MemberList members={members} /> : <Text>No members found</Text>}
            </UnorderedList>
          </Box>
        </Box>
        {/** Section List  **/}
        {joined && (
          <Box mt={'2rem'}>
            <Text fontSize={'2xl'} fontWeight="normal">
              Sections
            </Text>
            {joined && (
              <Box mb={'1rem'}>
                <Button
                  onClick={newSectionDisclosure.onOpen}
                  variant={'solid'}
                  _hover={{}}
                  _active={{}}
                  size="xs"
                  bg={'black'}
                  color="white"
                  fontWeight={'medium'}
                >
                  Add new section
                </Button>
                <Modal
                  blockScrollOnMount={false}
                  isOpen={newSectionDisclosure.isOpen}
                  onClose={newSectionDisclosure.onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>New Section</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Flex mb={'0.5rem'}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                          <Input
                            placeholder="Section title"
                            value={newSection?.heading}
                            onChange={(e) =>
                              setNewSection({
                                heading: e.target.value,
                                description: newSection!.description,
                                text: newSection!.text,
                              })
                            }
                          />
                          <Textarea
                            placeholder="Section description"
                            value={newSection?.description}
                            onChange={(e) =>
                              setNewSection({
                                heading: newSection!.heading,
                                description: e.target.value,
                                text: newSection!.text,
                              })
                            }
                          />
                        </form>
                      </Flex>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={() => handleNewSection()}>
                        Add
                      </Button>
                      <Button variant="ghost" onClick={newSectionDisclosure.onClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Box>
            )}
            {group && <GroupSectionList group={group} sections={sections} setSections={setSections} isOwner={joined} />}
          </Box>
        )}
        <Box display={'flex'} justifyContent="center" mt={'3rem'}>
          {joined && (
            <Button onClick={() => handleDeleteGroup()} variant={'link'} color="red" _active={{}} size={'sm'}>
              Delete group
            </Button>
          )}
        </Box>
      </GroupDetailCard>
    </AppLayout>
  );
};

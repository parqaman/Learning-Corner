import { AuthCard } from '../components/AuthCard';
import { AppLayout } from '../layout/AppLayout';
import { useToast, Heading, Box, Text, Button, Input } from '@chakra-ui/react';
import { useApiClient } from '../adapter/api/useApiClient';
import { useAuth } from '../providers/AuthProvider';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordPage = () => {
  const apiClient = useApiClient();
  const user = useAuth().user;
  const navigate = useNavigate();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      const res = await apiClient
        .putAuthResetpassword({
          id: user.id,
          currentPassword,
          newPassword,
        })
        .then(() => {
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

  return (
    <AppLayout display={'flex'} flexDir="column" justifyContent={'center'} alignItems="center">
      <AuthCard>
        <Heading>Reset password</Heading>
        <form onSubmit={(e) => handleNewPassword(e)}>
          <Box width={'100%'} gap={'1em'} display="flex" flexDirection={'column'}>
            <Input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              as={Input}
              isRequired
              padding={'0.75em'}
              variant={'unstyled'}
              placeholder="Current password"
              _placeholder={{ color: '#8E8E8E' }}
              border={'solid 2px'}
              borderColor={'rgba(0, 0, 0, 30%)'}
              id="current-pass"
              name="current-pass"
              type="password"
            />
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              as={Input}
              isRequired
              padding={'0.75em'}
              variant={'unstyled'}
              placeholder="New password"
              _placeholder={{ color: '#8E8E8E' }}
              border={'solid 2px'}
              borderColor={'rgba(0, 0, 0, 30%)'}
              id="new-pass"
              name="new-pass"
              type="password"
            />
            <Button
              variant={'unstyled'}
              width={'100%'}
              type="submit"
              bg={'black'}
              color={'white'}
              borderRadius={'2rem'}
            >
              Reset password
            </Button>
            <Button
              variant={'unstyled'}
              width={'100%'}
              onClick={() => navigate(-1)}
              bg={'gray'}
              color={'white'}
              borderRadius={'2rem'}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </AuthCard>
    </AppLayout>
  );
};

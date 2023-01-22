import { object, string } from 'yup';
import { AuthCard } from '../components/AuthCard';
import { AppLayout } from '../layout/AppLayout';
import { Heading, Box, VStack, FormControl, Button, FormErrorMessage, Input, Text } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { LoginData, useAuth } from '../providers/AuthProvider';

export const LoginSchema = object({
  email: string().email().required(),
  password: string().required(),
});

export const LoginPage = () => {
  const useLogin = useAuth().actions.login;

  return (
    <AppLayout display={'flex'} flexDir="column" justifyContent={'center'} alignItems="center">
      <AuthCard>
        <Heading>Sign in</Heading>
        <Formik<LoginData>
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            useLogin(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <VStack alignItems={'flex-start'}>
                <Box id={'login-area'} width={'100%'} gap={'1em'} display="flex" flexDirection={'column'}>
                  <FormControl isInvalid={!!errors.email && touched.email} opacity={'100%'}>
                    <Field
                      as={Input}
                      isRequired
                      padding={'0.75em'}
                      variant={'unstyled'}
                      placeholder="Email"
                      _placeholder={{ color: '#8E8E8E' }}
                      border={'solid 2px'}
                      borderColor={'rgba(0, 0, 0, 30%)'}
                      id="email"
                      name="email"
                      type="email"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password && touched.password} opacity={'100%'}>
                    <Field
                      as={Input}
                      isRequired
                      padding={'0.75em'}
                      variant={'unstyled'}
                      placeholder="Password"
                      _placeholder={{ color: '#8E8E8E' }}
                      border={'solid 2px'}
                      borderColor={'rgba(0, 0, 0, 30%)'}
                      id="password"
                      name="password"
                      type="password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button
                    variant={'unstyled'}
                    width={'100%'}
                    type="submit"
                    bg={'black'}
                    color={'white'}
                    borderRadius={'2rem'}
                  >
                    Login
                  </Button>
                </Box>
                <Box>
                  <Text>
                    Don't have an account yet?
                    <Link to="/auth/register">
                      <Text as={'span'} color={'#0194F3'}>
                        {' '}
                        Sign up
                      </Text>
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Form>
          )}
        </Formik>
      </AuthCard>
    </AppLayout>
  );
};

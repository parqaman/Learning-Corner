import { object, string } from 'yup';
import { AuthCard } from '../components/AuthCard';
import { AppLayout } from '../layout/AppLayout';
import { Heading, Box, VStack, FormControl, Button, FormErrorMessage, Input, Text } from '@chakra-ui/react';
import { Form, Formik, Field } from 'formik';
import { Link } from 'react-router-dom';
import { RegisterUserData, useAuth } from '../providers/AuthProvider';

export const RegisterSchema = object({
  firstName: string().min(2).max(50).required(),
  lastName: string().min(2).max(50).required(),
  email: string().email().required(),
  password: string().min(8).max(30).required(),
});

export const RegisterPage = () => {
  const useRegister = useAuth().actions.register;

  return (
    <AppLayout display={'flex'} flexDir="column" justifyContent={'center'} alignItems="center">
      <AuthCard>
        <Heading>Sign up</Heading>
        <Formik<RegisterUserData>
          validationSchema={RegisterSchema}
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            photo: 'profile_empty.png',
          }}
          onSubmit={(values) => {
            useRegister(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <VStack alignItems={'flex-start'}>
                <Box id={'register-area'} width={'100%'} gap={'1em'} display="flex" flexDirection={'column'}>
                  <FormControl isInvalid={!!errors.firstName && touched.firstName} opacity={'100%'}>
                    <Field
                      as={Input}
                      isRequired
                      padding={'0.75em'}
                      variant={'unstyled'}
                      placeholder="First name"
                      _placeholder={{ color: '#8E8E8E' }}
                      border={'solid 2px'}
                      borderColor={'rgba(0, 0, 0, 30%)'}
                      id="firstName"
                      name="firstName"
                      type="text"
                      data-testid='firstName'
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.lastName && touched.lastName} opacity={'100%'}>
                    <Field
                      as={Input}
                      isRequired
                      padding={'0.75em'}
                      variant={'unstyled'}
                      placeholder="Last name"
                      _placeholder={{ color: '#8E8E8E' }}
                      border={'solid 2px'}
                      borderColor={'rgba(0, 0, 0, 30%)'}
                      id="lastName"
                      name="lastName"
                      type="text"
                      data-testid='lastName'
                    />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>

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
                      data-testid='email'
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
                      data-testid='password'
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
                    data-testid='register-btn'
                  >
                    Register
                  </Button>
                </Box>
                <Box>
                  <Text>
                    Already a member?
                    <Link to="/auth/login">
                      <Text as={'span'} color={'#0194F3'}>
                        {' '}
                        Sign In
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

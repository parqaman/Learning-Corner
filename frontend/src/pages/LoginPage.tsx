import { object, string } from "yup";
import { AuthCard } from "../components/AuthCard";
import { AppLayout } from "../layout/AppLayout";
import { Heading, Box, VStack, FormControl, Button, FormErrorMessage, Input, Text } from '@chakra-ui/react'
import { Form, Formik } from "formik";
import { Link } from 'react-router-dom';

export const LoginSchema = object({
  password: string().required(),
  email: string().email().required(),
});

export const LoginPage = () => {
  return (
    <AppLayout>
        <AuthCard>
            <Heading >
                Sign in
            </Heading>
            <Formik
            initialValues={{
                email: '',
                password: ''
            }}
            onSubmit={(values) => {
                console.log(values)
            }}
            >
                {
                    ({ errors, touched }) => (
                        <Form>
                            <VStack alignItems={'flex-start'}>
                                <Box id={'login-area'} width={'100%'} gap={'1em'} display='flex' flexDirection={'column'}>
                                    <FormControl isInvalid={!!errors.email && touched.email} opacity={'100%'}>
                                        <Input isRequired padding={'0.75em'} variant={'unstyled'} placeholder="Email" _placeholder={{color: '#8E8E8E'}} border={'solid 2px'} borderColor={'rgba(0, 0, 0, 30%)'} id="email" name="email" type="email"></Input>
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.password && touched.password} opacity={'100%'}>
                                        <Input isRequired padding={'0.75em'} variant={'unstyled'} placeholder="Password" _placeholder={{color: '#8E8E8E'}} border={'solid 2px'} borderColor={'rgba(0, 0, 0, 30%)'} id="password" name="password" type="password"></Input>
                                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                                    </FormControl>
                                    <Button variant={'unstyled'} width={'100%'} type="submit" bg={'black'} color={'white'} borderRadius={'2rem'}>Login</Button>
                                </Box>
                                <Box>
                                    <Text>
                                        Don't have an account yet? 
                                        <Link to="/auth/register">
                                            <Text as={'span'} color={'#0194F3'}> Sign up</Text>
                                        </Link>
                                    </Text>
                                </Box>
                            </VStack>
                        </Form>
                    )
                }
            </Formik>
        </AuthCard>
    </AppLayout>
  )
}



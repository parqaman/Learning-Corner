import { Router } from 'express';

import { DI } from '../';
import { LoginSchema, RegisterUserDTO, RegisterUserSchema, ResetPasswortSchema, User } from '../entities';
import { Auth } from '../middleware/auth.middleware';
import { wrap } from '@mikro-orm/core';

const router = Router({ mergeParams: true });

router.post('/register', async (req, res) => {
  const validatedData = await RegisterUserSchema.validate(req.body).catch((e) => {
    res.status(400).send({ errors: e.errors });
  });
  if (!validatedData) {
    return;
  }
  const registerUserDto: RegisterUserDTO = {
    ...validatedData,
    password: await Auth.hashPassword(validatedData.password),
  };
  const existingUser = await DI.userRepository.findOne({
    email: validatedData.email,
  });
  if (existingUser) {
    return res.status(400).send({ errors: ['User already exists'] });
  }

  const newUser = new User(registerUserDto);
  await DI.userRepository.persistAndFlush(newUser);

  return res.status(201).send(newUser);
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  const validatedData = await LoginSchema.validate(req.body).catch((e) => {
    res.status(400).send({ errors: e.errors });
  });
  if (!validatedData) {
    return;
  }

  const user = await DI.userRepository.findOne({
    email: validatedData.email,
  });
  if (!user) {
    return res.status(400).json({ errors: ['User does not exist'] });
  }
  const matchingPassword = await Auth.comparePasswordWithHash(validatedData.password, user.password);
  if (!matchingPassword) {
    return res.status(401).send({ errors: ['Incorrect password'] });
  }

  const jwt = Auth.generateToken({
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
  });

  res.status(200).json({ accessToken: jwt });
});

router.put('/resetpassword', async (req, res) => {
  const validatedData = await ResetPasswortSchema.validate(req.body).catch((e) => {
    res.status(400).send({ errors: e.errors });
  });
  if (!validatedData) {
    return;
  }

  const user = await DI.userRepository.findOne({
    id: validatedData.id,
  });
  if (!user) {
    return res.status(400).json({ errors: ['User does not exist'] });
  }

  const matchingPassword = await Auth.comparePasswordWithHash(validatedData.currentPassword, user.password);
  if (!matchingPassword) {
    return res.status(401).send({ errors: ['Incorrect password'] });
  }

  const hashedPassword = await Auth.hashPassword(validatedData.newPassword);
  wrap(user).assign({ password: hashedPassword });
  await DI.userRepository.flush();
  res.status(200).send({ message: ['Password has been changed'] });
});

export const AuthController = router;

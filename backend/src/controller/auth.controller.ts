import { Router } from 'express';

import { DI } from '../';
import { RegisterUserDTO, RegisterUserSchema, User } from '../entities';
import { Auth } from '../middleware/auth.middleware';

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

export const AuthController = router;

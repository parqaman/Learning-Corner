import { Router } from "express";
import { DI } from "../";
import {wrap} from "@mikro-orm/core";

const router = Router({ mergeParams: true });

router.put("/:id", async (req, res) => {
    try {
        const user = await DI.userRepository.findOne(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        wrap(user).assign(req.body);
        await DI.userRepository.flush();
        return res.json(user);
    } catch (e: any) {
        return res.status(400).send({ errors: [e.message] });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await DI.userRepository.findOne(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        await DI.userRepository.remove(user).flush();
        return res.status(204).send({});
    } catch (e: any) {
        return res.status(400).send({ errors: [e.message] });
    }
});

export const UserController = router;

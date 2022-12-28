import { Router } from "express";
import { DI } from "../";
import {Course, CreateCourseDTO, CreateCourseSchema} from "../entities";
import {wrap} from "@mikro-orm/core";

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
    return res.json(await DI.courseRepository.findAll({
        populate: ['sections', 'participants']
    }));
});

router.get("/:id", async (req, res) => {
    const course = await DI.courseRepository.findOne( {id: req.params.id}, {
        populate: ['sections', 'participants']
    });
    if(!course) return res.status(404).send({ message: 'Course not found' });
    return res.json(course);
});

router.post("/", async (req, res) => {
    const validatedData = await CreateCourseSchema.validate(req.body).catch((e) => {
        res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
        return;
    }
    if (!req.user) {
        return;
    }
    const createCourseDTO: CreateCourseDTO = {
        ...validatedData,
        lecturer: req.user
    };

    const course = new Course(createCourseDTO);
    const hasSections = createCourseDTO.sections && createCourseDTO.sections.length > 0;
    const hasParticipants = createCourseDTO.participants && createCourseDTO.participants.length > 0;

    if(hasSections) wrap(course).assign({sections: createCourseDTO.sections});
    if(hasParticipants) wrap(course).assign({participants: createCourseDTO.participants});

    await DI.courseRepository.persistAndFlush(course);

    if(hasSections) await DI.courseRepository.populate(course, ['sections']);
    if(hasParticipants) await DI.courseRepository.populate(course, ['participants']);

    return res.status(201).send(course);
});

export const CourseController = router;

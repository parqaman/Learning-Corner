import { Router } from "express";
import { DI } from "../";
import {
  Course,
  CreateCourseDTO,
  CreateCourseSchema,
  CreateSectionDTO,
  CreateSectionSchema,
  Section,
} from "../entities";
import { wrap } from "@mikro-orm/core";
import { deleteSectionFiles } from '../helpers/file.helper';

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const courseName = req.query?.name as string;
  if (courseName) {
    return res.json(
      await DI.courseRepository.find(
        {},
        {
          filters: { name: { name: courseName } },
          populate: ["sections", "sections.files", "participants", "lecturer", 'groups'],
        }
      )
    );
  }
  return res.json(
    await DI.courseRepository.findAll({
      populate: ["sections", "sections.files", "participants", "lecturer", 'groups'],
    })
  );
});

router.get("/:id", async (req, res) => {
  const course = await DI.courseRepository.findOne(
    { id: req.params.id },
    {
      populate: ["sections", "sections.files", "participants", "lecturer", "groups", 'groups.members'],
    }
  );
  if (!course) return res.status(404).send({ message: "Course not found" });
  return res.json(course);
});

router.post("/", async (req, res) => {
  const validatedData = await CreateCourseSchema.validate(req.body).catch(
    (e) => {
      res.status(400).json({ errors: e.errors });
    }
  );
  if (!validatedData) {
    return;
  }
  if (!req.user) {
    return;
  }
  const createCourseDTO: CreateCourseDTO = {
    ...validatedData,
    lecturer: req.user,
  };

  const course = new Course(createCourseDTO);
  const hasSections =
    createCourseDTO.sections && createCourseDTO.sections.length > 0;
  const hasParticipants =
    createCourseDTO.participants && createCourseDTO.participants.length > 0;

  if (hasSections) wrap(course).assign({ sections: createCourseDTO.sections });
  if (hasParticipants)
    wrap(course).assign({ participants: createCourseDTO.participants });

  const existingCourse = await DI.courseRepository.findOne({
    name: course.name,
  });

  if (existingCourse) {
    return res.status(409).send({ errors: "Course existed already" });
  }

  await DI.courseRepository.persistAndFlush(course);

  if (hasSections) await DI.courseRepository.populate(course, ["sections"]);
  if (hasParticipants)
    await DI.courseRepository.populate(course, ["participants"]);

  return res.status(201).send(course);
});

// Update a course
router.put("/:courseId", async (req, res) => {
  try {
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    if (course.lecturer !== req.user) {
      return res.status(401).send({ message: "User not authorized" });
    }

    const existingCourse = await DI.courseRepository.findOne({
      name: req.body.name,
    });

    if (existingCourse && course !== existingCourse) {
      return res.status(409).send({ errors: "Course existed already" });
    }

    wrap(course).assign(req.body);
    await DI.courseRepository.flush();
    return res.status(200).send(course);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Delete a course
router.delete("/:courseId", async (req, res) => {
  try {
    const course = await DI.courseRepository.findOne(req.params.courseId, { populate: ['sections', 'sections.files'] });
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    if (course.lecturer !== req.user) {
      return res.status(401).send({ message: "User not authorized" });
    }

    course.sections?.getItems().map(section => {
      if(section.files.length > 0) {
        const files = section.files.getItems()
        deleteSectionFiles(files, section.id);
      }
    })

    const messages = await DI.messageRepository.find({roomId: req.params.courseId});
    if (messages) await DI.messageRepository.removeAndFlush(messages);

    await DI.courseRepository.removeAndFlush(course);
    return res.status(204).send({ message: "Course deleted" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Create section in course
router.post("/:courseId/section", async (req, res) => {
  const validatedData = await CreateSectionSchema.validate(req.body).catch(
    (e) => {
      res.status(400).send({ errors: e.errors });
    }
  );
  if (!validatedData) {
    return;
  }

  const course = await DI.courseRepository.findOne(req.params.courseId);
  if (!course) {
    return res.status(404).send({ message: "Course not found" });
  }

  if (course.lecturer !== req.user) {
    return res.status(401).send({ message: "User not authorized" });
  }

  const createSectionDTO: CreateSectionDTO = {
    ...validatedData,
    course: course,
  };

  const newSection = new Section(createSectionDTO);
  await DI.sectionRepository.persistAndFlush(newSection);

  return res.status(201).send(newSection);
});

// Update section in course
router.put("/:courseId/section/:sectionId", async (req, res) => {
  try {
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    if (course.lecturer !== req.user) {
      return res.status(401).send({ message: "User not authorized" });
    }

    const section = await DI.sectionRepository.findOne(req.params.sectionId);
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }

    if (section.course !== course) {
      return res.status(400).send({ message: "Section is not in the course" });
    }

    wrap(section).assign(req.body);
    await DI.sectionRepository.flush();
    return res.status(200).send(section);
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Delete section in course
router.delete("/:courseId/section/:sectionId", async (req, res) => {
  try {
    const course = await DI.courseRepository.findOne(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    if (course.lecturer !== req.user) {
      return res.status(401).send({ message: "User not authorized" });
    }

    const section = await DI.sectionRepository.findOne(req.params.sectionId, {populate: ['files']});
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }

    if (section.course !== course) {
      return res.status(400).send({ message: "Section is not in the course" });
    }

    if(section.files.length > 0) {
      const files = section.files.getItems()
      deleteSectionFiles(files, req.params.sectionId);
    }

    await DI.sectionRepository.removeAndFlush(section);
    return res.status(204).send({ message: "Section deleted" });
  } catch (e: any) {
    return res.status(400).send({ errors: [e.message] });
  }
});

// Get messages
router.get("/:courseId/message", async (req, res) => {
  const course = await DI.courseRepository.findOne({ id: req.params.courseId });
  if (!course) {
    return res.status(404).send({ message: "Course not found" });
  }
  const learnerInCourse = await DI.learnerInCourseRepository.findOne({
    learner: req.user,
    course: course,
  });
  if (!learnerInCourse) {
    return res
      .status(401)
      .send({ message: "You are not the member of this course" });
  }
  const messages = await DI.messageRepository.find(
    { roomId: course.id },
    { populate: ["sender"], orderBy: {time: 'ASC'} },
  );
  return res.status(200).send(messages);
});

export const CourseController = router;

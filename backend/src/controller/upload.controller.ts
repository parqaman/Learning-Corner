import { Router } from 'express';
import { DI, emailTransporter } from '../';
import { wrap } from '@mikro-orm/core';
import { uploadFile } from '../middleware/file.middleware';
import * as fs from 'fs';
import { CreateFileDTO, File as OwnFile, Section } from '../entities';
import path from 'path';
import { storagePath, uploadPath } from '../helpers/file.helper';

const router = Router({ mergeParams: true });

function handleNewFile(section: Section, tmpName: string, fileName: string): string {
  if (!fs.existsSync(path.join(storagePath, section.id))) {
    fs.mkdirSync(path.join(storagePath, section.id));
  }
  let newFileName = fileName;
  function getUnusedFileName(x: number, theFileName: string): string {
    const filesWithSameFileName = section.files.getItems().filter((f) => f.name === theFileName);
    if (filesWithSameFileName.length > 0) {
      return getUnusedFileName(x++, x + '_' + theFileName);
    }
    return theFileName;
  }

  if (section.files.length > 0) {
    newFileName = getUnusedFileName(0, fileName);
  }

  fs.cpSync(path.join(uploadPath, tmpName), path.join(storagePath, section.id, newFileName));
  fs.unlinkSync(path.join(uploadPath, tmpName));
  return fileName;
}

const sendEmail = (participantsEmail: string[], section: any, files: Express.Multer.File[]) => {
  const emailOptions = {
    from: "the-learning-corner@outlook.com",
    bcc: participantsEmail,
    subject: "A new file was uploaded in " + section.course.name,
    html: `
    <div>
      <header>
        <p>Hi there!</p>
      </header>

      <main>
        <p>The creator of <b>${section.course.name}</b> has uploaded a new file.</p>
        <b>Uploaded file info:</b>
        <ul style="list-style-type: square;">
          <li>File name: ${files[0].originalname}</li>
          <li>Course name: ${section.course.name}</li>
          <li>Course creator: ${section.course.lecturer.firstName} ${section.course.lecturer.lastName}</li>
          <li>Section name: ${section.heading}</li>
        </ul>
        <p>See the file by visiting <a href='http://localhost:3000/courses/${section.course.id}' target='_blank'>${section.course.name}</a>'s page!</p>
      </main>

      <footer>
        <p>All the best,</p>
        <b>The Learning Corner Team</b>
      </footer>
    </div>
    `

    /**
     * saved for later
     * <a href='http://localhost:4000/upload/files/${section.id}/${files[0].originalname}' target='_blank'>${files[0].originalname}</a>
     */
  }

  emailTransporter.sendMail(emailOptions, (err, info) => {
    try {
      console.log(info.response);
    } catch (error) {
      console.log(err);
    }
  })
}

router.post('/:sectionId/file', uploadFile, async (req, res) => {
  const section = await DI.sectionRepository.findOne(req.params.sectionId, {
    populate: ['files'],
  });
  if (!section) {
    return res.status(404).send({ message: 'Section not found' });
  }
  const files = req.files as Express.Multer.File[];

  if (files && files.length === 1 && files[0].filename) {
    const fileName = handleNewFile(section, files[0].filename, files[0].originalname);
    const fDTO: CreateFileDTO = {
      name: fileName,
      section,
    };
    const newSectionFiles: OwnFile[] = [...section.files, new OwnFile(fDTO)];
    wrap(section).assign({ files: newSectionFiles });
  }
  await DI.sectionRepository.flush();
  res.status(200).send(section);

  if(section.course) {
    //find participants of course
    const learnerInCourseList = await DI.learnerInCourseRepository.find({ //returns an array of learner in course
      course: {
        id: section.course.id
      }
    }, {populate: ['learner', 'course.name', 'course.id', 'course.lecturer']})
    if(learnerInCourseList) {
      const participantsEmail: string[] = [];
      learnerInCourseList.forEach(i => {
        participantsEmail.push(i.learner.email);
      })

      if(section.course) {
        //send email to participants
        sendEmail(participantsEmail, section, files);
      }
    }
  }
});

export const UploadController = router;

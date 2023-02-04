import { Router } from 'express';
import { DI } from '../';
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
});

export const UploadController = router;

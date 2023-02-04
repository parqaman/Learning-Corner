import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Course, LearnerInCourse, User } from '../entities';
import { Auth } from '../middleware/auth.middleware';

export class TestSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const hashedPassword = await Auth.hashPassword('12345678');
    const user = em.create(User, {
      id: '1',
      email: 'admin@learning-corner.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: '1',
      photo: 'profile_empty.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    let course = em.create(Course, {
      id: '1',
      name: 'Advanced Web Development',
      description: 'Description 1',
      lecturer: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    em.create(LearnerInCourse, {
      learner: user,
      course,
    });

    course = em.create(Course, {
      id: '2',
      name: 'Graphische Datenverarbeitung',
      description: 'Description 2',
      lecturer: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    em.create(LearnerInCourse, {
      learner: user,
      course,
    });

    course = em.create(Course, {
      id: '3',
      name: 'Datenbanken 2',
      description: 'Description 3',
      lecturer: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    em.create(LearnerInCourse, {
      learner: user,
      course,
    });

    course = em.create(Course, {
      id: '4',
      name: 'Data Warehouse Techonologien',
      description: 'Description 4',
      lecturer: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    em.create(LearnerInCourse, {
      learner: user,
      course,
    });

    course = em.create(Course, {
      id: '5',
      name: 'Unix for Developers',
      description: 'Description 5',
      lecturer: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    em.create(LearnerInCourse, {
      learner: user,
      course,
    });

    course = em.create(Course, {
      id: '6',
      name: 'Programmieren Algorithmen und Datenstruktur',
      description: 'Description 6',
      lecturer: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    em.create(LearnerInCourse, {
      learner: user,
      course,
    });
  }
}

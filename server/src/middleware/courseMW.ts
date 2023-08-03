import { type Request, type Response, type NextFunction } from 'express'
import { deleteElement } from '../util/awsInterface'
import { dbQuery } from '../db/connection'
import { queryList } from '../db/queries'
const { v4: uuidv4 } = require('uuid')

interface LessonBlock {
  lesson_id: string
  week_id: string
  lesson_title: string
  week_title: string
  lesson_order: number
  week_order: number
  course_id: number
  type: string
  is_public: boolean
}
interface Lesson {
  id: string
  type: string
  title: string
  is_public: boolean
}
interface Week {
  id: string
  title: string
  content: Lesson[]
}

const updateLessons = async (
  oldLessons: LessonBlock[],
  newLessons: LessonBlock[]
): Promise<any> => {
  for (const oldLesson of oldLessons) {
    const idx = newLessons.findIndex(
      (newLesson) => newLesson.lesson_id === oldLesson.lesson_id
    )

    if (idx === -1) {
      await deleteLesson(oldLesson.lesson_id, oldLesson.type)
      await dbQuery(queryList.DELETE_LESSON, [oldLesson.lesson_id])
      continue
    }

    if (oldLesson.type !== newLessons[idx].type) {
      await deleteLesson(oldLesson.lesson_id, oldLesson.type)
      await dbQuery(queryList.DELETE_LESSON, [oldLesson.lesson_id])
      await dbQuery(queryList.ADD_LESSON, [
        newLessons[idx].lesson_id,
        newLessons[idx].week_id,
        String(newLessons[idx].course_id),
        newLessons[idx].lesson_title,
        String(newLessons[idx].lesson_order),
        newLessons[idx].type,
        String(newLessons[idx].is_public)
      ])
      if (newLessons[idx].type === 'video') {
        await dbQuery(queryList.ADD_VIDEO_HIDDEN_ID, [
          newLessons[idx].lesson_id,
          uuidv4()
        ])
      }
      continue
    }

    if (
      oldLesson.week_id !== newLessons[idx].week_id ||
      oldLesson.lesson_title !== newLessons[idx].lesson_title ||
      oldLesson.lesson_order !== newLessons[idx].lesson_order ||
      oldLesson.is_public !== newLessons[idx].is_public
    ) {
      await dbQuery(queryList.UPDATE_LESSON, [
        newLessons[idx].lesson_id,
        newLessons[idx].week_id,
        newLessons[idx].lesson_title,
        String(newLessons[idx].lesson_order),
        String(newLessons[idx].is_public)
      ])
    }
  }

  for (const newLesson of newLessons) {
    const idx = oldLessons.findIndex(
      (oldLesson) => oldLesson.lesson_id === newLesson.lesson_id
    )
    if (idx !== -1) continue
    await dbQuery(queryList.ADD_LESSON, [
      newLesson.lesson_id,
      newLesson.week_id,
      String(newLesson.course_id),
      newLesson.lesson_title,
      String(newLesson.lesson_order),
      newLesson.type,
      String(newLesson.is_public)
    ])
    if (newLesson.type === 'video') {
      await dbQuery(queryList.ADD_VIDEO_HIDDEN_ID, [
        newLesson.lesson_id,
        uuidv4()
      ])
    }
  }
}

export const getCourseContent = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const courseId = _req.params.courseId

    const queryResp = await dbQuery(queryList.GET_COURSE_CONTENT, [courseId])

    const courseContent: LessonBlock[] = queryResp.rows
    _res.locals.courseContent = []
    if (courseContent.length !== 0) {
      const RefactoredCourseContent: Week[] = []

      let weekOrder = 0
      for (const lesson of courseContent) {
        if (lesson.week_order === weekOrder) {
          RefactoredCourseContent.push({
            id: lesson.week_id,
            title: lesson.week_title,
            content: []
          })
          weekOrder++
        }

        RefactoredCourseContent[
          RefactoredCourseContent.length - 1
        ].content.push({
          id: lesson.lesson_id,
          title: lesson.lesson_title,
          type: lesson.type,
          is_public: lesson.is_public
        })
      }

      _res.locals.courseContent = RefactoredCourseContent
    }

    _next()
  } catch {
    return _res.sendStatus(500)
  }
}

export const updateContent = async (
  oldWeeks: Week[],
  newWeeks: Week[],
  courseId: string
): Promise<void> => {
  const done: number[] = []
  let weekOrder = 0
  for (const oldWeek of oldWeeks) {
    const idx = newWeeks.findIndex((newWeek) => newWeek.id === oldWeek.id)

    if (idx === -1) {
      await dbQuery(queryList.DELETE_WEEK, [oldWeek.id])
      weekOrder++
      continue
    }

    if (newWeeks[idx].title !== oldWeek.title || idx !== weekOrder) {
      await dbQuery(queryList.UPDATE_WEEK, [
        newWeeks[idx].id,
        String(idx),
        newWeeks[idx].title
      ])
    }
    done.push(idx)
    weekOrder++
  }

  const oldLessons: LessonBlock[] = []
  const newLessons: LessonBlock[] = []

  weekOrder = 0
  for (const newWeek of newWeeks) {
    const idx = oldWeeks.findIndex((oldWeek) => oldWeek.id === newWeek.id)

    if (idx === -1) {
      await dbQuery(queryList.ADD_WEEK, [
        newWeek.id,
        courseId,
        newWeek.title,
        String(weekOrder++)
      ])
      let lessonOrder = 0
      for (const lesson of newWeek.content) {
        await dbQuery(queryList.ADD_LESSON, [
          lesson.id,
          newWeek.id,
          courseId,
          lesson.title,
          String(lessonOrder++),
          lesson.type,
          String(lesson.is_public)
        ])
        if (lesson.type === 'video') {
          await dbQuery(queryList.ADD_VIDEO_HIDDEN_ID, [lesson.id, uuidv4()])
        }
      }
      weekOrder++
      continue
    }

    oldWeeks[idx].content.forEach((lesson, i) => {
      oldLessons.push({
        lesson_id: lesson.id,
        week_id: oldWeeks[idx].id,
        is_public: lesson.is_public,
        course_id: parseInt(courseId),
        type: lesson.type,
        lesson_order: i,
        lesson_title: lesson.title,
        week_order: 0,
        week_title: ''
      })
    })

    newWeek.content.forEach((lesson, i) => {
      newLessons.push({
        lesson_id: lesson.id,
        week_id: newWeek.id,
        is_public: lesson.is_public,
        course_id: parseInt(courseId),
        type: lesson.type,
        lesson_order: i,
        lesson_title: lesson.title,
        week_order: 0,
        week_title: ''
      })
    })

    weekOrder++
  }
  await updateLessons(oldLessons, newLessons)
}

export const getVideoHiddenId = async (publicId: string): Promise<any> => {
  const queryResp = await dbQuery(queryList.GET_VIDEO_ID, [publicId])
  if (queryResp.rows.length === 0) return ''
  return queryResp.rows[0].hidden_id
}

export const deleteLesson = async (
  publicId: string,
  type: string
): Promise<any> => {
  if (type === 'quiz') return

  await deleteElement(
    type === 'video' ? await getVideoHiddenId(publicId) : publicId
  )
}

export const checkAuthor = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const accountId: string = _res.locals.accountId
    const courseId: string = _req.params.courseId

    if (accountId == null) return _res.sendStatus(401)
    if (!/^[0-9]+$/.test(courseId)) return _res.sendStatus(400)

    const queryResp = await dbQuery(queryList.CHECK_COURSE_AUTHOR, [
      courseId,
      accountId
    ])

    if (queryResp.rows[0].exists === false) return _res.sendStatus(403)

    _next()
  } catch {
    return _res.sendStatus(500)
  }
}

export const checkLessonAccess = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const accountId: string = _res.locals.accountId
    const courseId: string = _req.params.courseId
    const publicId: string = _req.params.publicId

    if (accountId == null) return _res.sendStatus(401)
    if (!/^[0-9]+$/.test(courseId)) return _res.sendStatus(400)

    const queryResp = await Promise.all([
      dbQuery(queryList.CHECK_COURSE_AUTHOR, [courseId, accountId]),
      dbQuery(queryList.CHECK_PURCHASE, [accountId, courseId]),
      dbQuery(queryList.GET_LESSON, [publicId])
    ])

    // author or bought it
    let hasAccess: boolean =
      Boolean(queryResp[0].rows[0].exists) ||
      Boolean(queryResp[1].rows[0].exists)

    // is lesson public ?
    if (queryResp[2].rows.length !== 0) {
      if (String(queryResp[2].rows[0].course_id) !== courseId) {
        return _res.sendStatus(404)
      }
      hasAccess = hasAccess || queryResp[2].rows[0].is_public === true
    }

    _res.locals.accessType =
      queryResp[0].rows[0].exists === true ? 'author' : 'student'
    if (!hasAccess) return _res.sendStatus(403)
    _next()
  } catch {
    return _res.sendStatus(500)
  }
}

export const getLessonType = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const courseId = _req.params.courseId
    const publicId = _req.params.publicId

    if (!/^[0-9]+$/.test(courseId)) return _res.sendStatus(400)

    const queryResp = await dbQuery(queryList.GET_LESSON, [publicId])

    if (queryResp.rows.length === 0) return _res.sendStatus(404)
    if (String(queryResp.rows[0].course_id) !== courseId) {
      return _res.sendStatus(404)
    }

    _res.locals.lessonType = queryResp.rows[0].type
    _next()
  } catch {
    return _res.sendStatus(500)
  }
}

export const checkPurchase = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  try {
    const accountId: string = _res.locals.accountId
    const courseId = _req.params.courseId ?? _req.body.course_id

    if (!/^[0-9]+$/.test(courseId)) return _res.sendStatus(400)

    const queryResp2 = await dbQuery(queryList.CHECK_PURCHASE, [
      accountId,
      courseId
    ])

    if (queryResp2.rows[0].exists === false) {
      return _res.sendStatus(403)
    }
    _next()
  } catch {
    return _res.sendStatus(500)
  }
}

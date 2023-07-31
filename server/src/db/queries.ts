export const queryList = {
  ADD_ACCOUNT:
    'insert into account(mail, password, first_name, last_name) values($1, $2, $3, $4)',
  ADD_GOOGLE_ACCOUNT:
    "insert into account(mail, password, active, first_name, last_name) values($1, 'google password', true, $2, $3)",
  VERIFY_ACCOUNT: 'update account set active = true where id = $1',
  UPDATE_ACCOUNT_PASSWORD: 'update account set password = $1 where id = $2',
  GET_ACCOUNT: 'select * from account where mail = $1',
  GET_STUDENT_ACCOUNT_DETAILS_BY_ID:
    'select id, mail, role, first_name, last_name from account where id = $1',
  GET_INSTRUCTOR_ACCOUNT_DETAILS_BY_ID:
    'select bio, contacts from instructor_data where account_id = $1',
  GET_ACCOUNT_DETAILS_BY_MAIL:
    'select id, mail, role, first_name, last_name from account where mail = $1',
  GET_ACCOUNT_ROLE: 'select role from account where id = $1',

  CHECK_INSTRUCTOR_DATA:
    'select exists(select account_id from instructor_data where account_id = $1)',
  ADD_INSTRUCTOR_DATA:
    'insert into instructor_data(account_id, bio, contacts) values($1, $2, $3)',
  UPDATE_INSTRUCTOR_DATA:
    'update instructor_data set bio = $1, contacts = $2 where account_id = $3',

  ADD_VERIFICATION_ID:
    "insert into verification values((SELECT currval('account_id_seq')), $1)",
  GET_VERIFICATION_ID:
    'select verification_id from verification where account_id = $1',
  GET_UNVERIFIED_ACCOUNT_ID:
    'select account_id from verification where verification_id = $1',
  DELETE_VERIFICATION: 'delete from verification where account_id = $1',

  ADD_RESET_ID:
    'insert into reset_password(account_id, reset_id) values($1, $2)',
  GET_RESET_ID: 'select * from reset_password where account_id = $1',
  GET_ACCOUNT_ID_BY_RESET_ID:
    'select account_id from reset_password where reset_id = $1',
  DELETE_RESET_ID: 'delete from reset_password where account_id = $1',

  ADD_COURSE:
    'insert into course(author_id, title, level, field, department, price, discount, discount_last_date, description, what_you_will_learn, requirements) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
  UPDATE_COURSE:
    'update course set title = $1, level = $2, field = $3, department = $4, price = $5, discount = $6, discount_last_date = $7, description = $8, what_you_will_learn = $9, requirements = $10 where id = $11',
  PUBLISH_COURSE: 'update course set publish = true where id = $1',
  CHECK_COURSE_AUTHOR:
    'select exists(select id from course where id = $1 and author_id = $2)',

  GET_COURSE_CONTENT:
    'select * from (select * from course_weeks where course_id = $1) as cw inner join lesson as l on cw.week_id = l.week_id order by cw.week_order, l.lesson_order',
  ADD_WEEK:
    'insert into course_weeks(week_id, course_id, week_title, week_order) values($1, $2, $3, $4)',
  DELETE_WEEK: 'delete from course_weeks where week_id = $1',
  UPDATE_WEEK:
    'update course_weeks set week_order = $2, week_title = $3 where week_id = $1',

  ADD_LESSON:
    'insert into lesson(lesson_id, week_id, course_id, lesson_title, lesson_order, type, is_public) values($1, $2, $3, $4, $5, $6, $7)',
  DELETE_LESSON: 'delete from lesson where lesson_id = $1',
  UPDATE_LESSON:
    'update lesson set week_id = $2, lesson_title = $3, lesson_order = $4, is_public = $5 where lesson_id = $1',
  GET_LESSON: 'select * from lesson where lesson_id = $1',
  COUNT_COURSE_LESSONS: 'select count(*) from lesson where course_id = $1;',

  GET_COURSE: 'select * from course where id = $1',
  GET_LAST_ADDED_COURSE_ID: "SELECT currval('course_id_seq')",
  GET_INSTRUCTOR_COURSES:
    'select c.id, c.title, c.price, a.first_name, a.last_name from (select id, author_id, title, price from course where author_id = $1) as c inner join account as a on c.author_id = a.id',
  GET_STUDENT_COURSES: `
select
  c.id,
  c.title,
  ac.first_name,
  ac.last_name,
  COALESCE(SUM(CASE WHEN lc.account_id = p.account_id THEN 100 ELSE 0 END) / COUNT(l.lesson_id), 0) AS completion_percentage
from
(select * from purchase where account_id = $1) as p
inner join course c on p.course_id = c.id
left join account ac on c.author_id = ac.id
left join lesson l on c.id = l.course_id
left join lesson_completed lc on l.lesson_id = lc.lesson_id
group by
c.id,
ac.first_name,
ac.last_name;
`,
  EXPLORE_COURSES:
    'select c.id, c.title, c.price, a.first_name, a.last_name from (select id, author_id, title, price from course) as c inner join account as a on c.author_id = a.id',
  ADD_VIDEO_HIDDEN_ID:
    'insert into s3_hidden_video_id (public_id, hidden_id) values ($1, $2)',
  DELETE_VIDEOS_HIDDEN_ID:
    'delete from s3_hidden_video_id where public_id = $1',
  GET_VIDEO_ID: 'select * from s3_hidden_video_id where public_id = $1',

  ADD_QUIZ:
    'insert into lesson_quiz_question(quiz_id, question_order, title, answer, options) values %L',
  GET_QUIZ:
    'select title, options, answer from lesson_quiz_question where quiz_id = $1 order by question_order',
  DELETE_QUIZ: 'delete from lesson_quiz_question where quiz_id = $1',

  ADD_QUIZ_RESULT:
    'insert into quiz_results(student_id, quiz_id, result, total) values($1, $2, $3, $4)',
  UPDATE_QUIZ_RESULT:
    'update quiz_results set result = $3, total = $4 where student_id = $1 and quiz_id = $2',
  GET_QUIZ_RESULT:
    'select * from quiz_results where student_id = $1 and quiz_id = $2',

  ADD_PURCHASE: 'insert into purchase(account_id, course_id) values($1, $2)',
  CHECK_PURCHASE:
    'select exists(select * from purchase where account_id = $1 and course_id = $2)',

  ADD_LESSON_TOKEN: 'insert into lesson_token(token) values($1)',
  DELETE_LESSON_TOKEN: 'delete from lesson_token where token = $1',
  CHECK_LESSON_TOKEN:
    'select exists(select * from lesson_token where token = $1)',

  MARK_COMPLETED:
    'insert into lesson_completed(account_id, lesson_id) values($1, $2)',
  CHECK_COMPLETED:
    'select exists(select * from lesson_completed where account_id = $1 and lesson_id = $2)',
  GET_COMPLETED:
    'select * from ((select * from lesson_completed where account_id = $1) as lc inner join (select lesson_id, course_id from lesson where course_id = $2) as l on lc.lesson_id = l.lesson_id)'
}

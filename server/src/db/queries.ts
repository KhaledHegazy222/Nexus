exports.queryList = {
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
    'select a.id, a.mail, a.role, a.first_name, a.last_name, i.bio, i.contacts from (select id, mail, role, first_name, last_name from account where id = $1) as a inner join instructor_data as i on i.account_id = a.id',
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
    'insert into course(author_id, title, level, field, department, price, description, what_you_will_learn, requirements) values($1, $2, $3, $4, $5, $6, $7, $8, $9)',
  PUBLISH_COURSE: 'update course set publish = true where id = $1',
  CHECK_COURSE_AUTHOR:
    'select exists(select id from course where id = $1 and author_id = $2)',
  GET_COURSE_CONTENT: 'select content from course where id = $1',
  UPDATE_COURSE_CONTENT: 'update course set content = $1 where id = $2',
  GET_COURSE: 'select * from course where id = $1',

  ADD_LESSONS:
    'insert into s3_id (public_id, hidden_id, lesson_type) values %L',
  DELETE_LESSON: 'delete from s3_id where public_id = $1',
  UPDATE_LESSON: 'update s3_id set lesson_type = $1 where public_id = $2',
  GET_S3ID: 'select * from s3_id where public_id = $1',

  ADD_PURCHASE: 'insert into purchase(account_id, course_id) values($1, $2)',
  CHECK_PURCHASE:
    'select exists(select * from purchase where account_id = $1 and course_id = $2)'
}

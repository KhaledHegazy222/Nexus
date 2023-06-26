exports.queryList = {
  ADD_ACCOUNT:
    'insert into account(mail, password, first_name, last_name) values($1, $2, $3, $4)',
  VERIFY_ACCOUNT: 'update account set active = true where id = $1',
  UPDATE_ACCOUNT_PASSWORD: 'update account set password = $1 where id = $2',
  GET_ACCOUNT: 'select * from account where mail = $1',
  GET_ACCOUNT_DETAILS_BY_ID:
    'select id, mail, role, first_name, last_name from account where id = $1',
  GET_ACCOUNT_DETAILS_BY_MAIL:
    'select id, mail, role, first_name, last_name from account where mail = $1',

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
  DELETE_RESET_ID: 'delete from reset_password where account_id = $1'
}
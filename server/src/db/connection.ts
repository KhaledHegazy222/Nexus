const pool = require('./pool')

exports.dbQuery = async (queryText: string, queryParams: string[]) => {
  try {
    const resp = await pool.query(queryText, queryParams)
    return resp
  } catch {
    return new Error('db Error')
  }
}

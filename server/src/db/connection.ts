const pool = require('./pool')

export const dbQuery = async (
  queryText: string,
  queryParams: string[]
): Promise<any> => {
  const connection = await pool.connect()
  const resp = await pool.query(queryText, queryParams)
  connection.release()
  return resp
}

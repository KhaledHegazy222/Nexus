const pool = require('./pool')

exports.dbQuery = async (queryText: string, queryParams: string[]) => {
  const connection = await pool.connect()
  console.log('Connection ID:', connection.processID)
  const resp = await pool.query(queryText, queryParams)
  connection.release()
  return resp
}

interface QueryObject {
  query: string
  params: string[]
}

exports.dbQueries = async (queries: QueryObject[]) => {
  const connection = await pool.connect()
  try {
    console.log('Connection ID:', connection.processID)
    await pool.query('BEGIN')
    for (const q of queries) {
      await pool.query(q.query, q.params)
    }
    await pool.query('COMMIT')
  } catch {
    await pool.query('ROLLBACK')
    return new Error('Transaction failed')
  } finally {
    connection.release()
  }
}

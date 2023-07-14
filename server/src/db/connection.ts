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
    // await pool.query('BEGIN')
    const resp = await Promise.allSettled(
      queries.map(async (q) => {
        const r = await pool.query(q.query, q.params)
        return r
      })
    )
    // await pool.query('COMMIT')
    if (resp != null) {
      const failedQueries = resp.filter((result) => {
        if (result.status === 'rejected') {
          console.log(result)
          return true
        }
        return false
      })
      if (failedQueries.length > 0) {
        throw new Error('Transaction failed')
      }
    }
  } catch {
    // await pool.query('ROLLBACK')
    return new Error('Transaction failed')
  } finally {
    connection.release()
  }
}

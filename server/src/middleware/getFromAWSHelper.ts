import { type Request, type Response, type NextFunction } from 'express'
import { GetObjectCommand } from '@aws-sdk/client-s3'
const s3 = require('../s3Client')

export const getObject = async (
  _req: Request,
  _res: Response,
  _next: NextFunction
): Promise<any> => {
  const command = new GetObjectCommand({
    Bucket: s3.BUCKET,
    Key: _req.params.publicId
  })

  try {
    const response = await s3.client.send(command)
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString()
    _res.locals.reading = str
    _next()
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'NoSuchKey') return _res.sendStatus(404)
    }
    return _res.sendStatus(500)
  }
}

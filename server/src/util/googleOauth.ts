const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()

const client = new OAuth2Client(process.env.VITE_GOOGLE_OAUTH_CLIENT_ID)

export const verifyIdToken = async (token: any): Promise<any> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token.token,
      audience: process.env.VITE_GOOGLE_OAUTH_CLIENT_ID
    })
    const payload = ticket.getPayload()
    return {
      email: payload.email,
      emailVerified: payload.email_verified,
      firstName: payload.given_name,
      lastName: payload.family_name
    }
  } catch (err: any) {
    return null
  }
}

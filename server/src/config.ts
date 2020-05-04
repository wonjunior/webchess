import * as dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/../.env` })

export const {
  PORT,
  MONGO_CONNECTION_STRING,
  OKTA_ISSUER,
  OKTA_CLIENT_ID,
  OKTA_EXPECTED_AUDIENCE,
  CHESS_API_ROOT
} = <{ [key: string]: string }>process.env

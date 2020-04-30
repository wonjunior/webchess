import * as dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/../.env` })

export const PORT = process.env.PORT
/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from './config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1} from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () =>{
  const app = express()

  //Enable req.body json data
  app.use(express.json())

  //Use api v1
  app.use('/v1', APIs_V1)

  //middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)
  // app.use((err, req, res, next) => {
  //   console.error(err.stack)
  //   res.status(500).send('Something broke!')
  // })

  app.get('/', (req, res) => {
    // console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, Backend Server is running successfully at Host: ${env.APP_HOST} and Port: ${env.APP_PORT}`)
  })

  //Thực hiện các tác vụ clean up trước khi đóng ứng dụng.
  exitHook(() => {
    console.log('4. Disconnecting.....')
    CLOSE_DB()
  })
}
//connect tới DB
//Immediately-invoked Function / Anonymous Async Functions (IIFE)
(async () => {
  try {
    console.log('1. Conecting to MongoDB Cloud atlas...')
    await CONNECT_DB()
    console.log('2. Conected to MongoDB Cloud atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()


//Một cách khác để connect tới DB
// console.log('1. Conecting to MongoDB Cloud atlas...')
// CONNECT_DB()
//   .then(() => console.log('2. Conected to MongoDB Cloud atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
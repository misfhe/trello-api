//quangminhsfc 3PQz0T3XqmSL2FII

import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

//Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi:{
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

//KẾT NỐI TỚI DATABASE - MỨC GLOBAL
export const CONNECT_DB = async () =>{
  //Gọi kết nối tới MongoDB Atlas
  await mongoClientInstance.connect()

  //Kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến trelloDatabase
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//Đóng kết nối DB
export const CLOSE_DB = async () =>{
  await mongoClientInstance.close()
}


//Function GET_DB này có nhiệm vụ export ra Trello database sau khi đã connect thành công tới MongoDB
//Lưu ý chỉ gọi GET_DB khi kết nối tới DB thành công
export const GET_DB = () =>{
  if (!trelloDatabaseInstance) throw new Error('Must connect to Databse first!')
  return trelloDatabaseInstance
}


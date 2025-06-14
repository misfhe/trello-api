import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

//Lưu giá trị các trường không được phép update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId']

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) =>{
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne({ 
      ...validData,
      boardId: new ObjectId(validData.boardId)
    })
  } catch (error) { throw new Error(error) }
}

//Push một giá trị cardId vào cuối mảng cardOrderIds
const pushCardOrderIds = async (card) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      { $push: { cardOrderIds: new ObjectId(card._id) } },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) =>{
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (columnId, updateData) => {
  try {
    //Loại bỏ các trường không được phép update
    Object.keys(updateData).forEach( fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    if( updateData.cardOrderIds ) {
      updateData.cardOrderIds = updateData.cardOrderIds.map( _id => (new ObjectId(_id)) )
    }

    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}


const deleteOneById = async (id) =>{
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  pushCardOrderIds,
  createNew,
  findOneById,
  update,
  deleteOneById
}
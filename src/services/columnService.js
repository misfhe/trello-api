import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)
    console.log(createdColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    console.log(getNewColumn)

    // add new handler
    if (getNewColumn){
      getNewColumn.cards = []

      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw error
  }
}


const update = async (columnId, reqBody) => {
  try {
    const updatedData ={
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updatedData)

    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    const targerColumn = await columnModel.findOneById(columnId)

    if (!targerColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }

    // Xóa column khỏi board
    await columnModel.deleteOneById(columnId)

    //Xóa toàn bộ cards trong column
    await cardModel.deleteManyByColumnId(columnId)

    //Xóa column trong columnOrderIds của board
    await boardModel.pullColumnOrderIds(targerColumn)

    return { deleteResult: 'Column and cards are deleted successfully!' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}
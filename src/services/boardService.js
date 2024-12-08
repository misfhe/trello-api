import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    //Gọi tới tầng Model
    const createdBoard = await boardModel.createNew(newBoard)
    console.log(createdBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    console.log(getNewBoard)

    //Làm thêm các xử lý logic khác với Collection
    //Notify mail về khi có board mới tạo

    return getNewBoard
  } catch (error) {
    //
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    const resBoard = cloneDeep(board)

    resBoard.columns.forEach(column => {
      //MongoDB support .equals
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    //
  }
}

export const boardService = {
  createNew,
  getDetails
}
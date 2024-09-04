import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  try {
    // console.log('req.body: ', req.body)
    // console.log('req.params: ', req.params)
    // console.log('req.files: ', req.files)
    // console.log('req.query: ', req.query)
    // console.log('req.cookies: ', req.cookies)
    // console.log('req.jwtDecoded: ', req.jwtDecoded)

    //điều hướng dữ liệu sang tầng service

    //có Kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json({ message: 'POS from controller: API create new board' })
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}

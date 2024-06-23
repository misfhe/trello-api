/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title min 3 chars',
      'string.max': 'Title max 50 chars',
      'string.trim': 'Title must not have leading or trailing whitespaces'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description is not allowed to be empty',
      'string.min': 'Description min 3 chars',
      'string.max': 'Description max 50 chars',
      'string.trim': 'Description must not have leading or trailing whitespaces'
    })
  })
  try {
    console.log(req.body)
    // set abortEarly to false for logging all errors at once
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //next()
    res.status(StatusCodes.CREATED).json({ message: 'POS from validation: API create new board' })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }

}

export const boardValidation = {
  createNew
}
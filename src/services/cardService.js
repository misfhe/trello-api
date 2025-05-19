import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }

    const createdCard = await cardModel.createNew(newCard)
    console.log(createdCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    console.log(getNewCard)

    // add new handler
    if (getNewCard){
      // getNewCard.cards = []

      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}
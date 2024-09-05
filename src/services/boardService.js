import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    //Gọi tới tầng Model

    //Làm thêm các xử lý logic khác với Collection
    //Notify mail về khi có board mới tạo

    return newBoard
  } catch (error) {
    //
  }
}

export const boardService = {
  createNew
}
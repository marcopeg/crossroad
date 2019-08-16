import uuid from 'uuid/v4'

export const sortByDate = items => {
    const copy = [...items]
    copy.sort((a, b) => (a.createdAt - b.createdAt))
    return copy
}

export const data2list = data =>
    sortByDate(data).map($ => $.id)

export const data2map = data =>
    data.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr,
    }), {})

export const newPart = (text = '') => ({
    id: uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    text,
})

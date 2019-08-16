import * as utils from './utils'

const input01 = [
    { id: 'i1', createdAt: new Date('2019-07-11') },
    { id: 'i2', createdAt: new Date('2019-07-10') },
]

describe('Editor Utils', () => {
    describe('sortByDate', () => {
        test('should sort correctly', () => {
            const results = utils.sortByDate(input01)
            expect(results[0].id).toBe('i2')
            expect(results[1].id).toBe('i1')
        })
    })
    describe('data2list', () => {
        test('should get sorted ids', () => {
            const results = utils.data2list(input01)
            expect(results[0]).toBe('i2')
            expect(results[1]).toBe('i1')
        })
    })
    describe('data2map', () => {
        test('should get a proper mapped object', () => {
            const map = utils.data2map(input01)
            expect(Object.keys(map)).toEqual([ 'i1', 'i2' ])
        })
    })
})

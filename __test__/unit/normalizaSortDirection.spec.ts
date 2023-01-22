import {normalizeSortDirection} from "../../src/helpers/normalizeSortDirection";
import generateRandomString from "../../src/helpers/generateRandomString";
// @ts-ignore
import {getRandomIntInclusive} from "../helpers/getRandomIntInclusive";

describe('normalizeSortDirection function', () => {

    it('should return same with correct input', () => {
        expect(normalizeSortDirection('asc')).toBe('asc')
        expect(normalizeSortDirection('desc')).toBe('desc')
    })

    it('should return default , input is incorrect string', () => {
        const array = Array('a', 'd', 'anything', '')
        while (array.length !== 500) array.push(generateRandomString(getRandomIntInclusive(1, 100)))
        array.forEach(el => expect(normalizeSortDirection(el)).toBe('desc'))
    })

    it('should return \'desc\', with any input ', () => {
        const garbage: Array<any> = [
            false, true, null, undefined, NaN, getRandomIntInclusive(1,10*18) , Infinity, Symbol('asc'), ['asc', 'desc'],
            {}, [], {query: {sortDirection: 'asc'}}, {query: {sortDirection: 'desc'}}
        ]
        garbage.forEach(el => expect(normalizeSortDirection(el)).toBe('desc'))
    });
})
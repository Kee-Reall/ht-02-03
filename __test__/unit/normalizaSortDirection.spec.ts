import {normalizeSortDirection} from "../../src/helpers/normalizeSortDirection";
import generateRandomString from "../../src/helpers/generateRandomString";
// @ts-ignore
import {getRandomIntInclusive} from "../helpers/getRandomIntInclusive";

describe('normalizeSortDirection function', ()=> {

    it('should return same with correct input',()=>{
        expect(normalizeSortDirection('asc')).toBe('asc')
        expect(normalizeSortDirection('desc')).toBe('desc')
    })

    it('should return default , input is incorrect string', ()=> {
        const array = Array('a','d','anything','')
        while (array.length !== 500) array.push(generateRandomString(getRandomIntInclusive(1,100)))
        array.forEach( el => {
            expect(normalizeSortDirection(el)).toBe('desc')
        })
    })

    it('should return \'desc\', with any input ', () => {
        expect(normalizeSortDirection(null)).toBe('desc')
        expect(normalizeSortDirection(undefined)).toBe('desc')
        expect(normalizeSortDirection(13)).toBe('desc')
        expect(normalizeSortDirection(NaN)).toBe('desc')
        expect(normalizeSortDirection(Infinity)).toBe('desc')
        expect(normalizeSortDirection(Symbol('asc'))).toBe('desc')
        expect(normalizeSortDirection(['asc','desc'])).toBe('desc')
        expect(normalizeSortDirection({query:{sortDirection:'asc'}})).toBe('desc')
        expect(normalizeSortDirection({query:{sortDirection:'desc'}})).toBe('desc')
        expect(normalizeSortDirection({})).toBe('desc')
        expect(normalizeSortDirection([])).toBe('desc')
    });
})
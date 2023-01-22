import generateId from "../../src/helpers/generateId";

describe('testing \'generateId\' helper', () => {

    it.each(["blog" , "post" , "user" , "comment"])('should be string with argument \'%s\'', (argument) => {
        //@ts-ignore
        expect(generateId(argument)).toEqual(expect.any(String))
    })

    it.each(["blog" , "post" , "user" , "comment"])('should be unique \'%s\'', (argument) => {
        const array: Array<string> = []
        //@ts-ignore
        while (array.length !== 100) array.push(generateId(argument))
        expect(array.length).toBe(new Set(array).size)
    })

})
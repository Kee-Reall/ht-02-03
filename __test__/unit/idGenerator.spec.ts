import generateId from "../../src/helpers/generateId";
import {eternityId} from "../../src/models/mixedModels";

describe('testing \'generateId\' helper', () => {

    it.each(["blog", "post", "user", "comment"] as eternityId[])('should be string with argument \'%s\'', (argument) => {

        expect(generateId(argument)).toEqual(expect.any(String))
    })

    it.each(["blog", "post", "user", "comment"] as eternityId[])('should be unique \'%s\'', (argument) => {
        const array: Array<string> = []

        while (array.length !== 100) {
            const id = generateId(argument)
            array.push(id)

        }

        expect(array.length).toBe(new Set(array).size)
    })

})
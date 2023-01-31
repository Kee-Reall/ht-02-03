import {attemptsModel} from "../models/attemptsModel";
import {attempts} from "../adapters/mongoConnectorCreater";


class AttemptsRepository {
    public async addNewAttempt(input: attemptsModel){
        await attempts.insertOne(input)
    }

    public async getAttemptsCount(endpointAndIp: string,date: string) {
        return await attempts.count({endpointAndIp, date:{$gte:date}})
    }
}

export const attemptsRepository = new AttemptsRepository()
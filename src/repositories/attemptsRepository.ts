import {attemptsModel} from "../models/attemptsModel";
import {Attempts} from "../adapters/mongooseCreater";


class AttemptsRepository {
    public async addNewAttempt(input: attemptsModel){
        await Attempts.create(input)
    }

    public async getAttemptsCount(endpointAndIp: string,date: string) {
        return Attempts.count({endpointAndIp, date:{$gte:date}})
    }
}

export const attemptsRepository = new AttemptsRepository()
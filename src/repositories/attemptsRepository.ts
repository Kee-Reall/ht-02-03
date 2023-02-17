import {AttemptsModel} from "../models/attemptsModel";
import {Attempts} from "../adapters/mongooseCreater";


class AttemptsRepository {
    public async addNewAttempt(input: AttemptsModel): Promise<void> {
        await Attempts.create(input)
    }

    public async getAttemptsCount(endpointAndIp: string, date: string): Promise<number> {
        return Attempts.count({endpointAndIp, date: {$gte: date}})
    }
}

export const attemptsRepository = new AttemptsRepository()
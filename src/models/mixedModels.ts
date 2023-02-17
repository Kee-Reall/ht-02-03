import {Model} from "mongoose";

export type eternityId = "blog" | "post" | "user" | "comment" | "like"
export type sortingDirection = "asc" | "desc"
export interface TokenPair {
    accessToken: string
    refreshToken: string
}

export type CreateTokenClientMeta = {
    userId: string
    ip: string
    title: string
}

export type ClientMeta = {
    deviceId: string
    ip?: string
    deviceInfo?: string
    userId: string
    updateDate: string
}

export type ModelWithSchema<SchemaType> = Model<any,{},{},{},SchemaType>

export type NullablePromise<T> = Promise< T | null >
export type Nullable<Entity> = Entity | null
export type Entire<PartialEntity> = Partial<PartialEntity> & {[Key in keyof PartialEntity]-?: PartialEntity[Key]};
export type IdCreatorFunction = (param: eternityId) => string
export type HashFunction = (data: string | Buffer, saltOrRounds: string | number) => Promise<string>
export type SaltFunction = (rounds?: number, minor?: "a" | "b") => Promise<string>
export type AddFunction = (date: Date | number, duration: Duration) => Date
export type IsAfterFunction = (date: Date | number, dateToCompare: Date | number) => boolean
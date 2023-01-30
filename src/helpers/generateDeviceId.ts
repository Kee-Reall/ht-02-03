import generateRandomString from "./generateRandomString";

export const generateDeviceId = (): string => {
    return  `dvc${generateRandomString(3)}`
}
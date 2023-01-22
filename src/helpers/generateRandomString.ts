export default (lenModifier: number = 1): string => {
    let result = ''
    for (let i = 0; i <= lenModifier; i++) {
        result += Math.floor(Math.random() * (10 ** 18)).toString(36)
    }
    return result
}
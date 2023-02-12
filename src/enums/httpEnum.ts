export enum httpMethod {
    get = "GET",
    post = "POST",
    put = "PUT",
    patch = "PATCH",
    del = "DELETE"
}

export enum httpStatus {
    ok = 200,
    created = 201,
    noContent = 204,
    badRequest = 400,
    notAuthorized = 401,
    forbidden = 403,
    notFound = 404,
    deprecated = 405,
    teapot = 418,
    tooManyRequests = 429
}
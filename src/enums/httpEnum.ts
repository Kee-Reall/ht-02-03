export enum httpMethod {
    get = "GET",
    post = "POST",
    put = "PUT",
    patch = "PATCH",
    del = "DELETE"
}

export enum httpStatus {
    ok = 200,
    noContent=204,
    badRequest = 400,
    notAuthorized = 401,
    notFound = 404,
    teapot = 418
}
export default (string: "blog" | "post"): string => string + Math.ceil(Math.random() * (10 ** 16)).toString(36)
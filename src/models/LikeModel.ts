export interface LikeModel {
    id: string
    addAt: Date
    target: string
    userId: string
    login: string
    likeStatus: "Like" | "Dislike"
}
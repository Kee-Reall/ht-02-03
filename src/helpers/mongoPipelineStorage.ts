import {SearchConfiguration} from "../models/searchConfiguration";
import {PostViewModel} from "../models/postsModel";
import {Nullable} from "../models/mixedModels";
import {PipelineStage} from "mongoose"

export function likesInfo<T>(config: SearchConfiguration<T>, userId: Nullable<string>): PipelineStage[] {
    return [
        {
            $lookup: {
                from: "likes",
                let: {postId: "$id"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            {$eq: ["$target", "$$postId"]},
                                            {$ne: ["$likeStatus", "None"]}
                                        ]
                                    },
                                    {
                                        $and: [
                                            {$eq: ["$target", "$$postId"]},
                                            {$ne: ["userId", userId]}
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $sort: {addedAt: -1}
                    },
                ],
                as: "likes"
            }
        },
        {
            $addFields: {
                likesInfo: {
                    likeCount: {
                        $reduce: {
                            input: "$likes",
                            initialValue: 0,
                            in: {
                                $cond: [
                                    {
                                        $and: [
                                            {$eq: ["$$this.likeStatus", "Like"]},
                                            {$ne: ["$$this.likeStatus", null]}
                                        ]
                                    },
                                    {$add: ["$$value", 1]},
                                    "$$value"
                                ]
                            }
                        }
                    },
                    dislikeCount: {
                        $reduce: {
                            input: "$likes",
                            initialValue: 0,
                            in: {
                                $cond: [
                                    {
                                        $and: [
                                            {$eq: ["$$this.likeStatus", "Dislike"]},
                                            {$ne: ["$$this.likeStatus", null]}
                                        ]
                                    },
                                    {$add: ["$$value", 1]},
                                    "$$value"
                                ]
                            }
                        }
                    },
                    MyStatus: {
                        $reduce: {
                            input: "$likes",
                            initialValue: "None",
                            in: {
                                $cond: [
                                    {
                                        $and: [
                                            {$eq: ["$$this.userId", userId]},
                                            {$ne: ["$$this.likeStatus", null]}
                                        ]
                                    },
                                    "$$this.likeStatus",
                                    "$$value"
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                __v: 0,
                likes: 0
            }
        },
        {
            $sort: {[config.sortBy]: config.sortDirection! === 'asc' ? 1 : -1}
        },
        // Пропускаем нужное количество записей
        {
            $skip: config.shouldSkip
        },
        // Ограничиваем количество записей
        {
            $limit: config.limit
        }
    ]
}
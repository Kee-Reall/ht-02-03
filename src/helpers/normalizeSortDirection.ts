import {sortingDirection} from "../models/mixedModels";

export const normalizeSortDirection = (argument?: any): sortingDirection => argument === 'asc' ? argument : 'desc'
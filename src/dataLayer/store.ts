import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postViewModel} from "../models/postsModel";

class Store {
    constructor(
        public blogs: blogViewModel[],
        public posts: postViewModel[]
    ) {}

    getAllBlogs() {
        return this.blogs
    }

    getBlog(id:string) {
        return this.blogs.find( el => el.id === id)
    }

    createBlog(blog: blogInputModel) {
        const id: string = Date.now().toString(36)
        const toPush = {...blog,id}
        this.blogs.push(toPush)
        return toPush
    }

    updateBlog(id: string,blog: blogInputModel) {
        this.blogs = this.blogs.map(el =>{
           if (el.id === id) {
               return {id: el.id,...blog}
           }
           return el
        })
    }

    delete(id: string) {
        this.blogs = this.blogs.filter(el=> el.id !== id)
    }
}

const store = new Store([],[])
export { store }
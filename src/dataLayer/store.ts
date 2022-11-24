import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postViewModel, postInputModel} from "../models/postsModel";

class Store {
    constructor(
        public blogs: blogViewModel[],
        public posts: postViewModel[]
    ) {}

    getAllBlogs(): blogViewModel[] {
        return this.blogs
    }

    getBlog(id:string): blogViewModel | undefined {
        return this.blogs.find( el => el.id === id)
    }

    createBlog(blog: blogInputModel): blogViewModel | undefined {
        const id: string = Date.now().toString(36)
        const toPush = {id,...blog}
        this.blogs.push(toPush)
        return toPush
    }

    updateBlog(id: string,blog: blogInputModel): boolean {
        let flag = false
        this.blogs = this.blogs.map(el =>{
           if (el.id === id) {
               flag = true
               return {id: el.id,...blog}
           }
           return el
        })
        return flag
    }

    delete(id: string): boolean {
        let flag: boolean = false
        if(this.getBlog(id)) {
            flag = true
            this.blogs = this.blogs.filter(el=> el.id !== id)
        } 
        return flag
    }
}

const store = new Store([],[])
export { store }
import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postViewModel, postInputModel} from "../models/postsModel";

class Store {
    constructor(
        public blogs: blogViewModel[],
        public posts: postViewModel[]
    ) {}

    generateId(string: "blog" | "post") {
        return string + Math.ceil(Math.random() * (10 ** 15)).toString(36)
    }

    getAllBlogs(): blogViewModel[] {
        return this.blogs
    }

    getBlog(id:string): blogViewModel | undefined {
        return this.blogs.find( el => el.id === id)
    }

    createBlog(blog: blogInputModel): blogViewModel | undefined {
        const toPush = {id: this.generateId('blog'),...blog}
        this.blogs.push(toPush)
        return toPush
    }

    updateBlog(id: string,blog: blogInputModel): boolean {
        let flag = false
        this.blogs = this.blogs.map(el =>{
           if (el.id === id) {
               flag = true
               return {
                   id: el.id,
                   ...blog
               }
           }
           return el
        })
        return flag
    }

    deleteBlog(id: string): boolean {
        let flag: boolean = false
        if(this.getBlog(id)) {
            flag = true
            this.blogs = this.blogs.filter(el=> el.id !== id)
        } 
        return flag
    }

    getAllPosts(): postViewModel[] {
        return this.posts
    }

    getPost(id:string): postViewModel | undefined {
        return this.posts.find( el => el.id === id)
    }

    createPost(post: postInputModel) {
        const id = this.generateId("post")
        const blog = this.getBlog(post.blogId)
        const toPut = {id,...post, blogName: blog!.name}
        this.posts.push(toPut)
        return toPut
    }

    updatePost(id: string,post: postInputModel): boolean {
        let flag = false
        this.posts = this.posts.map((el) => {
            if(el.id === id) {
                const blogName = this.getBlog(el.blogId)!.name
                if(!blogName) {
                    return el
                }
                flag = true
                return {
                    id: el.id,
                    blogName,
                    ...post
                }
            } return el
        })
        return flag
    }

    deletePost(id: string): boolean {
        let flag: boolean = false
        if(this.getPost(id)) {
            flag = true
            this.posts = this.posts.filter(el=> el.id !== id)
        }
        return flag
    }


}

const store = new Store([],[])
export { store }
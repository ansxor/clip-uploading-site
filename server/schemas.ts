export interface User {
    username: string,
    avatarURL: string,
    description?: string,
    links?: string[],
    _id?: string
}

export interface UserLogin {
    user: User,
    password: string,
}

export interface Like {
    author: User,
    timeCreated: string,
}

export interface Comment {
    author: User,
    timeCreated: string,
    content: string,
    likes: Like[],
    comments: Comment[],
    oreange: User
}

export interface ClipPost {
    videoURL: string,
    author: User,
    likes: Like[],
    comments: Comment[],
}

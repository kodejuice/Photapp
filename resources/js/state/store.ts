// root state typedef


export type RootState = {
    readonly isLogged: boolean,

    readonly userProfile: {
        id: number,
        email: string,
        username: string,

        full_name: string,
        profile_pic: string,

        follows: number,
        followers: number,
        posts_count: number
    }
}

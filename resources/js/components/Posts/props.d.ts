/**
 * DB Post props
 * @type {Object}
 */
export type Post = {
      post_id: number,
      user_id: number,
      post_url: string,
      media_type: string,

      caption: string | null,
      tags: string | null,
      mentions: string | null,

      like_count: number,
      comment_count: number,

      username: string,
      auth_user_comment: string,
      auth_user_follows: boolean,
      auth_user_saved: boolean,
      auth_user_likes: boolean,

      created_at: Date,
      updated_at: Date,
}


/**
 * Post component properties
 * @type {Object}
 */
export type PostProp = {
      data: Post[],
      view: "grid" | "tile" | "home",
};

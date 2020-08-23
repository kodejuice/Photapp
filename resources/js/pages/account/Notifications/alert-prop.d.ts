
/**
 * Notification properties
 * @type {Object}
 */
export type AlertProp = {
      new: boolean,
      notification_id: number,
      type: 'mention' | 'comment' | 'like' | 'follow',
      message: string,
      user_id: number,
      created_at: Date,
      updated_at: Date,

      post_id: number|null,
      comment_id: number|null,
      associated_user: number|null,
};

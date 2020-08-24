
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
      associated_user: string,

      post_id: number|null,
      comment_id: number|null,
};

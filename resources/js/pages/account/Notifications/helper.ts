import {NotificationProp} from './types.d';
import {deleteNotification} from '../../../helpers/fetcher';
import differenceInDays from 'date-fns/differenceInDays';


/**
 * checks if the notification is over 3days old
 *
 * request for its deletion is true
 */
export function checkForDeletion(data: NotificationProp) {
    if (data.new == true) return; // still new, dont delete

    const daysSinceRead: number = differenceInDays(
        new Date(),
        new Date(data.updated_at)
    );

    if (daysSinceRead >= 3) {
        deleteNotification(data.notification_id);
    }

}


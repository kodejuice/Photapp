import {NotificationProp} from './types.d';
import {deleteNotification} from '../../../helpers/fetcher';
import differenceInDays from 'date-fns/differenceInDays';


/**
 * checks if the notification is over 7days old
 *
 * request for its deletion is true
 */
export function checkForDeletion(data: NotificationProp) {
    if (data.new == true) return; // still new, dont delete

    const daysSinceRead: number = differenceInDays(
        new Date(),
        new Date(data.updated_at)
    );

    // TODO: uncomment this!
    // if (daysSinceRead >= 7) {
    //     deleteNotification(data.notification_id);
    // }

}


/**
 * @debug_mode
 * this wont happen in the backend
 */
export function removeDuplicateFollows(data: NotificationProp[]) {
    const list = new Set();
    const clean: NotificationProp[] = [];

    for (let i=0; i<data.length; ++i) {
        let {type, associated_user} = data[i];

        if (type == 'follow') {
            if (!list.has(associated_user)) {
                clean.push(data[i]);
                list.add(associated_user);
            }
        } else {
            clean.push(data[i])
        }
    }

    return clean;
}

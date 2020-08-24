import differenceInSeconds from 'date-fns/differenceInSeconds'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInWeeks from 'date-fns/differenceInWeeks'

/**
 * Report the distance between now and a given data
 * @param {Date|number} d2   Date to compare against
 */
export function dateSince(d2: Date|number): string {
    d2 = new Date(d2);
    let d1: Date = new Date();

    const diff: number[] = [
        differenceInWeeks(d1, d2),

        differenceInDays(d1, d2),

        differenceInHours(d1, d2),

        differenceInMinutes(d1, d2),

        differenceInSeconds(d1, d2),
    ];

    const period: string[] = ['w', 'd', 'h', 'm', 's'];

    for (let i=0; i<diff.length; ++i) {
        if (diff[i] > 0) {
            return `${diff[i]}${period[i]}`;
        }
    }

    return '0s';
}

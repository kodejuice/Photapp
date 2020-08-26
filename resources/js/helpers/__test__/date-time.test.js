import {howLong} from '../date-time';

/**
 * unit test
 */

test("function returns correct output", ()=>{
    const d1 = new Date("2000/03/05");
    const weeks = howLong(d1);

    expect(weeks.match(/^(\d+)w$/) != null).toEqual(true);
    expect(parseInt(weeks) >= 1068).toEqual(true); // at least 1068 weeks since date d1

    const d2 = new Date();
    const seconds = howLong(d2);

    expect(seconds.match(/^(\d+)s$/) != null).toEqual(true);
    expect(parseInt(seconds) >= 0).toEqual(true);
});

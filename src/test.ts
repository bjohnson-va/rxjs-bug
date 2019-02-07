import { from, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('toPromise and from', () => {
    it('should behave sanely when dealing with a raw observable', () => {
        const sched = new TestScheduler((a, b) => expect(a).toEqual(b));
        const obs = of('something');
        sched.expectObservable(obs).toBe('(x|)', {x: 'something'});
        sched.flush();
    });
    it('should flow value all the way through when value is immediately resolved/closed', () => {
        const sched = new TestScheduler((a, b) => expect(a).toEqual(b));
        const obs = of('something');
        const promise = obs.toPromise();
        const obs2 = from(promise);
        sched.expectObservable(obs2).toBe('(x|)', {x: 'something'});
        sched.flush();
    });
    it('should flow value all the way through when value is eventually resolved/closed', () => {
        const sched = new TestScheduler((a, b) => expect(a).toEqual(b));
        const obs = sched.createColdObservable('--(x|)', {x: 'something'});
        const promise = obs.toPromise();
        const obs2 = from(promise);
        sched.expectObservable(obs2).toBe('--(x|)', {x: 'something'});
        sched.flush();
    });
    it('should emit a value when created from a real immediate promise', () => {
        const sched = new TestScheduler((a, b) => expect(a).toEqual(b));
        const promise = new Promise((resolve, reject) => resolve('something'));
        const obs2 = from(promise);
        sched.expectObservable(obs2).toBe('--(x|)', {x: 'something'});
        sched.flush();
    });

    it('should emit a value when created from a real eventual promise', () => {
        const sched = new TestScheduler((a, b) => expect(a).toEqual(b));
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve('something'), sched.createTime('--|'))
        });
        const obs2 = from(promise);
        sched.expectObservable(obs2).toBe('--(x|)', {x: 'something'});
        sched.flush();
    });
});

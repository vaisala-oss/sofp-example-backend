import {SofpMockBackend} from './';

test('Mock backend has single collection', () => {
    expect(SofpMockBackend.collections.length).toBe(1);
});

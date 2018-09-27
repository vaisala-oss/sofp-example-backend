import {SofpExampleBackend} from './';

test('Example backend has single collection', () => {
    expect(SofpExampleBackend.collections.length).toBe(1);
});

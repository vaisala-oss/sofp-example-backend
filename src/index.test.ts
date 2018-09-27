import {SofpExampleBackend} from './';

test('Example backend has single collection', () => {
    expect(SofpExampleBackend.collections.length).toBe(1);
});

test('Example backend collection returns no features', done => {
    var stream = SofpExampleBackend.collections[0].executeQuery({
        featureName: SofpExampleBackend.collections[0].name,
        filters: []
    });

    var objectsReceived = 0;
    stream.on('data', obj => {
        objectsReceived++;
    });

    stream.on('end', () => {
        expect(objectsReceived).toBe(0);
        done();
    });
});

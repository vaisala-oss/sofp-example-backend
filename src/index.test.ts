import {SofpExampleBackend} from './';

test('Example backend has single collection', () => {
    expect(SofpExampleBackend.collections.length).toBe(1);
});

test('Example backend collection, no filter, returns 7 features', done => {
    var stream = SofpExampleBackend.collections[0].executeQuery({
        nextToken: null,
        limit: 7,
        featureName: SofpExampleBackend.collections[0].name,
        filters: []
    });

    var objectsReceived = 0;
    stream.on('data', obj => {
        objectsReceived++;
    });

    stream.on('end', () => {
        expect(objectsReceived).toBe(7);
        done();
    });
});

test('Example backend collection, filter that discards every other feature, skip 50 & limit 100, returns 25 features', done => {
    var n = 0;
    var stream = SofpExampleBackend.collections[0].executeQuery({
        nextToken: '50',
        limit: 100,
        featureName: SofpExampleBackend.collections[0].name,
        filters: [{
            accept: f => {
                return (n++ % 2) === 0;
            }
        }]
    });

    var objectsReceived = 0;
    stream.on('data', obj => {
        objectsReceived++;
    });

    stream.on('end', () => {
        expect(objectsReceived).toBe(25);
        done();
    });
});


test('Example backend collection, skip 95, limit 10, returns 5 features (since collection has 100)', done => {
    var n = 0;
    var stream = SofpExampleBackend.collections[0].executeQuery({
        nextToken: '95',
        limit: 10,
        featureName: SofpExampleBackend.collections[0].name,
        filters: [{
            accept: f => {
                return (n++ % 1) === 0;
            }
        }]
    });

    var objectsReceived = 0;
    stream.on('data', obj => {
        objectsReceived++;
    });

    stream.on('end', () => {
        expect(objectsReceived).toBe(5);
        done();
    });
});

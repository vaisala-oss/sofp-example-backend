import {Backend, Collection, Link, Query, FeatureCursor, Feature} from '../../sofp-core';

let SofpMockBackend = new Backend('SofpMockBackend');

class MockCollection implements Collection {
    name : string = 'mock-collection';
    description : string = 'This is a mock collection packaged from sofp-mock-backend';
    links : Link[] = [{
        href:     'https://www.spatineo.com',
        rel:      'producer',
        type:     'text/html',
        hreflang: 'en',
        title:    'Spatineo Website'
    }];

    executeQuery(query : Query) : FeatureCursor {
        return new(class FooFeatureCursor implements FeatureCursor {
            hasNext() : boolean { return false; }
            next() : Feature { return null; }
            remainingFilter = []
        })();
    }
};

SofpMockBackend.collections.push(new MockCollection());

export {SofpMockBackend};
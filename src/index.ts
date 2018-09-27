import {Backend, Collection, Link, Query, FeatureStream, Feature} from 'sofp-lib';

let SofpExampleBackend = new Backend('SofpExampleBackend');

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

    executeQuery(query : Query) : FeatureStream {
        var ret = new FeatureStream();
        ret.remainingFilter = query.filters;
        ret.push(null);
        return ret;
    }
};

SofpExampleBackend.collections.push(new MockCollection());

export {SofpExampleBackend};
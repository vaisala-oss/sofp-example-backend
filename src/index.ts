import {Backend, Collection, Link, Query, FeatureStream, Feature} from 'sofp-lib';

let SofpExampleBackend = new Backend('SofpExampleBackend');

interface GeoJSONGeometry {
    type : string;
    coordinates : Number[];
};

interface GeoJSONFeature {
    type : string;
    properties : Map<String, any>;
    geometry: GeoJSONGeometry;
};

interface GeoJSONFeatureCollection {
    type: string;
    name: string;
    crs: object;
    features: GeoJSONFeature[];
};

class GeoJSONCollection implements Collection {
    name : string;
    description : string;
    links : Link[] = [];

    data : GeoJSONFeatureCollection;

    constructor(name, description, jsonFile) {
        this.name = name;
        this.description = description;
        this.data = require(__dirname+'/../'+jsonFile);
    }

    executeQuery(query : Query) : FeatureStream {
        var ret = new FeatureStream();
        // This example does no filtering of it's own
        ret.remainingFilter = query.filters;
        var idx = 0;
        var that = this;

        function next() {
            if (idx >= that.data.features.length) {
                ret.push(null);
                return;
            }
            var item = that.data.features[idx];
            
            idx++;
            ret.push(item);
            setTimeout(next, 5);
        }
        
        setTimeout(next, 5);

        return ret;
    }
};

SofpExampleBackend.collections.push(new GeoJSONCollection('forecast', 'Example forecast data by FMI', 'data/forecast.json'));

export {SofpExampleBackend};
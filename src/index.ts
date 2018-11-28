import {Backend, Collection, Link, Query, FeatureStream, Feature, Filter} from 'sofp-lib';

import * as _ from 'lodash';

let SofpExampleBackend = new Backend('SofpExampleBackend');

interface GeoJSONGeometry {
    type : string;
    coordinates : Number[];
};

interface GeoJSONFeature {
    type : string;
    properties : { gml_id: String };
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
        var nextToken = Number(query.nextToken || '0');
        var outputCount = 0;
        var that = this;

        var next;
        var propFilter : Filter = _.find(query.filters, { filterClass: 'PropertyFilter' });
        if (propFilter && !_.isEmpty(propFilter.parameters.properties.fail)) {
            next = function() {
                ret.push(new Error('fail'));
                ret.push(null);
            }
        } else {
            next = function() {
                if (nextToken >= that.data.features.length || outputCount >= query.limit) {
                    ret.push(null);
                    return;
                }
                var item = that.data.features[nextToken];
                
                nextToken++;
                if (ret.push({ feature: item, nextToken: String(nextToken) })) {
                    outputCount++;
                }
                setTimeout(next, 5);
            }
        }
        
        setTimeout(next, 5);

        return ret;
    }

    getFeatureById(id : string) : Promise<Feature> {
        var ret = new Promise((resolve) => {
            setTimeout(() => {
                var feature = _.find(this.data.features, f => f.properties.gml_id === id);
                resolve(feature);
            }, 5);
        });

        return ret;
    }
};

SofpExampleBackend.collections.push(new GeoJSONCollection('forecast', 'Example forecast data by FMI', 'data/forecast.json'));

export {SofpExampleBackend};
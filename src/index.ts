import {Backend, Collection, Link, QueryParameter, Query, 
    FeatureStream, Feature, Filter, Property, PropertyReference} from 'sofp-lib';

import * as _ from 'lodash';

let SofpExampleBackend = new Backend('SofpExampleBackend');

interface GeoJSONGeometry {
    type : string;
    coordinates : number[];
};

interface GeoJSONFeature {
    type : string;
    properties : { gml_id: string };
    geometry: GeoJSONGeometry;
};

interface GeoJSONFeatureCollection {
    type: string;
    name: string;
    crs: object;
    features: GeoJSONFeature[];
};

class GeoJSONCollection implements Collection {
    id : string;
    description : string;
    links : Link[] = [];

    data : GeoJSONFeatureCollection;

    properties : Property [] = [{
        name: 'Time',
        type: 'string',
        description: 'Forecast target time'
    },{
        name: 'ParameterName',
        type: 'string',
        description: 'Name of parameter',
        exampleValues : [ 'Temperature', 'Humidity' ]
    },{
        name: 'ParameterValue',
        type: 'number',
        description: 'Value of parameter'
    },{
        name: 'Link',
        type: 'string',
        description: 'Link to this item'
    }];

    additionalQueryParameters : QueryParameter [] = [{
        name : 'place',
        type : 'string',
        description : 'Filter returned features based on placenames',
        exampleValues : [ 'Helsinki', 'Porvoo', 'Kuopio' ]
    }];

    constructor(id, description, jsonFile) {
        this.id = id;
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

        var additionalParameterFilter : Filter = _.find(query.filters, { filterClass: 'AdditionalParameterFilter' });
        ret.remainingFilter = _.without(query.filters, additionalParameterFilter);

        var next = function() {
            if (nextToken >= that.data.features.length || outputCount >= query.limit) {
                ret.push(null);
                return;
            }
            var item = that.data.features[nextToken];

            // Synthesize links as an example on how PropertyReference is used
            item.properties = _.cloneDeep(item.properties);
            item.properties['Link'] = new PropertyReference('forecast', item.properties.gml_id);

            nextToken++;
            var accept = true;
            if (accept) {
                if (additionalParameterFilter !== undefined && additionalParameterFilter.parameters.parameters.place) {
                    // Example data is from Helsinki, Kumpula, so only those values are accepted
                    accept =
                        additionalParameterFilter.parameters.parameters.place === 'Helsinki' ||
                        additionalParameterFilter.parameters.parameters.place === 'Kumpula';
                }
            }
            if (accept) {
                accept = ret.push({ feature: item, nextToken: String(nextToken) })
            }
            if (accept) {
                outputCount++;
            }
            setTimeout(next, 5);
        }
        
        setTimeout(next, 5);

        return ret;
    }

    getFeatureById(id : string) : Promise<Feature> {
        var ret = new Promise((resolve) => {
            setTimeout(() => {
                var feature = _.find(this.data.features, f => f.properties.gml_id === id);
                // Synthesize links as an example on how PropertyReference is used
                feature.properties = _.cloneDeep(feature.properties);
                feature.properties['Link'] = new PropertyReference('forecast', feature.properties.gml_id);

                resolve(feature);
            }, 5);
        });

        return ret;
    }
};

SofpExampleBackend.collections.push(new GeoJSONCollection('forecast', 'Example forecast data by FMI', 'data/forecast.json'));

export {SofpExampleBackend};

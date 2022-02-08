(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.turf = f()
    }
}
)(function() {
    var define, module, exports;
    return (function() {
        function r(e, n, t) {
            function o(i, f) {
                if (!n[i]) {
                    if (!e[i]) {
                        var c = "function" == typeof require && require;
                        if (!f && c)
                            return c(i, !0);
                        if (u)
                            return u(i, !0);
                        var a = new Error("Cannot find module '" + i + "'");
                        throw a.code = "MODULE_NOT_FOUND",
                        a
                    }
                    var p = n[i] = {
                        exports: {}
                    };
                    e[i][0].call(p.exports, function(r) {
                        var n = e[i][1][r];
                        return o(n || r)
                    }, p, p.exports, r, e, n, t)
                }
                return n[i].exports
            }
            for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
                o(t[i]);
            return o
        }
        return r
    }
    )()({
        1: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var meta_1 = require("@turf/meta");
            /**
 * Takes a set of features, calculates the bbox of all input features, and returns a bounding box.
 *
 * @name bbox
 * @param {GeoJSON} geojson any GeoJSON object
 * @returns {BBox} bbox extent in [minX, minY, maxX, maxY] order
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
 * var bbox = turf.bbox(line);
 * var bboxPolygon = turf.bboxPolygon(bbox);
 *
 * //addToMap
 * var addToMap = [line, bboxPolygon]
 */
            function bbox(geojson) {
                var result = [Infinity, Infinity, -Infinity, -Infinity];
                meta_1.coordEach(geojson, function(coord) {
                    if (result[0] > coord[0]) {
                        result[0] = coord[0];
                    }
                    if (result[1] > coord[1]) {
                        result[1] = coord[1];
                    }
                    if (result[2] < coord[0]) {
                        result[2] = coord[0];
                    }
                    if (result[3] < coord[1]) {
                        result[3] = coord[1];
                    }
                });
                return result;
            }
            exports.default = bbox;

        }
        , {
            "@turf/meta": 14
        }],
        2: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var helpers_1 = require("@turf/helpers");
            var invariant_1 = require("@turf/invariant");
            // http://en.wikipedia.org/wiki/Haversine_formula
            // http://www.movable-type.co.uk/scripts/latlong.html
            /**
 * Takes two {@link Point|points} and finds the geographic bearing between them,
 * i.e. the angle measured in degrees from the north line (0 degrees)
 *
 * @name bearing
 * @param {Coord} start starting Point
 * @param {Coord} end ending Point
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.final=false] calculates the final bearing if true
 * @returns {number} bearing in decimal degrees, between -180 and 180 degrees (positive clockwise)
 * @example
 * var point1 = turf.point([-75.343, 39.984]);
 * var point2 = turf.point([-75.534, 39.123]);
 *
 * var bearing = turf.bearing(point1, point2);
 *
 * //addToMap
 * var addToMap = [point1, point2]
 * point1.properties['marker-color'] = '#f00'
 * point2.properties['marker-color'] = '#0f0'
 * point1.properties.bearing = bearing
 */
            function bearing(start, end, options) {
                if (options === void 0) {
                    options = {};
                }
                // Reverse calculation
                if (options.final === true) {
                    return calculateFinalBearing(start, end);
                }
                var coordinates1 = invariant_1.getCoord(start);
                var coordinates2 = invariant_1.getCoord(end);
                var lon1 = helpers_1.degreesToRadians(coordinates1[0]);
                var lon2 = helpers_1.degreesToRadians(coordinates2[0]);
                var lat1 = helpers_1.degreesToRadians(coordinates1[1]);
                var lat2 = helpers_1.degreesToRadians(coordinates2[1]);
                var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
                var b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
                return helpers_1.radiansToDegrees(Math.atan2(a, b));
            }
            /**
 * Calculates Final Bearing
 *
 * @private
 * @param {Coord} start starting Point
 * @param {Coord} end ending Point
 * @returns {number} bearing
 */
            function calculateFinalBearing(start, end) {
                // Swap start & end
                var bear = bearing(end, start);
                bear = (bear + 180) % 360;
                return bear;
            }
            exports.default = bearing;

        }
        , {
            "@turf/helpers": 9,
            "@turf/invariant": 10
        }],
        3: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var meta_1 = require("@turf/meta");
            var invariant_1 = require("@turf/invariant");
            var line_overlap_1 = require("@turf/line-overlap");
            var line_intersect_1 = require("@turf/line-intersect");
            var GeojsonEquality = require("geojson-equality");
            /**
 * Compares two geometries of the same dimension and returns true if their intersection set results in a geometry
 * different from both but of the same dimension. It applies to Polygon/Polygon, LineString/LineString,
 * Multipoint/Multipoint, MultiLineString/MultiLineString and MultiPolygon/MultiPolygon.
 *
 * @name booleanOverlap
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature1 input
 * @param  {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} feature2 input
 * @returns {boolean} true/false
 * @example
 * var poly1 = turf.polygon([[[0,0],[0,5],[5,5],[5,0],[0,0]]]);
 * var poly2 = turf.polygon([[[1,1],[1,6],[6,6],[6,1],[1,1]]]);
 * var poly3 = turf.polygon([[[10,10],[10,15],[15,15],[15,10],[10,10]]]);
 *
 * turf.booleanOverlap(poly1, poly2)
 * //=true
 * turf.booleanOverlap(poly2, poly3)
 * //=false
 */
            function booleanOverlap(feature1, feature2) {
                // validation
                if (!feature1)
                    throw new Error('feature1 is required');
                if (!feature2)
                    throw new Error('feature2 is required');
                var type1 = invariant_1.getType(feature1);
                var type2 = invariant_1.getType(feature2);
                if (type1 !== type2)
                    throw new Error('features must be of the same type');
                if (type1 === 'Point')
                    throw new Error('Point geometry not supported');
                // features must be not equal
                var equality = new GeojsonEquality({
                    precision: 6
                });
                if (equality.compare(feature1, feature2))
                    return false;
                var overlap = 0;
                switch (type1) {
                case 'MultiPoint':
                    var coords1 = meta_1.coordAll(feature1);
                    var coords2 = meta_1.coordAll(feature2);
                    coords1.forEach(function(coord1) {
                        coords2.forEach(function(coord2) {
                            if (coord1[0] === coord2[0] && coord1[1] === coord2[1])
                                overlap++;
                        });
                    });
                    break;
                case 'LineString':
                case 'MultiLineString':
                    meta_1.segmentEach(feature1, function(segment1) {
                        meta_1.segmentEach(feature2, function(segment2) {
                            if (line_overlap_1.default(segment1, segment2).features.length)
                                overlap++;
                        });
                    });
                    break;
                case 'Polygon':
                case 'MultiPolygon':
                    meta_1.segmentEach(feature1, function(segment1) {
                        meta_1.segmentEach(feature2, function(segment2) {
                            if (line_intersect_1.default(segment1, segment2).features.length)
                                overlap++;
                        });
                    });
                    break;
                }
                return overlap > 0;
            }
            exports.default = booleanOverlap;

        }
        , {
            "@turf/invariant": 10,
            "@turf/line-intersect": 11,
            "@turf/line-overlap": 12,
            "@turf/meta": 14,
            "geojson-equality": 20
        }],
        4: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var invariant_1 = require("@turf/invariant");
            // http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
            // modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
            // which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
            /**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point
 * resides inside the polygon. The polygon can be convex or concave. The function accounts for holes.
 *
 * @name booleanPointInPolygon
 * @param {Coord} point input point
 * @param {Feature<Polygon|MultiPolygon>} polygon input polygon or multipolygon
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreBoundary=false] True if polygon boundary should be ignored when determining if
 * the point is inside the polygon otherwise false.
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * turf.booleanPointInPolygon(pt, poly);
 * //= true
 */
            function booleanPointInPolygon(point, polygon, options) {
                if (options === void 0) {
                    options = {};
                }
                // validation
                if (!point) {
                    throw new Error("point is required");
                }
                if (!polygon) {
                    throw new Error("polygon is required");
                }
                var pt = invariant_1.getCoord(point);
                var geom = invariant_1.getGeom(polygon);
                var type = geom.type;
                var bbox = polygon.bbox;
                var polys = geom.coordinates;
                // Quick elimination if point is not inside bbox
                if (bbox && inBBox(pt, bbox) === false) {
                    return false;
                }
                // normalize to multipolygon
                if (type === "Polygon") {
                    polys = [polys];
                }
                var insidePoly = false;
                for (var i = 0; i < polys.length && !insidePoly; i++) {
                    // check if it is in the outer ring first
                    if (inRing(pt, polys[i][0], options.ignoreBoundary)) {
                        var inHole = false;
                        var k = 1;
                        // check for the point in any of the holes
                        while (k < polys[i].length && !inHole) {
                            if (inRing(pt, polys[i][k], !options.ignoreBoundary)) {
                                inHole = true;
                            }
                            k++;
                        }
                        if (!inHole) {
                            insidePoly = true;
                        }
                    }
                }
                return insidePoly;
            }
            exports.default = booleanPointInPolygon;
            /**
 * inRing
 *
 * @private
 * @param {Array<number>} pt [x,y]
 * @param {Array<Array<number>>} ring [[x,y], [x,y],..]
 * @param {boolean} ignoreBoundary ignoreBoundary
 * @returns {boolean} inRing
 */
            function inRing(pt, ring, ignoreBoundary) {
                var isInside = false;
                if (ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) {
                    ring = ring.slice(0, ring.length - 1);
                }
                for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                    var xi = ring[i][0];
                    var yi = ring[i][1];
                    var xj = ring[j][0];
                    var yj = ring[j][1];
                    var onBoundary = (pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0) && ((xi - pt[0]) * (xj - pt[0]) <= 0) && ((yi - pt[1]) * (yj - pt[1]) <= 0);
                    if (onBoundary) {
                        return !ignoreBoundary;
                    }
                    var intersect = ((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
                    if (intersect) {
                        isInside = !isInside;
                    }
                }
                return isInside;
            }
            /**
 * inBBox
 *
 * @private
 * @param {Position} pt point [x,y]
 * @param {BBox} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
            function inBBox(pt, bbox) {
                return bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1];
            }

        }
        , {
            "@turf/invariant": 10
        }],
        5: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var invariant_1 = require("@turf/invariant");
            /**
 * Returns true if a point is on a line. Accepts a optional parameter to ignore the
 * start and end vertices of the linestring.
 *
 * @name booleanPointOnLine
 * @param {Coord} pt GeoJSON Point
 * @param {Feature<LineString>} line GeoJSON LineString
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreEndVertices=false] whether to ignore the start and end vertices.
 * @returns {boolean} true/false
 * @example
 * var pt = turf.point([0, 0]);
 * var line = turf.lineString([[-1, -1],[1, 1],[1.5, 2.2]]);
 * var isPointOnLine = turf.booleanPointOnLine(pt, line);
 * //=true
 */
            function booleanPointOnLine(pt, line, options) {
                if (options === void 0) {
                    options = {};
                }
                // Normalize inputs
                var ptCoords = invariant_1.getCoord(pt);
                var lineCoords = invariant_1.getCoords(line);
                // Main
                for (var i = 0; i < lineCoords.length - 1; i++) {
                    var ignoreBoundary = false;
                    if (options.ignoreEndVertices) {
                        if (i === 0) {
                            ignoreBoundary = "start";
                        }
                        if (i === lineCoords.length - 2) {
                            ignoreBoundary = "end";
                        }
                        if (i === 0 && i + 1 === lineCoords.length - 1) {
                            ignoreBoundary = "both";
                        }
                    }
                    if (isPointOnLineSegment(lineCoords[i], lineCoords[i + 1], ptCoords, ignoreBoundary)) {
                        return true;
                    }
                }
                return false;
            }
            // See http://stackoverflow.com/a/4833823/1979085
            /**
 * @private
 * @param {Position} lineSegmentStart coord pair of start of line
 * @param {Position} lineSegmentEnd coord pair of end of line
 * @param {Position} pt coord pair of point to check
 * @param {boolean|string} excludeBoundary whether the point is allowed to fall on the line ends.
 * If true which end to ignore.
 * @returns {boolean} true/false
 */
            function isPointOnLineSegment(lineSegmentStart, lineSegmentEnd, pt, excludeBoundary) {
                var x = pt[0];
                var y = pt[1];
                var x1 = lineSegmentStart[0];
                var y1 = lineSegmentStart[1];
                var x2 = lineSegmentEnd[0];
                var y2 = lineSegmentEnd[1];
                var dxc = pt[0] - x1;
                var dyc = pt[1] - y1;
                var dxl = x2 - x1;
                var dyl = y2 - y1;
                var cross = dxc * dyl - dyc * dxl;
                if (cross !== 0) {
                    return false;
                }
                if (!excludeBoundary) {
                    if (Math.abs(dxl) >= Math.abs(dyl)) {
                        return dxl > 0 ? x1 <= x && x <= x2 : x2 <= x && x <= x1;
                    }
                    return dyl > 0 ? y1 <= y && y <= y2 : y2 <= y && y <= y1;
                } else if (excludeBoundary === "start") {
                    if (Math.abs(dxl) >= Math.abs(dyl)) {
                        return dxl > 0 ? x1 < x && x <= x2 : x2 <= x && x < x1;
                    }
                    return dyl > 0 ? y1 < y && y <= y2 : y2 <= y && y < y1;
                } else if (excludeBoundary === "end") {
                    if (Math.abs(dxl) >= Math.abs(dyl)) {
                        return dxl > 0 ? x1 <= x && x < x2 : x2 < x && x <= x1;
                    }
                    return dyl > 0 ? y1 <= y && y < y2 : y2 < y && y <= y1;
                } else if (excludeBoundary === "both") {
                    if (Math.abs(dxl) >= Math.abs(dyl)) {
                        return dxl > 0 ? x1 < x && x < x2 : x2 < x && x < x1;
                    }
                    return dyl > 0 ? y1 < y && y < y2 : y2 < y && y < y1;
                }
                return false;
            }
            exports.default = booleanPointOnLine;

        }
        , {
            "@turf/invariant": 10
        }],
        6: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var bbox_1 = require("@turf/bbox");
            var boolean_point_on_line_1 = require("@turf/boolean-point-on-line");
            var boolean_point_in_polygon_1 = require("@turf/boolean-point-in-polygon");
            var invariant_1 = require("@turf/invariant");
            /**
 * Boolean-within returns true if the first geometry is completely within the second geometry.
 * The interiors of both geometries must intersect and, the interior and boundary of the primary (geometry a)
 * must not intersect the exterior of the secondary (geometry b).
 * Boolean-within returns the exact opposite result of the `@turf/boolean-contains`.
 *
 * @name booleanWithin
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * var point = turf.point([1, 2]);
 *
 * turf.booleanWithin(point, line);
 * //=true
 */
            function booleanWithin(feature1, feature2) {
                var type1 = invariant_1.getType(feature1);
                var type2 = invariant_1.getType(feature2);
                var geom1 = invariant_1.getGeom(feature1);
                var geom2 = invariant_1.getGeom(feature2);
                switch (type1) {
                case 'Point':
                    switch (type2) {
                    case 'MultiPoint':
                        return isPointInMultiPoint(geom1, geom2);
                    case 'LineString':
                        return boolean_point_on_line_1.default(geom1, geom2, {
                            ignoreEndVertices: true
                        });
                    case 'Polygon':
                    case 'MultiPolygon':
                        return boolean_point_in_polygon_1.default(geom1, geom2, {
                            ignoreBoundary: true
                        });
                    default:
                        throw new Error('feature2 ' + type2 + ' geometry not supported');
                    }
                case 'MultiPoint':
                    switch (type2) {
                    case 'MultiPoint':
                        return isMultiPointInMultiPoint(geom1, geom2);
                    case 'LineString':
                        return isMultiPointOnLine(geom1, geom2);
                    case 'Polygon':
                    case 'MultiPolygon':
                        return isMultiPointInPoly(geom1, geom2);
                    default:
                        throw new Error('feature2 ' + type2 + ' geometry not supported');
                    }
                case 'LineString':
                    switch (type2) {
                    case 'LineString':
                        return isLineOnLine(geom1, geom2);
                    case 'Polygon':
                    case 'MultiPolygon':
                        return isLineInPoly(geom1, geom2);
                    default:
                        throw new Error('feature2 ' + type2 + ' geometry not supported');
                    }
                case 'Polygon':
                    switch (type2) {
                    case 'Polygon':
                    case 'MultiPolygon':
                        return isPolyInPoly(geom1, geom2);
                    default:
                        throw new Error('feature2 ' + type2 + ' geometry not supported');
                    }
                default:
                    throw new Error('feature1 ' + type1 + ' geometry not supported');
                }
            }
            function isPointInMultiPoint(point, multiPoint) {
                var i;
                var output = false;
                for (i = 0; i < multiPoint.coordinates.length; i++) {
                    if (compareCoords(multiPoint.coordinates[i], point.coordinates)) {
                        output = true;
                        break;
                    }
                }
                return output;
            }
            function isMultiPointInMultiPoint(multiPoint1, multiPoint2) {
                for (var i = 0; i < multiPoint1.coordinates.length; i++) {
                    var anyMatch = false;
                    for (var i2 = 0; i2 < multiPoint2.coordinates.length; i2++) {
                        if (compareCoords(multiPoint1.coordinates[i], multiPoint2.coordinates[i2])) {
                            anyMatch = true;
                        }
                    }
                    if (!anyMatch) {
                        return false;
                    }
                }
                return true;
            }
            function isMultiPointOnLine(multiPoint, lineString) {
                var foundInsidePoint = false;
                for (var i = 0; i < multiPoint.coordinates.length; i++) {
                    if (!boolean_point_on_line_1.default(multiPoint.coordinates[i], lineString)) {
                        return false;
                    }
                    if (!foundInsidePoint) {
                        foundInsidePoint = boolean_point_on_line_1.default(multiPoint.coordinates[i], lineString, {
                            ignoreEndVertices: true
                        });
                    }
                }
                return foundInsidePoint;
            }
            function isMultiPointInPoly(multiPoint, polygon) {
                var output = true;
                var oneInside = false;
                for (var i = 0; i < multiPoint.coordinates.length; i++) {
                    var isInside = boolean_point_in_polygon_1.default(multiPoint.coordinates[1], polygon);
                    if (!isInside) {
                        output = false;
                        break;
                    }
                    if (!oneInside) {
                        isInside = boolean_point_in_polygon_1.default(multiPoint.coordinates[1], polygon, {
                            ignoreBoundary: true
                        });
                    }
                }
                return output && isInside;
            }
            function isLineOnLine(lineString1, lineString2) {
                for (var i = 0; i < lineString1.coordinates.length; i++) {
                    if (!boolean_point_on_line_1.default(lineString1.coordinates[i], lineString2)) {
                        return false;
                    }
                }
                return true;
            }
            function isLineInPoly(linestring, polygon) {
                var polyBbox = bbox_1.default(polygon);
                var lineBbox = bbox_1.default(linestring);
                if (!doBBoxOverlap(polyBbox, lineBbox)) {
                    return false;
                }
                var foundInsidePoint = false;
                for (var i = 0; i < linestring.coordinates.length - 1; i++) {
                    if (!boolean_point_in_polygon_1.default(linestring.coordinates[i], polygon)) {
                        return false;
                    }
                    if (!foundInsidePoint) {
                        foundInsidePoint = boolean_point_in_polygon_1.default(linestring.coordinates[i], polygon, {
                            ignoreBoundary: true
                        });
                    }
                    if (!foundInsidePoint) {
                        var midpoint = getMidpoint(linestring.coordinates[i], linestring.coordinates[i + 1]);
                        foundInsidePoint = boolean_point_in_polygon_1.default(midpoint, polygon, {
                            ignoreBoundary: true
                        });
                    }
                }
                return foundInsidePoint;
            }
            /**
 * Is Polygon2 in Polygon1
 * Only takes into account outer rings
 *
 * @private
 * @param {Geometry|Feature<Polygon>} feature1 Polygon1
 * @param {Geometry|Feature<Polygon>} feature2 Polygon2
 * @returns {boolean} true/false
 */
            function isPolyInPoly(feature1, feature2) {
                var poly1Bbox = bbox_1.default(feature1);
                var poly2Bbox = bbox_1.default(feature2);
                if (!doBBoxOverlap(poly2Bbox, poly1Bbox)) {
                    return false;
                }
                for (var i = 0; i < feature1.coordinates[0].length; i++) {
                    if (!boolean_point_in_polygon_1.default(feature1.coordinates[0][i], feature2)) {
                        return false;
                    }
                }
                return true;
            }
            function doBBoxOverlap(bbox1, bbox2) {
                if (bbox1[0] > bbox2[0])
                    return false;
                if (bbox1[2] < bbox2[2])
                    return false;
                if (bbox1[1] > bbox2[1])
                    return false;
                if (bbox1[3] < bbox2[3])
                    return false;
                return true;
            }
            /**
 * compareCoords
 *
 * @private
 * @param {Position} pair1 point [x,y]
 * @param {Position} pair2 point [x,y]
 * @returns {boolean} true/false if coord pairs match
 */
            function compareCoords(pair1, pair2) {
                return pair1[0] === pair2[0] && pair1[1] === pair2[1];
            }
            /**
 * getMidpoint
 *
 * @private
 * @param {Position} pair1 point [x,y]
 * @param {Position} pair2 point [x,y]
 * @returns {Position} midpoint of pair1 and pair2
 */
            function getMidpoint(pair1, pair2) {
                return [(pair1[0] + pair2[0]) / 2, (pair1[1] + pair2[1]) / 2];
            }
            exports.default = booleanWithin;

        }
        , {
            "@turf/bbox": 1,
            "@turf/boolean-point-in-polygon": 4,
            "@turf/boolean-point-on-line": 5,
            "@turf/invariant": 10
        }],
        7: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            // http://en.wikipedia.org/wiki/Haversine_formula
            // http://www.movable-type.co.uk/scripts/latlong.html
            var helpers_1 = require("@turf/helpers");
            var invariant_1 = require("@turf/invariant");
            /**
 * Takes a {@link Point} and calculates the location of a destination point given a distance in
 * degrees, radians, miles, or kilometers; and bearing in degrees.
 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @name destination
 * @param {Coord} origin starting point
 * @param {number} distance distance from the origin point
 * @param {number} bearing ranging from -180 to 180
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] miles, kilometers, degrees, or radians
 * @param {Object} [options.properties={}] Translate properties to Point
 * @returns {Feature<Point>} destination point
 * @example
 * var point = turf.point([-75.343, 39.984]);
 * var distance = 50;
 * var bearing = 90;
 * var options = {units: 'miles'};
 *
 * var destination = turf.destination(point, distance, bearing, options);
 *
 * //addToMap
 * var addToMap = [point, destination]
 * destination.properties['marker-color'] = '#f00';
 * point.properties['marker-color'] = '#0f0';
 */
            function destination(origin, distance, bearing, options) {
                if (options === void 0) {
                    options = {};
                }
                // Handle input
                var coordinates1 = invariant_1.getCoord(origin);
                var longitude1 = helpers_1.degreesToRadians(coordinates1[0]);
                var latitude1 = helpers_1.degreesToRadians(coordinates1[1]);
                var bearingRad = helpers_1.degreesToRadians(bearing);
                var radians = helpers_1.lengthToRadians(distance, options.units);
                // Main
                var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) + Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad));
                var longitude2 = longitude1 + Math.atan2(Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1), Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
                var lng = helpers_1.radiansToDegrees(longitude2);
                var lat = helpers_1.radiansToDegrees(latitude2);
                return helpers_1.point([lng, lat], options.properties);
            }
            exports.default = destination;

        }
        , {
            "@turf/helpers": 9,
            "@turf/invariant": 10
        }],
        8: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var invariant_1 = require("@turf/invariant");
            var helpers_1 = require("@turf/helpers");
            //http://en.wikipedia.org/wiki/Haversine_formula
            //http://www.movable-type.co.uk/scripts/latlong.html
            /**
 * Calculates the distance between two {@link Point|points} in degrees, radians, miles, or kilometers.
 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 *
 * @name distance
 * @param {Coord} from origin point
 * @param {Coord} to destination point
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between the two points
 * @example
 * var from = turf.point([-75.343, 39.984]);
 * var to = turf.point([-75.534, 39.123]);
 * var options = {units: 'miles'};
 *
 * var distance = turf.distance(from, to, options);
 *
 * //addToMap
 * var addToMap = [from, to];
 * from.properties.distance = distance;
 * to.properties.distance = distance;
 */
            function distance(from, to, options) {
                if (options === void 0) {
                    options = {};
                }
                var coordinates1 = invariant_1.getCoord(from);
                var coordinates2 = invariant_1.getCoord(to);
                var dLat = helpers_1.degreesToRadians((coordinates2[1] - coordinates1[1]));
                var dLon = helpers_1.degreesToRadians((coordinates2[0] - coordinates1[0]));
                var lat1 = helpers_1.degreesToRadians(coordinates1[1]);
                var lat2 = helpers_1.degreesToRadians(coordinates2[1]);
                var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
                return helpers_1.radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units);
            }
            exports.default = distance;

        }
        , {
            "@turf/helpers": 9,
            "@turf/invariant": 10
        }],
        9: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            /**
 * @module helpers
 */
            /**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 *
 * @memberof helpers
 * @type {number}
 */
            exports.earthRadius = 6371008.8;
            /**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 *
 * @memberof helpers
 * @type {Object}
 */
            exports.factors = {
                centimeters: exports.earthRadius * 100,
                centimetres: exports.earthRadius * 100,
                degrees: exports.earthRadius / 111325,
                feet: exports.earthRadius * 3.28084,
                inches: exports.earthRadius * 39.370,
                kilometers: exports.earthRadius / 1000,
                kilometres: exports.earthRadius / 1000,
                meters: exports.earthRadius,
                metres: exports.earthRadius,
                miles: exports.earthRadius / 1609.344,
                millimeters: exports.earthRadius * 1000,
                millimetres: exports.earthRadius * 1000,
                nauticalmiles: exports.earthRadius / 1852,
                radians: 1,
                yards: exports.earthRadius / 1.0936,
            };
            /**
 * Units of measurement factors based on 1 meter.
 *
 * @memberof helpers
 * @type {Object}
 */
            exports.unitsFactors = {
                centimeters: 100,
                centimetres: 100,
                degrees: 1 / 111325,
                feet: 3.28084,
                inches: 39.370,
                kilometers: 1 / 1000,
                kilometres: 1 / 1000,
                meters: 1,
                metres: 1,
                miles: 1 / 1609.344,
                millimeters: 1000,
                millimetres: 1000,
                nauticalmiles: 1 / 1852,
                radians: 1 / exports.earthRadius,
                yards: 1 / 1.0936,
            };
            /**
 * Area of measurement factors based on 1 square meter.
 *
 * @memberof helpers
 * @type {Object}
 */
            exports.areaFactors = {
                acres: 0.000247105,
                centimeters: 10000,
                centimetres: 10000,
                feet: 10.763910417,
                inches: 1550.003100006,
                kilometers: 0.000001,
                kilometres: 0.000001,
                meters: 1,
                metres: 1,
                miles: 3.86e-7,
                millimeters: 1000000,
                millimetres: 1000000,
                yards: 1.195990046,
            };
            /**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
            function feature(geom, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                var feat = {
                    type: "Feature"
                };
                if (options.id === 0 || options.id) {
                    feat.id = options.id;
                }
                if (options.bbox) {
                    feat.bbox = options.bbox;
                }
                feat.properties = properties || {};
                feat.geometry = geom;
                return feat;
            }
            exports.feature = feature;
            /**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<any>} coordinates Coordinates
 * @param {Object} [options={}] Optional Parameters
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = "Point";
 * var coordinates = [110, 50];
 * var geometry = turf.geometry(type, coordinates);
 * // => geometry
 */
            function geometry(type, coordinates, options) {
                if (options === void 0) {
                    options = {};
                }
                switch (type) {
                case "Point":
                    return point(coordinates).geometry;
                case "LineString":
                    return lineString(coordinates).geometry;
                case "Polygon":
                    return polygon(coordinates).geometry;
                case "MultiPoint":
                    return multiPoint(coordinates).geometry;
                case "MultiLineString":
                    return multiLineString(coordinates).geometry;
                case "MultiPolygon":
                    return multiPolygon(coordinates).geometry;
                default:
                    throw new Error(type + " is invalid");
                }
            }
            exports.geometry = geometry;
            /**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
            function point(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                var geom = {
                    type: "Point",
                    coordinates: coordinates,
                };
                return feature(geom, properties, options);
            }
            exports.point = point;
            /**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */
            function points(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                return featureCollection(coordinates.map(function(coords) {
                    return point(coords, properties);
                }), options);
            }
            exports.points = points;
            /**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */
            function polygon(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
                    var ring = coordinates_1[_i];
                    if (ring.length < 4) {
                        throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
                    }
                    for (var j = 0; j < ring[ring.length - 1].length; j++) {
                        // Check if first point of Polygon contains two numbers
                        if (ring[ring.length - 1][j] !== ring[0][j]) {
                            throw new Error("First and last Position are not equivalent.");
                        }
                    }
                }
                var geom = {
                    type: "Polygon",
                    coordinates: coordinates,
                };
                return feature(geom, properties, options);
            }
            exports.polygon = polygon;
            /**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */
            function polygons(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                return featureCollection(coordinates.map(function(coords) {
                    return polygon(coords, properties);
                }), options);
            }
            exports.polygons = polygons;
            /**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */
            function lineString(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                if (coordinates.length < 2) {
                    throw new Error("coordinates must be an array of two or more positions");
                }
                var geom = {
                    type: "LineString",
                    coordinates: coordinates,
                };
                return feature(geom, properties, options);
            }
            exports.lineString = lineString;
            /**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */
            function lineStrings(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                return featureCollection(coordinates.map(function(coords) {
                    return lineString(coords, properties);
                }), options);
            }
            exports.lineStrings = lineStrings;
            /**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */
            function featureCollection(features, options) {
                if (options === void 0) {
                    options = {};
                }
                var fc = {
                    type: "FeatureCollection"
                };
                if (options.id) {
                    fc.id = options.id;
                }
                if (options.bbox) {
                    fc.bbox = options.bbox;
                }
                fc.features = features;
                return fc;
            }
            exports.featureCollection = featureCollection;
            /**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
            function multiLineString(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                var geom = {
                    type: "MultiLineString",
                    coordinates: coordinates,
                };
                return feature(geom, properties, options);
            }
            exports.multiLineString = multiLineString;
            /**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
            function multiPoint(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                var geom = {
                    type: "MultiPoint",
                    coordinates: coordinates,
                };
                return feature(geom, properties, options);
            }
            exports.multiPoint = multiPoint;
            /**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
            function multiPolygon(coordinates, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                var geom = {
                    type: "MultiPolygon",
                    coordinates: coordinates,
                };
                return feature(geom, properties, options);
            }
            exports.multiPolygon = multiPolygon;
            /**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = turf.geometry("Point", [100, 0]);
 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
 * var collection = turf.geometryCollection([pt, line]);
 *
 * // => collection
 */
            function geometryCollection(geometries, properties, options) {
                if (options === void 0) {
                    options = {};
                }
                var geom = {
                    type: "GeometryCollection",
                    geometries: geometries,
                };
                return feature(geom, properties, options);
            }
            exports.geometryCollection = geometryCollection;
            /**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
            function round(num, precision) {
                if (precision === void 0) {
                    precision = 0;
                }
                if (precision && !(precision >= 0)) {
                    throw new Error("precision must be a positive number");
                }
                var multiplier = Math.pow(10, precision || 0);
                return Math.round(num * multiplier) / multiplier;
            }
            exports.round = round;
            /**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} distance
 */
            function radiansToLength(radians, units) {
                if (units === void 0) {
                    units = "kilometers";
                }
                var factor = exports.factors[units];
                if (!factor) {
                    throw new Error(units + " units is invalid");
                }
                return radians * factor;
            }
            exports.radiansToLength = radiansToLength;
            /**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} radians
 */
            function lengthToRadians(distance, units) {
                if (units === void 0) {
                    units = "kilometers";
                }
                var factor = exports.factors[units];
                if (!factor) {
                    throw new Error(units + " units is invalid");
                }
                return distance / factor;
            }
            exports.lengthToRadians = lengthToRadians;
            /**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} degrees
 */
            function lengthToDegrees(distance, units) {
                return radiansToDegrees(lengthToRadians(distance, units));
            }
            exports.lengthToDegrees = lengthToDegrees;
            /**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAzimuth
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
            function bearingToAzimuth(bearing) {
                var angle = bearing % 360;
                if (angle < 0) {
                    angle += 360;
                }
                return angle;
            }
            exports.bearingToAzimuth = bearingToAzimuth;
            /**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
            function radiansToDegrees(radians) {
                var degrees = radians % (2 * Math.PI);
                return degrees * 180 / Math.PI;
            }
            exports.radiansToDegrees = radiansToDegrees;
            /**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
            function degreesToRadians(degrees) {
                var radians = degrees % 360;
                return radians * Math.PI / 180;
            }
            exports.degreesToRadians = degreesToRadians;
            /**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {Units} [originalUnit="kilometers"] of the length
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted length
 */
            function convertLength(length, originalUnit, finalUnit) {
                if (originalUnit === void 0) {
                    originalUnit = "kilometers";
                }
                if (finalUnit === void 0) {
                    finalUnit = "kilometers";
                }
                if (!(length >= 0)) {
                    throw new Error("length must be a positive number");
                }
                return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
            }
            exports.convertLength = convertLength;
            /**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
 * @param {number} area to be converted
 * @param {Units} [originalUnit="meters"] of the distance
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted distance
 */
            function convertArea(area, originalUnit, finalUnit) {
                if (originalUnit === void 0) {
                    originalUnit = "meters";
                }
                if (finalUnit === void 0) {
                    finalUnit = "kilometers";
                }
                if (!(area >= 0)) {
                    throw new Error("area must be a positive number");
                }
                var startFactor = exports.areaFactors[originalUnit];
                if (!startFactor) {
                    throw new Error("invalid original units");
                }
                var finalFactor = exports.areaFactors[finalUnit];
                if (!finalFactor) {
                    throw new Error("invalid final units");
                }
                return (area / startFactor) * finalFactor;
            }
            exports.convertArea = convertArea;
            /**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
            function isNumber(num) {
                return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
            }
            exports.isNumber = isNumber;
            /**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */
            function isObject(input) {
                return (!!input) && (input.constructor === Object);
            }
            exports.isObject = isObject;
            /**
 * Validate BBox
 *
 * @private
 * @param {Array<number>} bbox BBox to validate
 * @returns {void}
 * @throws Error if BBox is not valid
 * @example
 * validateBBox([-180, -40, 110, 50])
 * //=OK
 * validateBBox([-180, -40])
 * //=Error
 * validateBBox('Foo')
 * //=Error
 * validateBBox(5)
 * //=Error
 * validateBBox(null)
 * //=Error
 * validateBBox(undefined)
 * //=Error
 */
            function validateBBox(bbox) {
                if (!bbox) {
                    throw new Error("bbox is required");
                }
                if (!Array.isArray(bbox)) {
                    throw new Error("bbox must be an Array");
                }
                if (bbox.length !== 4 && bbox.length !== 6) {
                    throw new Error("bbox must be an Array of 4 or 6 numbers");
                }
                bbox.forEach(function(num) {
                    if (!isNumber(num)) {
                        throw new Error("bbox must only contain numbers");
                    }
                });
            }
            exports.validateBBox = validateBBox;
            /**
 * Validate Id
 *
 * @private
 * @param {string|number} id Id to validate
 * @returns {void}
 * @throws Error if Id is not valid
 * @example
 * validateId([-180, -40, 110, 50])
 * //=Error
 * validateId([-180, -40])
 * //=Error
 * validateId('Foo')
 * //=OK
 * validateId(5)
 * //=OK
 * validateId(null)
 * //=Error
 * validateId(undefined)
 * //=Error
 */
            function validateId(id) {
                if (!id) {
                    throw new Error("id is required");
                }
                if (["string", "number"].indexOf(typeof id) === -1) {
                    throw new Error("id must be a number or a string");
                }
            }
            exports.validateId = validateId;
            // Deprecated methods
            function radians2degrees() {
                throw new Error("method has been renamed to `radiansToDegrees`");
            }
            exports.radians2degrees = radians2degrees;
            function degrees2radians() {
                throw new Error("method has been renamed to `degreesToRadians`");
            }
            exports.degrees2radians = degrees2radians;
            function distanceToDegrees() {
                throw new Error("method has been renamed to `lengthToDegrees`");
            }
            exports.distanceToDegrees = distanceToDegrees;
            function distanceToRadians() {
                throw new Error("method has been renamed to `lengthToRadians`");
            }
            exports.distanceToRadians = distanceToRadians;
            function radiansToDistance() {
                throw new Error("method has been renamed to `radiansToLength`");
            }
            exports.radiansToDistance = radiansToDistance;
            function bearingToAngle() {
                throw new Error("method has been renamed to `bearingToAzimuth`");
            }
            exports.bearingToAngle = bearingToAngle;
            function convertDistance() {
                throw new Error("method has been renamed to `convertLength`");
            }
            exports.convertDistance = convertDistance;

        }
        , {}],
        10: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var helpers_1 = require("@turf/helpers");
            /**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
            function getCoord(coord) {
                if (!coord) {
                    throw new Error("coord is required");
                }
                if (!Array.isArray(coord)) {
                    if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
                        return coord.geometry.coordinates;
                    }
                    if (coord.type === "Point") {
                        return coord.coordinates;
                    }
                }
                if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
                    return coord;
                }
                throw new Error("coord must be GeoJSON Point or an Array of numbers");
            }
            exports.getCoord = getCoord;
            /**
 * Unwrap coordinates from a Feature, Geometry Object or an Array
 *
 * @name getCoords
 * @param {Array<any>|Geometry|Feature} coords Feature, Geometry Object or an Array
 * @returns {Array<any>} coordinates
 * @example
 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
 *
 * var coords = turf.getCoords(poly);
 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
 */
            function getCoords(coords) {
                if (Array.isArray(coords)) {
                    return coords;
                }
                // Feature
                if (coords.type === "Feature") {
                    if (coords.geometry !== null) {
                        return coords.geometry.coordinates;
                    }
                } else {
                    // Geometry
                    if (coords.coordinates) {
                        return coords.coordinates;
                    }
                }
                throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
            }
            exports.getCoords = getCoords;
            /**
 * Checks if coordinates contains a number
 *
 * @name containsNumber
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
            function containsNumber(coordinates) {
                if (coordinates.length > 1 && helpers_1.isNumber(coordinates[0]) && helpers_1.isNumber(coordinates[1])) {
                    return true;
                }
                if (Array.isArray(coordinates[0]) && coordinates[0].length) {
                    return containsNumber(coordinates[0]);
                }
                throw new Error("coordinates must only contain numbers");
            }
            exports.containsNumber = containsNumber;
            /**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @name geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
            function geojsonType(value, type, name) {
                if (!type || !name) {
                    throw new Error("type and name required");
                }
                if (!value || value.type !== type) {
                    throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + value.type);
                }
            }
            exports.geojsonType = geojsonType;
            /**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
            function featureOf(feature, type, name) {
                if (!feature) {
                    throw new Error("No feature passed");
                }
                if (!name) {
                    throw new Error(".featureOf() requires a name");
                }
                if (!feature || feature.type !== "Feature" || !feature.geometry) {
                    throw new Error("Invalid input to " + name + ", Feature with geometry required");
                }
                if (!feature.geometry || feature.geometry.type !== type) {
                    throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
                }
            }
            exports.featureOf = featureOf;
            /**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
            function collectionOf(featureCollection, type, name) {
                if (!featureCollection) {
                    throw new Error("No featureCollection passed");
                }
                if (!name) {
                    throw new Error(".collectionOf() requires a name");
                }
                if (!featureCollection || featureCollection.type !== "FeatureCollection") {
                    throw new Error("Invalid input to " + name + ", FeatureCollection required");
                }
                for (var _i = 0, _a = featureCollection.features; _i < _a.length; _i++) {
                    var feature = _a[_i];
                    if (!feature || feature.type !== "Feature" || !feature.geometry) {
                        throw new Error("Invalid input to " + name + ", Feature with geometry required");
                    }
                    if (!feature.geometry || feature.geometry.type !== type) {
                        throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
                    }
                }
            }
            exports.collectionOf = collectionOf;
            /**
 * Get Geometry from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry|null} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //={"type": "Point", "coordinates": [110, 40]}
 */
            function getGeom(geojson) {
                if (geojson.type === "Feature") {
                    return geojson.geometry;
                }
                return geojson;
            }
            exports.getGeom = getGeom;
            /**
 * Get GeoJSON object's type, Geometry type is prioritize.
 *
 * @param {GeoJSON} geojson GeoJSON object
 * @param {string} [name="geojson"] name of the variable to display in error message
 * @returns {string} GeoJSON type
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getType(point)
 * //="Point"
 */
            function getType(geojson, name) {
                if (geojson.type === "FeatureCollection") {
                    return "FeatureCollection";
                }
                if (geojson.type === "GeometryCollection") {
                    return "GeometryCollection";
                }
                if (geojson.type === "Feature" && geojson.geometry !== null) {
                    return geojson.geometry.type;
                }
                return geojson.type;
            }
            exports.getType = getType;

        }
        , {
            "@turf/helpers": 9
        }],
        11: [function(require, module, exports) {
            "use strict";
            var __importDefault = (this && this.__importDefault) || function(mod) {
                return (mod && mod.__esModule) ? mod : {
                    "default": mod
                };
            }
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var helpers_1 = require("@turf/helpers");
            var invariant_1 = require("@turf/invariant");
            var line_segment_1 = __importDefault(require("@turf/line-segment"));
            var meta_1 = require("@turf/meta");
            var geojson_rbush_1 = __importDefault(require("geojson-rbush"));
            /**
 * Takes any LineString or Polygon GeoJSON and returns the intersecting point(s).
 *
 * @name lineIntersect
 * @param {GeoJSON} line1 any LineString or Polygon
 * @param {GeoJSON} line2 any LineString or Polygon
 * @returns {FeatureCollection<Point>} point(s) that intersect both
 * @example
 * var line1 = turf.lineString([[126, -11], [129, -21]]);
 * var line2 = turf.lineString([[123, -18], [131, -14]]);
 * var intersects = turf.lineIntersect(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, intersects]
 */
            function lineIntersect(line1, line2) {
                var unique = {};
                var results = [];
                // First, normalize geometries to features
                // Then, handle simple 2-vertex segments
                if (line1.type === "LineString") {
                    line1 = helpers_1.feature(line1);
                }
                if (line2.type === "LineString") {
                    line2 = helpers_1.feature(line2);
                }
                if (line1.type === "Feature" && line2.type === "Feature" && line1.geometry !== null && line2.geometry !== null && line1.geometry.type === "LineString" && line2.geometry.type === "LineString" && line1.geometry.coordinates.length === 2 && line2.geometry.coordinates.length === 2) {
                    var intersect = intersects(line1, line2);
                    if (intersect) {
                        results.push(intersect);
                    }
                    return helpers_1.featureCollection(results);
                }
                // Handles complex GeoJSON Geometries
                var tree = geojson_rbush_1.default();
                tree.load(line_segment_1.default(line2));
                meta_1.featureEach(line_segment_1.default(line1), function(segment) {
                    meta_1.featureEach(tree.search(segment), function(match) {
                        var intersect = intersects(segment, match);
                        if (intersect) {
                            // prevent duplicate points https://github.com/Turfjs/turf/issues/688
                            var key = invariant_1.getCoords(intersect).join(",");
                            if (!unique[key]) {
                                unique[key] = true;
                                results.push(intersect);
                            }
                        }
                    });
                });
                return helpers_1.featureCollection(results);
            }
            /**
 * Find a point that intersects LineStrings with two coordinates each
 *
 * @private
 * @param {Feature<LineString>} line1 GeoJSON LineString (Must only contain 2 coordinates)
 * @param {Feature<LineString>} line2 GeoJSON LineString (Must only contain 2 coordinates)
 * @returns {Feature<Point>} intersecting GeoJSON Point
 */
            function intersects(line1, line2) {
                var coords1 = invariant_1.getCoords(line1);
                var coords2 = invariant_1.getCoords(line2);
                if (coords1.length !== 2) {
                    throw new Error("<intersects> line1 must only contain 2 coordinates");
                }
                if (coords2.length !== 2) {
                    throw new Error("<intersects> line2 must only contain 2 coordinates");
                }
                var x1 = coords1[0][0];
                var y1 = coords1[0][1];
                var x2 = coords1[1][0];
                var y2 = coords1[1][1];
                var x3 = coords2[0][0];
                var y3 = coords2[0][1];
                var x4 = coords2[1][0];
                var y4 = coords2[1][1];
                var denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
                var numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
                var numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));
                if (denom === 0) {
                    if (numeA === 0 && numeB === 0) {
                        return null;
                    }
                    return null;
                }
                var uA = numeA / denom;
                var uB = numeB / denom;
                if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
                    var x = x1 + (uA * (x2 - x1));
                    var y = y1 + (uA * (y2 - y1));
                    return helpers_1.point([x, y]);
                }
                return null;
            }
            exports.default = lineIntersect;

        }
        , {
            "@turf/helpers": 9,
            "@turf/invariant": 10,
            "@turf/line-segment": 13,
            "@turf/meta": 14,
            "geojson-rbush": 21
        }],
        12: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var geojson_rbush_1 = require("geojson-rbush");
            var line_segment_1 = require("@turf/line-segment");
            var nearest_point_on_line_1 = require("@turf/nearest-point-on-line");
            var boolean_point_on_line_1 = require("@turf/boolean-point-on-line");
            var invariant_1 = require("@turf/invariant");
            var meta_1 = require("@turf/meta");
            var helpers_1 = require("@turf/helpers");
            var equal = require("deep-equal");
            /**
 * Takes any LineString or Polygon and returns the overlapping lines between both features.
 *
 * @name lineOverlap
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line1 any LineString or Polygon
 * @param {Geometry|Feature<LineString|MultiLineString|Polygon|MultiPolygon>} line2 any LineString or Polygon
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.tolerance=0] Tolerance distance to match overlapping line segments (in kilometers)
 * @returns {FeatureCollection<LineString>} lines(s) that are overlapping between both features
 * @example
 * var line1 = turf.lineString([[115, -35], [125, -30], [135, -30], [145, -35]]);
 * var line2 = turf.lineString([[115, -25], [125, -30], [135, -30], [145, -25]]);
 *
 * var overlapping = turf.lineOverlap(line1, line2);
 *
 * //addToMap
 * var addToMap = [line1, line2, overlapping]
 */
            function lineOverlap(line1, line2, options) {
                if (options === void 0) {
                    options = {};
                }
                // Optional parameters
                options = options || {};
                if (!helpers_1.isObject(options))
                    throw new Error('options is invalid');
                var tolerance = options.tolerance || 0;
                // Containers
                var features = [];
                // Create Spatial Index
                var tree = geojson_rbush_1.default();
                // To-Do -- HACK way to support typescript
                var line = line_segment_1.default(line1);
                tree.load(line);
                var overlapSegment;
                // Line Intersection
                // Iterate over line segments
                meta_1.segmentEach(line2, function(segment) {
                    var doesOverlaps = false;
                    // Iterate over each segments which falls within the same bounds
                    meta_1.featureEach(tree.search(segment), function(match) {
                        if (doesOverlaps === false) {
                            var coordsSegment = invariant_1.getCoords(segment).sort();
                            var coordsMatch = invariant_1.getCoords(match).sort();
                            // Segment overlaps feature
                            if (equal(coordsSegment, coordsMatch)) {
                                doesOverlaps = true;
                                // Overlaps already exists - only append last coordinate of segment
                                if (overlapSegment)
                                    overlapSegment = concatSegment(overlapSegment, segment);
                                else
                                    overlapSegment = segment;
                                // Match segments which don't share nodes (Issue #901)
                            } else if ((tolerance === 0) ? boolean_point_on_line_1.default(coordsSegment[0], match) && boolean_point_on_line_1.default(coordsSegment[1], match) : nearest_point_on_line_1.default(match, coordsSegment[0]).properties.dist <= tolerance && nearest_point_on_line_1.default(match, coordsSegment[1]).properties.dist <= tolerance) {
                                doesOverlaps = true;
                                if (overlapSegment)
                                    overlapSegment = concatSegment(overlapSegment, segment);
                                else
                                    overlapSegment = segment;
                            } else if ((tolerance === 0) ? boolean_point_on_line_1.default(coordsMatch[0], segment) && boolean_point_on_line_1.default(coordsMatch[1], segment) : nearest_point_on_line_1.default(segment, coordsMatch[0]).properties.dist <= tolerance && nearest_point_on_line_1.default(segment, coordsMatch[1]).properties.dist <= tolerance) {
                                // Do not define (doesOverlap = true) since more matches can occur within the same segment
                                // doesOverlaps = true;
                                if (overlapSegment)
                                    overlapSegment = concatSegment(overlapSegment, match);
                                else
                                    overlapSegment = match;
                            }
                        }
                    });
                    // Segment doesn't overlap - add overlaps to results & reset
                    if (doesOverlaps === false && overlapSegment) {
                        features.push(overlapSegment);
                        overlapSegment = undefined;
                    }
                });
                // Add last segment if exists
                if (overlapSegment)
                    features.push(overlapSegment);
                return helpers_1.featureCollection(features);
            }
            /**
 * Concat Segment
 *
 * @private
 * @param {Feature<LineString>} line LineString
 * @param {Feature<LineString>} segment 2-vertex LineString
 * @returns {Feature<LineString>} concat linestring
 */
            function concatSegment(line, segment) {
                var coords = invariant_1.getCoords(segment);
                var lineCoords = invariant_1.getCoords(line);
                var start = lineCoords[0];
                var end = lineCoords[lineCoords.length - 1];
                var geom = line.geometry.coordinates;
                if (equal(coords[0], start))
                    geom.unshift(coords[1]);
                else if (equal(coords[0], end))
                    geom.push(coords[1]);
                else if (equal(coords[1], start))
                    geom.unshift(coords[0]);
                else if (equal(coords[1], end))
                    geom.push(coords[0]);
                return line;
            }
            exports.default = lineOverlap;

        }
        , {
            "@turf/boolean-point-on-line": 5,
            "@turf/helpers": 9,
            "@turf/invariant": 10,
            "@turf/line-segment": 13,
            "@turf/meta": 14,
            "@turf/nearest-point-on-line": 15,
            "deep-equal": 17,
            "geojson-rbush": 21
        }],
        13: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var helpers_1 = require("@turf/helpers");
            var invariant_1 = require("@turf/invariant");
            var meta_1 = require("@turf/meta");
            /**
 * Creates a {@link FeatureCollection} of 2-vertex {@link LineString} segments from a
 * {@link LineString|(Multi)LineString} or {@link Polygon|(Multi)Polygon}.
 *
 * @name lineSegment
 * @param {GeoJSON} geojson GeoJSON Polygon or LineString
 * @returns {FeatureCollection<LineString>} 2-vertex line segments
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 * var segments = turf.lineSegment(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, segments]
 */
            function lineSegment(geojson) {
                if (!geojson) {
                    throw new Error("geojson is required");
                }
                var results = [];
                meta_1.flattenEach(geojson, function(feature) {
                    lineSegmentFeature(feature, results);
                });
                return helpers_1.featureCollection(results);
            }
            /**
 * Line Segment
 *
 * @private
 * @param {Feature<LineString|Polygon>} geojson Line or polygon feature
 * @param {Array} results push to results
 * @returns {void}
 */
            function lineSegmentFeature(geojson, results) {
                var coords = [];
                var geometry = geojson.geometry;
                if (geometry !== null) {
                    switch (geometry.type) {
                    case "Polygon":
                        coords = invariant_1.getCoords(geometry);
                        break;
                    case "LineString":
                        coords = [invariant_1.getCoords(geometry)];
                    }
                    coords.forEach(function(coord) {
                        var segments = createSegments(coord, geojson.properties);
                        segments.forEach(function(segment) {
                            segment.id = results.length;
                            results.push(segment);
                        });
                    });
                }
            }
            /**
 * Create Segments from LineString coordinates
 *
 * @private
 * @param {Array<Array<number>>} coords LineString coordinates
 * @param {*} properties GeoJSON properties
 * @returns {Array<Feature<LineString>>} line segments
 */
            function createSegments(coords, properties) {
                var segments = [];
                coords.reduce(function(previousCoords, currentCoords) {
                    var segment = helpers_1.lineString([previousCoords, currentCoords], properties);
                    segment.bbox = bbox(previousCoords, currentCoords);
                    segments.push(segment);
                    return currentCoords;
                });
                return segments;
            }
            /**
 * Create BBox between two coordinates (faster than @turf/bbox)
 *
 * @private
 * @param {Array<number>} coords1 Point coordinate
 * @param {Array<number>} coords2 Point coordinate
 * @returns {BBox} [west, south, east, north]
 */
            function bbox(coords1, coords2) {
                var x1 = coords1[0];
                var y1 = coords1[1];
                var x2 = coords2[0];
                var y2 = coords2[1];
                var west = (x1 < x2) ? x1 : x2;
                var south = (y1 < y2) ? y1 : y2;
                var east = (x1 > x2) ? x1 : x2;
                var north = (y1 > y2) ? y1 : y2;
                return [west, south, east, north];
            }
            exports.default = lineSegment;

        }
        , {
            "@turf/helpers": 9,
            "@turf/invariant": 10,
            "@turf/meta": 14
        }],
        14: [function(require, module, exports) {
            'use strict';

            Object.defineProperty(exports, '__esModule', {
                value: true
            });

            var helpers = require('@turf/helpers');

            /**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

            /**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
            function coordEach(geojson, callback, excludeWrapCoord) {
                // Handles null Geometry -- Skips this GeoJSON
                if (geojson === null)
                    return;
                var j, k, l, geometry, stopG, coords, geometryMaybeCollection, wrapShrink = 0, coordIndex = 0, isGeometryCollection, type = geojson.type, isFeatureCollection = type === 'FeatureCollection', isFeature = type === 'Feature', stop = isFeatureCollection ? geojson.features.length : 1;

                // This logic may look a little weird. The reason why it is that way
                // is because it's trying to be fast. GeoJSON supports multiple kinds
                // of objects at its root: FeatureCollection, Features, Geometries.
                // This function has the responsibility of handling all of them, and that
                // means that some of the `for` loops you see below actually just don't apply
                // to certain inputs. For instance, if you give this just a
                // Point geometry, then both loops are short-circuited and all we do
                // is gradually rename the input until it's called 'geometry'.
                //
                // This also aims to allocate as few resources as possible: just a
                // few numbers and booleans, rather than any temporary arrays as would
                // be required with the normalization approach.
                for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
                    geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry : (isFeature ? geojson.geometry : geojson));
                    isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
                    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

                    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
                        var multiFeatureIndex = 0;
                        var geometryIndex = 0;
                        geometry = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;

                        // Handles null Geometry -- Skips this geometry
                        if (geometry === null)
                            continue;
                        coords = geometry.coordinates;
                        var geomType = geometry.type;

                        wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

                        switch (geomType) {
                        case null:
                            break;
                        case 'Point':
                            if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
                                return false;
                            coordIndex++;
                            multiFeatureIndex++;
                            break;
                        case 'LineString':
                        case 'MultiPoint':
                            for (j = 0; j < coords.length; j++) {
                                if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
                                    return false;
                                coordIndex++;
                                if (geomType === 'MultiPoint')
                                    multiFeatureIndex++;
                            }
                            if (geomType === 'LineString')
                                multiFeatureIndex++;
                            break;
                        case 'Polygon':
                        case 'MultiLineString':
                            for (j = 0; j < coords.length; j++) {
                                for (k = 0; k < coords[j].length - wrapShrink; k++) {
                                    if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
                                        return false;
                                    coordIndex++;
                                }
                                if (geomType === 'MultiLineString')
                                    multiFeatureIndex++;
                                if (geomType === 'Polygon')
                                    geometryIndex++;
                            }
                            if (geomType === 'Polygon')
                                multiFeatureIndex++;
                            break;
                        case 'MultiPolygon':
                            for (j = 0; j < coords.length; j++) {
                                geometryIndex = 0;
                                for (k = 0; k < coords[j].length; k++) {
                                    for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                                        if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
                                            return false;
                                        coordIndex++;
                                    }
                                    geometryIndex++;
                                }
                                multiFeatureIndex++;
                            }
                            break;
                        case 'GeometryCollection':
                            for (j = 0; j < geometry.geometries.length; j++)
                                if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false)
                                    return false;
                            break;
                        default:
                            throw new Error('Unknown Geometry Type');
                        }
                    }
                }
            }

            /**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback coordReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

            /**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @name coordReduce
 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentCoord;
 * });
 */
            function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
                var previousValue = initialValue;
                coordEach(geojson, function(currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
                    if (coordIndex === 0 && initialValue === undefined)
                        previousValue = currentCoord;
                    else
                        previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex);
                }, excludeWrapCoord);
                return previousValue;
            }

            /**
 * Callback for propEach
 *
 * @callback propEachCallback
 * @param {Object} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

            /**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @name propEach
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentProperties, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propEach(features, function (currentProperties, featureIndex) {
 *   //=currentProperties
 *   //=featureIndex
 * });
 */
            function propEach(geojson, callback) {
                var i;
                switch (geojson.type) {
                case 'FeatureCollection':
                    for (i = 0; i < geojson.features.length; i++) {
                        if (callback(geojson.features[i].properties, i) === false)
                            break;
                    }
                    break;
                case 'Feature':
                    callback(geojson.properties, 0);
                    break;
                }
            }

            /**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback propReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

            /**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=featureIndex
 *   return currentProperties
 * });
 */
            function propReduce(geojson, callback, initialValue) {
                var previousValue = initialValue;
                propEach(geojson, function(currentProperties, featureIndex) {
                    if (featureIndex === 0 && initialValue === undefined)
                        previousValue = currentProperties;
                    else
                        previousValue = callback(previousValue, currentProperties, featureIndex);
                });
                return previousValue;
            }

            /**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

            /**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
            function featureEach(geojson, callback) {
                if (geojson.type === 'Feature') {
                    callback(geojson, 0);
                } else if (geojson.type === 'FeatureCollection') {
                    for (var i = 0; i < geojson.features.length; i++) {
                        if (callback(geojson.features[i], i) === false)
                            break;
                    }
                }
            }

            /**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback featureReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

            /**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name featureReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   return currentFeature
 * });
 */
            function featureReduce(geojson, callback, initialValue) {
                var previousValue = initialValue;
                featureEach(geojson, function(currentFeature, featureIndex) {
                    if (featureIndex === 0 && initialValue === undefined)
                        previousValue = currentFeature;
                    else
                        previousValue = callback(previousValue, currentFeature, featureIndex);
                });
                return previousValue;
            }

            /**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
            function coordAll(geojson) {
                var coords = [];
                coordEach(geojson, function(coord) {
                    coords.push(coord);
                });
                return coords;
            }

            /**
 * Callback for geomEach
 *
 * @callback geomEachCallback
 * @param {Geometry} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {Object} featureProperties The current Feature Properties being processed.
 * @param {Array<number>} featureBBox The current Feature BBox being processed.
 * @param {number|string} featureId The current Feature Id being processed.
 */

            /**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @name geomEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomEach(features, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 * });
 */
            function geomEach(geojson, callback) {
                var i, j, g, geometry, stopG, geometryMaybeCollection, isGeometryCollection, featureProperties, featureBBox, featureId, featureIndex = 0, isFeatureCollection = geojson.type === 'FeatureCollection', isFeature = geojson.type === 'Feature', stop = isFeatureCollection ? geojson.features.length : 1;

                // This logic may look a little weird. The reason why it is that way
                // is because it's trying to be fast. GeoJSON supports multiple kinds
                // of objects at its root: FeatureCollection, Features, Geometries.
                // This function has the responsibility of handling all of them, and that
                // means that some of the `for` loops you see below actually just don't apply
                // to certain inputs. For instance, if you give this just a
                // Point geometry, then both loops are short-circuited and all we do
                // is gradually rename the input until it's called 'geometry'.
                //
                // This also aims to allocate as few resources as possible: just a
                // few numbers and booleans, rather than any temporary arrays as would
                // be required with the normalization approach.
                for (i = 0; i < stop; i++) {

                    geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry : (isFeature ? geojson.geometry : geojson));
                    featureProperties = (isFeatureCollection ? geojson.features[i].properties : (isFeature ? geojson.properties : {}));
                    featureBBox = (isFeatureCollection ? geojson.features[i].bbox : (isFeature ? geojson.bbox : undefined));
                    featureId = (isFeatureCollection ? geojson.features[i].id : (isFeature ? geojson.id : undefined));
                    isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
                    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

                    for (g = 0; g < stopG; g++) {
                        geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

                        // Handle null Geometry
                        if (geometry === null) {
                            if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false)
                                return false;
                            continue;
                        }
                        switch (geometry.type) {
                        case 'Point':
                        case 'LineString':
                        case 'MultiPoint':
                        case 'Polygon':
                        case 'MultiLineString':
                        case 'MultiPolygon':
                            {
                                if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false)
                                    return false;
                                break;
                            }
                        case 'GeometryCollection':
                            {
                                for (j = 0; j < geometry.geometries.length; j++) {
                                    if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false)
                                        return false;
                                }
                                break;
                            }
                        default:
                            throw new Error('Unknown Geometry Type');
                        }
                    }
                    // Only increase `featureIndex` per each feature
                    featureIndex++;
                }
            }

            /**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback geomReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Geometry} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {Object} featureProperties The current Feature Properties being processed.
 * @param {Array<number>} featureBBox The current Feature BBox being processed.
 * @param {number|string} featureId The current Feature Id being processed.
 */

            /**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @name geomReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 *   return currentGeometry
 * });
 */
            function geomReduce(geojson, callback, initialValue) {
                var previousValue = initialValue;
                geomEach(geojson, function(currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
                    if (featureIndex === 0 && initialValue === undefined)
                        previousValue = currentGeometry;
                    else
                        previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
                });
                return previousValue;
            }

            /**
 * Callback for flattenEach
 *
 * @callback flattenEachCallback
 * @param {Feature} currentFeature The current flattened feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 */

            /**
 * Iterate over flattened features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name flattenEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex, multiFeatureIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenEach(features, function (currentFeature, featureIndex, multiFeatureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 * });
 */
            function flattenEach(geojson, callback) {
                geomEach(geojson, function(geometry, featureIndex, properties, bbox, id) {
                    // Callback for single geometry
                    var type = (geometry === null) ? null : geometry.type;
                    switch (type) {
                    case null:
                    case 'Point':
                    case 'LineString':
                    case 'Polygon':
                        if (callback(helpers.feature(geometry, properties, {
                            bbox: bbox,
                            id: id
                        }), featureIndex, 0) === false)
                            return false;
                        return;
                    }

                    var geomType;

                    // Callback for multi-geometry
                    switch (type) {
                    case 'MultiPoint':
                        geomType = 'Point';
                        break;
                    case 'MultiLineString':
                        geomType = 'LineString';
                        break;
                    case 'MultiPolygon':
                        geomType = 'Polygon';
                        break;
                    }

                    for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
                        var coordinate = geometry.coordinates[multiFeatureIndex];
                        var geom = {
                            type: geomType,
                            coordinates: coordinate
                        };
                        if (callback(helpers.feature(geom, properties), featureIndex, multiFeatureIndex) === false)
                            return false;
                    }
                });
            }

            /**
 * Callback for flattenReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback flattenReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 */

            /**
 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
 *
 * @name flattenReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, multiFeatureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, multiFeatureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   return currentFeature
 * });
 */
            function flattenReduce(geojson, callback, initialValue) {
                var previousValue = initialValue;
                flattenEach(geojson, function(currentFeature, featureIndex, multiFeatureIndex) {
                    if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === undefined)
                        previousValue = currentFeature;
                    else
                        previousValue = callback(previousValue, currentFeature, featureIndex, multiFeatureIndex);
                });
                return previousValue;
            }

            /**
 * Callback for segmentEach
 *
 * @callback segmentEachCallback
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 * @returns {void}
 */

            /**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex)
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentEach(polygon, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //=currentSegment
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   //=segmentIndex
 * });
 *
 * // Calculate the total number of segments
 * var total = 0;
 * turf.segmentEach(polygon, function () {
 *     total++;
 * });
 */
            function segmentEach(geojson, callback) {
                flattenEach(geojson, function(feature, featureIndex, multiFeatureIndex) {
                    var segmentIndex = 0;

                    // Exclude null Geometries
                    if (!feature.geometry)
                        return;
                    // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
                    var type = feature.geometry.type;
                    if (type === 'Point' || type === 'MultiPoint')
                        return;

                    // Generate 2-vertex line segments
                    var previousCoords;
                    var previousFeatureIndex = 0;
                    var previousMultiIndex = 0;
                    var prevGeomIndex = 0;
                    if (coordEach(feature, function(currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
                        // Simulating a meta.coordReduce() since `reduce` operations cannot be stopped by returning `false`
                        if (previousCoords === undefined || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
                            previousCoords = currentCoord;
                            previousFeatureIndex = featureIndex;
                            previousMultiIndex = multiPartIndexCoord;
                            prevGeomIndex = geometryIndex;
                            segmentIndex = 0;
                            return;
                        }
                        var currentSegment = helpers.lineString([previousCoords, currentCoord], feature.properties);
                        if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false)
                            return false;
                        segmentIndex++;
                        previousCoords = currentCoord;
                    }) === false)
                        return false;
                });
            }

            /**
 * Callback for segmentReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback segmentReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 */

            /**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //= previousSegment
 *   //= currentSegment
 *   //= featureIndex
 *   //= multiFeatureIndex
 *   //= geometryIndex
 *   //= segmentInex
 *   return currentSegment
 * });
 *
 * // Calculate the total number of segments
 * var initialValue = 0
 * var total = turf.segmentReduce(polygon, function (previousValue) {
 *     previousValue++;
 *     return previousValue;
 * }, initialValue);
 */
            function segmentReduce(geojson, callback, initialValue) {
                var previousValue = initialValue;
                var started = false;
                segmentEach(geojson, function(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
                    if (started === false && initialValue === undefined)
                        previousValue = currentSegment;
                    else
                        previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
                    started = true;
                });
                return previousValue;
            }

            /**
 * Callback for lineEach
 *
 * @callback lineEachCallback
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 */

            /**
 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
 * similar to Array.forEach.
 *
 * @name lineEach
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @example
 * var multiLine = turf.multiLineString([
 *   [[26, 37], [35, 45]],
 *   [[36, 53], [38, 50], [41, 55]]
 * ]);
 *
 * turf.lineEach(multiLine, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
            function lineEach(geojson, callback) {
                // validation
                if (!geojson)
                    throw new Error('geojson is required');

                flattenEach(geojson, function(feature, featureIndex, multiFeatureIndex) {
                    if (feature.geometry === null)
                        return;
                    var type = feature.geometry.type;
                    var coords = feature.geometry.coordinates;
                    switch (type) {
                    case 'LineString':
                        if (callback(feature, featureIndex, multiFeatureIndex, 0, 0) === false)
                            return false;
                        break;
                    case 'Polygon':
                        for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
                            if (callback(helpers.lineString(coords[geometryIndex], feature.properties), featureIndex, multiFeatureIndex, geometryIndex) === false)
                                return false;
                        }
                        break;
                    }
                });
            }

            /**
 * Callback for lineReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback lineReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 */

            /**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name lineReduce
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var multiPoly = turf.multiPolygon([
 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
 * ]);
 *
 * turf.lineReduce(multiPoly, function (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentLine
 * });
 */
            function lineReduce(geojson, callback, initialValue) {
                var previousValue = initialValue;
                lineEach(geojson, function(currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
                    if (featureIndex === 0 && initialValue === undefined)
                        previousValue = currentLine;
                    else
                        previousValue = callback(previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex);
                });
                return previousValue;
            }

            /**
 * Finds a particular 2-vertex LineString Segment from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 * Point & MultiPoint will always return null.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.segmentIndex=0] Segment Index
 * @param {Object} [options.properties={}] Translate Properties to output LineString
 * @param {BBox} [options.bbox={}] Translate BBox to output LineString
 * @param {number|string} [options.id={}] Translate Id to output LineString
 * @returns {Feature<LineString>} 2-vertex GeoJSON Feature LineString
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findSegment(multiLine);
 * // => Feature<LineString<[[10, 10], [50, 30]]>>
 *
 * // First Segment of 2nd Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: 1});
 * // => Feature<LineString<[[-10, -10], [-50, -30]]>>
 *
 * // Last Segment of Last Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: -1, segmentIndex: -1});
 * // => Feature<LineString<[[-50, -30], [-30, -40]]>>
 */
            function findSegment(geojson, options) {
                // Optional Parameters
                options = options || {};
                if (!helpers.isObject(options))
                    throw new Error('options is invalid');
                var featureIndex = options.featureIndex || 0;
                var multiFeatureIndex = options.multiFeatureIndex || 0;
                var geometryIndex = options.geometryIndex || 0;
                var segmentIndex = options.segmentIndex || 0;

                // Find FeatureIndex
                var properties = options.properties;
                var geometry;

                switch (geojson.type) {
                case 'FeatureCollection':
                    if (featureIndex < 0)
                        featureIndex = geojson.features.length + featureIndex;
                    properties = properties || geojson.features[featureIndex].properties;
                    geometry = geojson.features[featureIndex].geometry;
                    break;
                case 'Feature':
                    properties = properties || geojson.properties;
                    geometry = geojson.geometry;
                    break;
                case 'Point':
                case 'MultiPoint':
                    return null;
                case 'LineString':
                case 'Polygon':
                case 'MultiLineString':
                case 'MultiPolygon':
                    geometry = geojson;
                    break;
                default:
                    throw new Error('geojson is invalid');
                }

                // Find SegmentIndex
                if (geometry === null)
                    return null;
                var coords = geometry.coordinates;
                switch (geometry.type) {
                case 'Point':
                case 'MultiPoint':
                    return null;
                case 'LineString':
                    if (segmentIndex < 0)
                        segmentIndex = coords.length + segmentIndex - 1;
                    return helpers.lineString([coords[segmentIndex], coords[segmentIndex + 1]], properties, options);
                case 'Polygon':
                    if (geometryIndex < 0)
                        geometryIndex = coords.length + geometryIndex;
                    if (segmentIndex < 0)
                        segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
                    return helpers.lineString([coords[geometryIndex][segmentIndex], coords[geometryIndex][segmentIndex + 1]], properties, options);
                case 'MultiLineString':
                    if (multiFeatureIndex < 0)
                        multiFeatureIndex = coords.length + multiFeatureIndex;
                    if (segmentIndex < 0)
                        segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
                    return helpers.lineString([coords[multiFeatureIndex][segmentIndex], coords[multiFeatureIndex][segmentIndex + 1]], properties, options);
                case 'MultiPolygon':
                    if (multiFeatureIndex < 0)
                        multiFeatureIndex = coords.length + multiFeatureIndex;
                    if (geometryIndex < 0)
                        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
                    if (segmentIndex < 0)
                        segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
                    return helpers.lineString([coords[multiFeatureIndex][geometryIndex][segmentIndex], coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]], properties, options);
                }
                throw new Error('geojson is invalid');
            }

            /**
 * Finds a particular Point from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.coordIndex=0] Coord Index
 * @param {Object} [options.properties={}] Translate Properties to output Point
 * @param {BBox} [options.bbox={}] Translate BBox to output Point
 * @param {number|string} [options.id={}] Translate Id to output Point
 * @returns {Feature<Point>} 2-vertex GeoJSON Feature Point
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findPoint(multiLine);
 * // => Feature<Point<[10, 10]>>
 *
 * // First Segment of the 2nd Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: 1});
 * // => Feature<Point<[-10, -10]>>
 *
 * // Last Segment of last Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: -1, coordIndex: -1});
 * // => Feature<Point<[-30, -40]>>
 */
            function findPoint(geojson, options) {
                // Optional Parameters
                options = options || {};
                if (!helpers.isObject(options))
                    throw new Error('options is invalid');
                var featureIndex = options.featureIndex || 0;
                var multiFeatureIndex = options.multiFeatureIndex || 0;
                var geometryIndex = options.geometryIndex || 0;
                var coordIndex = options.coordIndex || 0;

                // Find FeatureIndex
                var properties = options.properties;
                var geometry;

                switch (geojson.type) {
                case 'FeatureCollection':
                    if (featureIndex < 0)
                        featureIndex = geojson.features.length + featureIndex;
                    properties = properties || geojson.features[featureIndex].properties;
                    geometry = geojson.features[featureIndex].geometry;
                    break;
                case 'Feature':
                    properties = properties || geojson.properties;
                    geometry = geojson.geometry;
                    break;
                case 'Point':
                case 'MultiPoint':
                    return null;
                case 'LineString':
                case 'Polygon':
                case 'MultiLineString':
                case 'MultiPolygon':
                    geometry = geojson;
                    break;
                default:
                    throw new Error('geojson is invalid');
                }

                // Find Coord Index
                if (geometry === null)
                    return null;
                var coords = geometry.coordinates;
                switch (geometry.type) {
                case 'Point':
                    return helpers.point(coords, properties, options);
                case 'MultiPoint':
                    if (multiFeatureIndex < 0)
                        multiFeatureIndex = coords.length + multiFeatureIndex;
                    return helpers.point(coords[multiFeatureIndex], properties, options);
                case 'LineString':
                    if (coordIndex < 0)
                        coordIndex = coords.length + coordIndex;
                    return helpers.point(coords[coordIndex], properties, options);
                case 'Polygon':
                    if (geometryIndex < 0)
                        geometryIndex = coords.length + geometryIndex;
                    if (coordIndex < 0)
                        coordIndex = coords[geometryIndex].length + coordIndex;
                    return helpers.point(coords[geometryIndex][coordIndex], properties, options);
                case 'MultiLineString':
                    if (multiFeatureIndex < 0)
                        multiFeatureIndex = coords.length + multiFeatureIndex;
                    if (coordIndex < 0)
                        coordIndex = coords[multiFeatureIndex].length + coordIndex;
                    return helpers.point(coords[multiFeatureIndex][coordIndex], properties, options);
                case 'MultiPolygon':
                    if (multiFeatureIndex < 0)
                        multiFeatureIndex = coords.length + multiFeatureIndex;
                    if (geometryIndex < 0)
                        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
                    if (coordIndex < 0)
                        coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
                    return helpers.point(coords[multiFeatureIndex][geometryIndex][coordIndex], properties, options);
                }
                throw new Error('geojson is invalid');
            }

            exports.coordEach = coordEach;
            exports.coordReduce = coordReduce;
            exports.propEach = propEach;
            exports.propReduce = propReduce;
            exports.featureEach = featureEach;
            exports.featureReduce = featureReduce;
            exports.coordAll = coordAll;
            exports.geomEach = geomEach;
            exports.geomReduce = geomReduce;
            exports.flattenEach = flattenEach;
            exports.flattenReduce = flattenReduce;
            exports.segmentEach = segmentEach;
            exports.segmentReduce = segmentReduce;
            exports.lineEach = lineEach;
            exports.lineReduce = lineReduce;
            exports.findSegment = findSegment;
            exports.findPoint = findPoint;

        }
        , {
            "@turf/helpers": 9
        }],
        15: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var bearing_1 = require("@turf/bearing");
            var distance_1 = require("@turf/distance");
            var destination_1 = require("@turf/destination");
            var line_intersect_1 = require("@turf/line-intersect");
            var meta_1 = require("@turf/meta");
            var helpers_1 = require("@turf/helpers");
            var invariant_1 = require("@turf/invariant");
            /**
 * Takes a {@link Point} and a {@link LineString} and calculates the closest Point on the (Multi)LineString.
 *
 * @name nearestPointOnLine
 * @param {Geometry|Feature<LineString|MultiLineString>} lines lines to snap to
 * @param {Geometry|Feature<Point>|number[]} pt point to snap from
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Point>} closest point on the `line` to `point`. The properties object will contain three values: `index`: closest point was found on nth line part, `dist`: distance between pt and the closest point, `location`: distance along the line between start and the closest point.
 * @example
 * var line = turf.lineString([
 *     [-77.031669, 38.878605],
 *     [-77.029609, 38.881946],
 *     [-77.020339, 38.884084],
 *     [-77.025661, 38.885821],
 *     [-77.021884, 38.889563],
 *     [-77.019824, 38.892368]
 * ]);
 * var pt = turf.point([-77.037076, 38.884017]);
 *
 * var snapped = turf.nearestPointOnLine(line, pt, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [line, pt, snapped];
 * snapped.properties['marker-color'] = '#00f';
 */
            function nearestPointOnLine(lines, pt, options) {
                if (options === void 0) {
                    options = {};
                }
                var closestPt = helpers_1.point([Infinity, Infinity], {
                    dist: Infinity
                });
                var length = 0.0;
                meta_1.flattenEach(lines, function(line) {
                    var coords = invariant_1.getCoords(line);
                    for (var i = 0; i < coords.length - 1; i++) {
                        //start
                        var start = helpers_1.point(coords[i]);
                        start.properties.dist = distance_1.default(pt, start, options);
                        //stop
                        var stop_1 = helpers_1.point(coords[i + 1]);
                        stop_1.properties.dist = distance_1.default(pt, stop_1, options);
                        // sectionLength
                        var sectionLength = distance_1.default(start, stop_1, options);
                        //perpendicular
                        var heightDistance = Math.max(start.properties.dist, stop_1.properties.dist);
                        var direction = bearing_1.default(start, stop_1);
                        var perpendicularPt1 = destination_1.default(pt, heightDistance, direction + 90, options);
                        var perpendicularPt2 = destination_1.default(pt, heightDistance, direction - 90, options);
                        var intersect = line_intersect_1.default(helpers_1.lineString([perpendicularPt1.geometry.coordinates, perpendicularPt2.geometry.coordinates]), helpers_1.lineString([start.geometry.coordinates, stop_1.geometry.coordinates]));
                        var intersectPt = null;
                        if (intersect.features.length > 0) {
                            intersectPt = intersect.features[0];
                            intersectPt.properties.dist = distance_1.default(pt, intersectPt, options);
                            intersectPt.properties.location = length + distance_1.default(start, intersectPt, options);
                        }
                        if (start.properties.dist < closestPt.properties.dist) {
                            closestPt = start;
                            closestPt.properties.index = i;
                            closestPt.properties.location = length;
                        }
                        if (stop_1.properties.dist < closestPt.properties.dist) {
                            closestPt = stop_1;
                            closestPt.properties.index = i + 1;
                            closestPt.properties.location = length + sectionLength;
                        }
                        if (intersectPt && intersectPt.properties.dist < closestPt.properties.dist) {
                            closestPt = intersectPt;
                            closestPt.properties.index = i;
                        }
                        // update length
                        length += sectionLength;
                    }
                });
                return closestPt;
            }
            exports.default = nearestPointOnLine;

        }
        , {
            "@turf/bearing": 2,
            "@turf/destination": 7,
            "@turf/distance": 8,
            "@turf/helpers": 9,
            "@turf/invariant": 10,
            "@turf/line-intersect": 11,
            "@turf/meta": 14
        }],
        16: [function(require, module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var martinez = require("martinez-polygon-clipping");
            var invariant_1 = require("@turf/invariant");
            var helpers_1 = require("@turf/helpers");
            /**
 * Takes two {@link (Multi)Polygon(s)} and returns a combined polygon. If the input polygons are not contiguous, this function returns a {@link MultiPolygon} feature.
 *
 * @name union
 * @param {Feature<Polygon|MultiPolygon>} polygon1 input Polygon feature
 * @param {Feature<Polygon|MultiPolygon>} polygon2 Polygon feature to difference from polygon1
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] Translate Properties to output Feature
 * @returns {Feature<(Polygon|MultiPolygon)>} a combined {@link Polygon} or {@link MultiPolygon} feature
 * @example
 * var poly1 = turf.polygon([[
 *     [-82.574787, 35.594087],
 *     [-82.574787, 35.615581],
 *     [-82.545261, 35.615581],
 *     [-82.545261, 35.594087],
 *     [-82.574787, 35.594087]
 * ]], {"fill": "#0f0"});
 * var poly2 = turf.polygon([[
 *     [-82.560024, 35.585153],
 *     [-82.560024, 35.602602],
 *     [-82.52964, 35.602602],
 *     [-82.52964, 35.585153],
 *     [-82.560024, 35.585153]
 * ]], {"fill": "#00f"});
 *
 * var union = turf.union(poly1, poly2);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, union];
 */
            function union(polygon1, polygon2, options) {
                if (options === void 0) {
                    options = {};
                }
                var coords1 = invariant_1.getGeom(polygon1).coordinates;
                var coords2 = invariant_1.getGeom(polygon2).coordinates;
                var unioned = martinez.union(coords1, coords2);
                if (unioned.length === 0)
                    return null;
                if (unioned.length === 1)
                    return helpers_1.polygon(unioned[0], options.properties);
                else
                    return helpers_1.multiPolygon(unioned, options.properties);
            }
            exports.default = union;

        }
        , {
            "@turf/helpers": 9,
            "@turf/invariant": 10,
            "martinez-polygon-clipping": 22
        }],
        17: [function(require, module, exports) {
            var pSlice = Array.prototype.slice;
            var objectKeys = require('./lib/keys.js');
            var isArguments = require('./lib/is_arguments.js');

            var deepEqual = module.exports = function(actual, expected, opts) {
                if (!opts)
                    opts = {};
                // 7.1. All identical values are equivalent, as determined by ===.
                if (actual === expected) {
                    return true;

                } else if (actual instanceof Date && expected instanceof Date) {
                    return actual.getTime() === expected.getTime();

                    // 7.3. Other pairs that do not both pass typeof value == 'object',
                    // equivalence is determined by ==.
                } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
                    return opts.strict ? actual === expected : actual == expected;

                    // 7.4. For all other Object pairs, including Array objects, equivalence is
                    // determined by having the same number of owned properties (as verified
                    // with Object.prototype.hasOwnProperty.call), the same set of keys
                    // (although not necessarily the same order), equivalent values for every
                    // corresponding key, and an identical 'prototype' property. Note: this
                    // accounts for both named and indexed properties on Arrays.
                } else {
                    return objEquiv(actual, expected, opts);
                }
            }

            function isUndefinedOrNull(value) {
                return value === null || value === undefined;
            }

            function isBuffer(x) {
                if (!x || typeof x !== 'object' || typeof x.length !== 'number')
                    return false;
                if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
                    return false;
                }
                if (x.length > 0 && typeof x[0] !== 'number')
                    return false;
                return true;
            }

            function objEquiv(a, b, opts) {
                var i, key;
                if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
                    return false;
                // an identical 'prototype' property.
                if (a.prototype !== b.prototype)
                    return false;
                //~~~I've managed to break Object.keys through screwy arguments passing.
                //   Converting to array solves the problem.
                if (isArguments(a)) {
                    if (!isArguments(b)) {
                        return false;
                    }
                    a = pSlice.call(a);
                    b = pSlice.call(b);
                    return deepEqual(a, b, opts);
                }
                if (isBuffer(a)) {
                    if (!isBuffer(b)) {
                        return false;
                    }
                    if (a.length !== b.length)
                        return false;
                    for (i = 0; i < a.length; i++) {
                        if (a[i] !== b[i])
                            return false;
                    }
                    return true;
                }
                try {
                    var ka = objectKeys(a)
                      , kb = objectKeys(b);
                } catch (e) {
                    //happens when one is a string literal and the other isn't
                    return false;
                }
                // having the same number of owned properties (keys incorporates
                // hasOwnProperty)
                if (ka.length != kb.length)
                    return false;
                //the same set of keys (although not necessarily the same order),
                ka.sort();
                kb.sort();
                //~~~cheap key test
                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] != kb[i])
                        return false;
                }
                //equivalent values for every corresponding key, and
                //~~~possibly expensive deep test
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!deepEqual(a[key], b[key], opts))
                        return false;
                }
                return typeof a === typeof b;
            }

        }
        , {
            "./lib/is_arguments.js": 18,
            "./lib/keys.js": 19
        }],
        18: [function(require, module, exports) {
            var supportsArgumentsClass = (function() {
                return Object.prototype.toString.call(arguments)
            }
            )() == '[object Arguments]';

            exports = module.exports = supportsArgumentsClass ? supported : unsupported;

            exports.supported = supported;
            function supported(object) {
                return Object.prototype.toString.call(object) == '[object Arguments]';
            }
            ;
            exports.unsupported = unsupported;
            function unsupported(object) {
                return object && typeof object == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
            }
            ;

        }
        , {}],
        19: [function(require, module, exports) {
            exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

            exports.shim = shim;
            function shim(obj) {
                var keys = [];
                for (var key in obj)
                    keys.push(key);
                return keys;
            }

        }
        , {}],
        20: [function(require, module, exports) {
            //index.js
            var deepEqual = require('deep-equal');

            var Equality = function(opt) {
                this.precision = opt && opt.precision ? opt.precision : 17;
                this.direction = opt && opt.direction ? opt.direction : false;
                this.pseudoNode = opt && opt.pseudoNode ? opt.pseudoNode : false;
                this.objectComparator = opt && opt.objectComparator ? opt.objectComparator : objectComparator;
            };

            Equality.prototype.compare = function(g1, g2) {
                if (g1.type !== g2.type || !sameLength(g1, g2))
                    return false;

                switch (g1.type) {
                case 'Point':
                    return this.compareCoord(g1.coordinates, g2.coordinates);
                    break;
                case 'LineString':
                    return this.compareLine(g1.coordinates, g2.coordinates, 0, false);
                    break;
                case 'Polygon':
                    return this.comparePolygon(g1, g2);
                    break;
                case 'Feature':
                    return this.compareFeature(g1, g2);
                default:
                    if (g1.type.indexOf('Multi') === 0) {
                        var context = this;
                        var g1s = explode(g1);
                        var g2s = explode(g2);
                        return g1s.every(function(g1part) {
                            return this.some(function(g2part) {
                                return context.compare(g1part, g2part);
                            });
                        }, g2s);
                    }
                }
                return false;
            }
            ;

            function explode(g) {
                return g.coordinates.map(function(part) {
                    return {
                        type: g.type.replace('Multi', ''),
                        coordinates: part
                    }
                });
            }
            //compare length of coordinates/array
            function sameLength(g1, g2) {
                return g1.hasOwnProperty('coordinates') ? g1.coordinates.length === g2.coordinates.length : g1.length === g2.length;
            }

            // compare the two coordinates [x,y]
            Equality.prototype.compareCoord = function(c1, c2) {
                if (c1.length !== c2.length) {
                    return false;
                }

                for (var i = 0; i < c1.length; i++) {
                    if (c1[i].toFixed(this.precision) !== c2[i].toFixed(this.precision)) {
                        return false;
                    }
                }
                return true;
            }
            ;

            Equality.prototype.compareLine = function(path1, path2, ind, isPoly) {
                if (!sameLength(path1, path2))
                    return false;
                var p1 = this.pseudoNode ? path1 : this.removePseudo(path1);
                var p2 = this.pseudoNode ? path2 : this.removePseudo(path2);
                if (isPoly && !this.compareCoord(p1[0], p2[0])) {
                    // fix start index of both to same point
                    p2 = this.fixStartIndex(p2, p1);
                    if (!p2)
                        return;
                }
                // for linestring ind =0 and for polygon ind =1
                var sameDirection = this.compareCoord(p1[ind], p2[ind]);
                if (this.direction || sameDirection) {
                    return this.comparePath(p1, p2);
                } else {
                    if (this.compareCoord(p1[ind], p2[p2.length - (1 + ind)])) {
                        return this.comparePath(p1.slice().reverse(), p2);
                    }
                    return false;
                }
            }
            ;
            Equality.prototype.fixStartIndex = function(sourcePath, targetPath) {
                //make sourcePath first point same as of targetPath
                var correctPath, ind = -1;
                for (var i = 0; i < sourcePath.length; i++) {
                    if (this.compareCoord(sourcePath[i], targetPath[0])) {
                        ind = i;
                        break;
                    }
                }
                if (ind >= 0) {
                    correctPath = [].concat(sourcePath.slice(ind, sourcePath.length), sourcePath.slice(1, ind + 1));
                }
                return correctPath;
            }
            ;
            Equality.prototype.comparePath = function(p1, p2) {
                var cont = this;
                return p1.every(function(c, i) {
                    return cont.compareCoord(c, this[i]);
                }, p2);
            }
            ;

            Equality.prototype.comparePolygon = function(g1, g2) {
                if (this.compareLine(g1.coordinates[0], g2.coordinates[0], 1, true)) {
                    var holes1 = g1.coordinates.slice(1, g1.coordinates.length);
                    var holes2 = g2.coordinates.slice(1, g2.coordinates.length);
                    var cont = this;
                    return holes1.every(function(h1) {
                        return this.some(function(h2) {
                            return cont.compareLine(h1, h2, 1, true);
                        });
                    }, holes2);
                } else {
                    return false;
                }
            }
            ;

            Equality.prototype.compareFeature = function(g1, g2) {
                if (g1.id !== g2.id || !this.objectComparator(g1.properties, g2.properties) || !this.compareBBox(g1, g2)) {
                    return false;
                }
                return this.compare(g1.geometry, g2.geometry);
            }
            ;

            Equality.prototype.compareBBox = function(g1, g2) {
                if ((!g1.bbox && !g2.bbox) || (g1.bbox && g2.bbox && this.compareCoord(g1.bbox, g2.bbox))) {
                    return true;
                }
                return false;
            }
            ;
            Equality.prototype.removePseudo = function(path) {
                //TODO to be implement
                return path;
            }
            ;

            function objectComparator(obj1, obj2) {
                return deepEqual(obj1, obj2, {
                    strict: true
                });
            }

            module.exports = Equality;

        }
        , {
            "deep-equal": 17
        }],
        21: [function(require, module, exports) {
            var rbush = require('rbush');
            var helpers = require('@turf/helpers');
            var meta = require('@turf/meta');
            var turfBBox = require('@turf/bbox').default;
            var featureEach = meta.featureEach;
            var coordEach = meta.coordEach;
            var polygon = helpers.polygon;
            var featureCollection = helpers.featureCollection;

            /**
 * GeoJSON implementation of [RBush](https://github.com/mourner/rbush#rbush) spatial index.
 *
 * @name rbush
 * @param {number} [maxEntries=9] defines the maximum number of entries in a tree node. 9 (used by default) is a
 * reasonable choice for most applications. Higher value means faster insertion and slower search, and vice versa.
 * @returns {RBush} GeoJSON RBush
 * @example
 * var geojsonRbush = require('geojson-rbush').default;
 * var tree = geojsonRbush();
 */
            function geojsonRbush(maxEntries) {
                var tree = rbush(maxEntries);
                /**
     * [insert](https://github.com/mourner/rbush#data-format)
     *
     * @param {Feature} feature insert single GeoJSON Feature
     * @returns {RBush} GeoJSON RBush
     * @example
     * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
     * tree.insert(poly)
     */
                tree.insert = function(feature) {
                    if (feature.type !== 'Feature')
                        throw new Error('invalid feature');
                    feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
                    return rbush.prototype.insert.call(this, feature);
                }
                ;

                /**
     * [load](https://github.com/mourner/rbush#bulk-inserting-data)
     *
     * @param {FeatureCollection|Array<Feature>} features load entire GeoJSON FeatureCollection
     * @returns {RBush} GeoJSON RBush
     * @example
     * var polys = turf.polygons([
     *     [[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]],
     *     [[[-93, 32], [-83, 32], [-83, 39], [-93, 39], [-93, 32]]]
     * ]);
     * tree.load(polys);
     */
                tree.load = function(features) {
                    var load = [];
                    // Load an Array of Features
                    if (Array.isArray(features)) {
                        features.forEach(function(feature) {
                            if (feature.type !== 'Feature')
                                throw new Error('invalid features');
                            feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
                            load.push(feature);
                        });
                    } else {
                        // Load a FeatureCollection
                        featureEach(features, function(feature) {
                            if (feature.type !== 'Feature')
                                throw new Error('invalid features');
                            feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
                            load.push(feature);
                        });
                    }
                    return rbush.prototype.load.call(this, load);
                }
                ;

                /**
     * [remove](https://github.com/mourner/rbush#removing-data)
     *
     * @param {Feature} feature remove single GeoJSON Feature
     * @param {Function} equals Pass a custom equals function to compare by value for removal.
     * @returns {RBush} GeoJSON RBush
     * @example
     * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
     *
     * tree.remove(poly);
     */
                tree.remove = function(feature, equals) {
                    if (feature.type !== 'Feature')
                        throw new Error('invalid feature');
                    feature.bbox = feature.bbox ? feature.bbox : turfBBox(feature);
                    return rbush.prototype.remove.call(this, feature, equals);
                }
                ;

                /**
     * [clear](https://github.com/mourner/rbush#removing-data)
     *
     * @returns {RBush} GeoJSON Rbush
     * @example
     * tree.clear()
     */
                tree.clear = function() {
                    return rbush.prototype.clear.call(this);
                }
                ;

                /**
     * [search](https://github.com/mourner/rbush#search)
     *
     * @param {BBox|FeatureCollection|Feature} geojson search with GeoJSON
     * @returns {FeatureCollection} all features that intersects with the given GeoJSON.
     * @example
     * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
     *
     * tree.search(poly);
     */
                tree.search = function(geojson) {
                    var features = rbush.prototype.search.call(this, this.toBBox(geojson));
                    return featureCollection(features);
                }
                ;

                /**
     * [collides](https://github.com/mourner/rbush#collisions)
     *
     * @param {BBox|FeatureCollection|Feature} geojson collides with GeoJSON
     * @returns {boolean} true if there are any items intersecting the given GeoJSON, otherwise false.
     * @example
     * var poly = turf.polygon([[[-78, 41], [-67, 41], [-67, 48], [-78, 48], [-78, 41]]]);
     *
     * tree.collides(poly);
     */
                tree.collides = function(geojson) {
                    return rbush.prototype.collides.call(this, this.toBBox(geojson));
                }
                ;

                /**
     * [all](https://github.com/mourner/rbush#search)
     *
     * @returns {FeatureCollection} all the features in RBush
     * @example
     * tree.all()
     */
                tree.all = function() {
                    var features = rbush.prototype.all.call(this);
                    return featureCollection(features);
                }
                ;

                /**
     * [toJSON](https://github.com/mourner/rbush#export-and-import)
     *
     * @returns {any} export data as JSON object
     * @example
     * var exported = tree.toJSON()
     */
                tree.toJSON = function() {
                    return rbush.prototype.toJSON.call(this);
                }
                ;

                /**
     * [fromJSON](https://github.com/mourner/rbush#export-and-import)
     *
     * @param {any} json import previously exported data
     * @returns {RBush} GeoJSON RBush
     * @example
     * var exported = {
     *   "children": [
     *     {
     *       "type": "Feature",
     *       "geometry": {
     *         "type": "Point",
     *         "coordinates": [110, 50]
     *       },
     *       "properties": {},
     *       "bbox": [110, 50, 110, 50]
     *     }
     *   ],
     *   "height": 1,
     *   "leaf": true,
     *   "minX": 110,
     *   "minY": 50,
     *   "maxX": 110,
     *   "maxY": 50
     * }
     * tree.fromJSON(exported)
     */
                tree.fromJSON = function(json) {
                    return rbush.prototype.fromJSON.call(this, json);
                }
                ;

                /**
     * Converts GeoJSON to {minX, minY, maxX, maxY} schema
     *
     * @private
     * @param {BBox|FeatureCollection|Feature} geojson feature(s) to retrieve BBox from
     * @returns {Object} converted to {minX, minY, maxX, maxY}
     */
                tree.toBBox = function(geojson) {
                    var bbox;
                    if (geojson.bbox)
                        bbox = geojson.bbox;
                    else if (Array.isArray(geojson) && geojson.length === 4)
                        bbox = geojson;
                    else if (Array.isArray(geojson) && geojson.length === 6)
                        bbox = [geojson[0], geojson[1], geojson[3], geojson[4]];
                    else if (geojson.type === 'Feature')
                        bbox = turfBBox(geojson);
                    else if (geojson.type === 'FeatureCollection')
                        bbox = turfBBox(geojson);
                    else
                        throw new Error('invalid geojson')

                    return {
                        minX: bbox[0],
                        minY: bbox[1],
                        maxX: bbox[2],
                        maxY: bbox[3]
                    };
                }
                ;
                return tree;
            }

            module.exports = geojsonRbush;
            module.exports.default = geojsonRbush;

        }
        , {
            "@turf/bbox": 1,
            "@turf/helpers": 9,
            "@turf/meta": 14,
            "rbush": 24
        }],
        22: [function(require, module, exports) {
            /**
 * martinez v0.4.3
 * Martinez polygon clipping algorithm, does boolean operation on polygons (multipolygons, polygons with holes etc): intersection, union, difference, xor
 *
 * @author Alex Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */

            (function(global, factory) {
                typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (factory((global.martinez = {})));
            }(this, (function(exports) {
                'use strict';

                function DEFAULT_COMPARE(a, b) {
                    return a > b ? 1 : a < b ? -1 : 0;
                }

                var SplayTree = function SplayTree(compare, noDuplicates) {
                    if (compare === void 0)
                        compare = DEFAULT_COMPARE;
                    if (noDuplicates === void 0)
                        noDuplicates = false;

                    this._compare = compare;
                    this._root = null;
                    this._size = 0;
                    this._noDuplicates = !!noDuplicates;
                };

                var prototypeAccessors = {
                    size: {
                        configurable: true
                    }
                };

                SplayTree.prototype.rotateLeft = function rotateLeft(x) {
                    var y = x.right;
                    if (y) {
                        x.right = y.left;
                        if (y.left) {
                            y.left.parent = x;
                        }
                        y.parent = x.parent;
                    }

                    if (!x.parent) {
                        this._root = y;
                    } else if (x === x.parent.left) {
                        x.parent.left = y;
                    } else {
                        x.parent.right = y;
                    }
                    if (y) {
                        y.left = x;
                    }
                    x.parent = y;
                }
                ;

                SplayTree.prototype.rotateRight = function rotateRight(x) {
                    var y = x.left;
                    if (y) {
                        x.left = y.right;
                        if (y.right) {
                            y.right.parent = x;
                        }
                        y.parent = x.parent;
                    }

                    if (!x.parent) {
                        this._root = y;
                    } else if (x === x.parent.left) {
                        x.parent.left = y;
                    } else {
                        x.parent.right = y;
                    }
                    if (y) {
                        y.right = x;
                    }
                    x.parent = y;
                }
                ;

                SplayTree.prototype._splay = function _splay(x) {
                    var this$1 = this;

                    while (x.parent) {
                        var p = x.parent;
                        if (!p.parent) {
                            if (p.left === x) {
                                this$1.rotateRight(p);
                            } else {
                                this$1.rotateLeft(p);
                            }
                        } else if (p.left === x && p.parent.left === p) {
                            this$1.rotateRight(p.parent);
                            this$1.rotateRight(p);
                        } else if (p.right === x && p.parent.right === p) {
                            this$1.rotateLeft(p.parent);
                            this$1.rotateLeft(p);
                        } else if (p.left === x && p.parent.right === p) {
                            this$1.rotateRight(p);
                            this$1.rotateLeft(p);
                        } else {
                            this$1.rotateLeft(p);
                            this$1.rotateRight(p);
                        }
                    }
                }
                ;

                SplayTree.prototype.splay = function splay(x) {
                    var this$1 = this;

                    var p, gp, ggp, l, r;

                    while (x.parent) {
                        p = x.parent;
                        gp = p.parent;

                        if (gp && gp.parent) {
                            ggp = gp.parent;
                            if (ggp.left === gp) {
                                ggp.left = x;
                            } else {
                                ggp.right = x;
                            }
                            x.parent = ggp;
                        } else {
                            x.parent = null;
                            this$1._root = x;
                        }

                        l = x.left;
                        r = x.right;

                        if (x === p.left) {
                            // left
                            if (gp) {
                                if (gp.left === p) {
                                    /* zig-zig */
                                    if (p.right) {
                                        gp.left = p.right;
                                        gp.left.parent = gp;
                                    } else {
                                        gp.left = null;
                                    }

                                    p.right = gp;
                                    gp.parent = p;
                                } else {
                                    /* zig-zag */
                                    if (l) {
                                        gp.right = l;
                                        l.parent = gp;
                                    } else {
                                        gp.right = null;
                                    }

                                    x.left = gp;
                                    gp.parent = x;
                                }
                            }
                            if (r) {
                                p.left = r;
                                r.parent = p;
                            } else {
                                p.left = null;
                            }

                            x.right = p;
                            p.parent = x;
                        } else {
                            // right
                            if (gp) {
                                if (gp.right === p) {
                                    /* zig-zig */
                                    if (p.left) {
                                        gp.right = p.left;
                                        gp.right.parent = gp;
                                    } else {
                                        gp.right = null;
                                    }

                                    p.left = gp;
                                    gp.parent = p;
                                } else {
                                    /* zig-zag */
                                    if (r) {
                                        gp.left = r;
                                        r.parent = gp;
                                    } else {
                                        gp.left = null;
                                    }

                                    x.right = gp;
                                    gp.parent = x;
                                }
                            }
                            if (l) {
                                p.right = l;
                                l.parent = p;
                            } else {
                                p.right = null;
                            }

                            x.left = p;
                            p.parent = x;
                        }
                    }
                }
                ;

                SplayTree.prototype.replace = function replace(u, v) {
                    if (!u.parent) {
                        this._root = v;
                    } else if (u === u.parent.left) {
                        u.parent.left = v;
                    } else {
                        u.parent.right = v;
                    }
                    if (v) {
                        v.parent = u.parent;
                    }
                }
                ;

                SplayTree.prototype.minNode = function minNode(u) {
                    if (u === void 0)
                        u = this._root;

                    if (u) {
                        while (u.left) {
                            u = u.left;
                        }
                    }
                    return u;
                }
                ;

                SplayTree.prototype.maxNode = function maxNode(u) {
                    if (u === void 0)
                        u = this._root;

                    if (u) {
                        while (u.right) {
                            u = u.right;
                        }
                    }
                    return u;
                }
                ;

                SplayTree.prototype.insert = function insert(key, data) {
                    var z = this._root;
                    var p = null;
                    var comp = this._compare;
                    var cmp;

                    if (this._noDuplicates) {
                        while (z) {
                            p = z;
                            cmp = comp(z.key, key);
                            if (cmp === 0) {
                                return;
                            } else if (comp(z.key, key) < 0) {
                                z = z.right;
                            } else {
                                z = z.left;
                            }
                        }
                    } else {
                        while (z) {
                            p = z;
                            if (comp(z.key, key) < 0) {
                                z = z.right;
                            } else {
                                z = z.left;
                            }
                        }
                    }

                    z = {
                        key: key,
                        data: data,
                        left: null,
                        right: null,
                        parent: p
                    };

                    if (!p) {
                        this._root = z;
                    } else if (comp(p.key, z.key) < 0) {
                        p.right = z;
                    } else {
                        p.left = z;
                    }

                    this.splay(z);
                    this._size++;
                    return z;
                }
                ;

                SplayTree.prototype.find = function find(key) {
                    var z = this._root;
                    var comp = this._compare;
                    while (z) {
                        var cmp = comp(z.key, key);
                        if (cmp < 0) {
                            z = z.right;
                        } else if (cmp > 0) {
                            z = z.left;
                        } else {
                            return z;
                        }
                    }
                    return null;
                }
                ;

                /**
   * Whether the tree contains a node with the given key
   * @param{Key} key
   * @return {boolean} true/false
   */
                SplayTree.prototype.contains = function contains(key) {
                    var node = this._root;
                    var comparator = this._compare;
                    while (node) {
                        var cmp = comparator(key, node.key);
                        if (cmp === 0) {
                            return true;
                        } else if (cmp < 0) {
                            node = node.left;
                        } else {
                            node = node.right;
                        }
                    }

                    return false;
                }
                ;

                SplayTree.prototype.remove = function remove(key) {
                    var z = this.find(key);

                    if (!z) {
                        return false;
                    }

                    this.splay(z);

                    if (!z.left) {
                        this.replace(z, z.right);
                    } else if (!z.right) {
                        this.replace(z, z.left);
                    } else {
                        var y = this.minNode(z.right);
                        if (y.parent !== z) {
                            this.replace(y, y.right);
                            y.right = z.right;
                            y.right.parent = y;
                        }
                        this.replace(z, y);
                        y.left = z.left;
                        y.left.parent = y;
                    }

                    this._size--;
                    return true;
                }
                ;

                SplayTree.prototype.removeNode = function removeNode(z) {
                    if (!z) {
                        return false;
                    }

                    this.splay(z);

                    if (!z.left) {
                        this.replace(z, z.right);
                    } else if (!z.right) {
                        this.replace(z, z.left);
                    } else {
                        var y = this.minNode(z.right);
                        if (y.parent !== z) {
                            this.replace(y, y.right);
                            y.right = z.right;
                            y.right.parent = y;
                        }
                        this.replace(z, y);
                        y.left = z.left;
                        y.left.parent = y;
                    }

                    this._size--;
                    return true;
                }
                ;

                SplayTree.prototype.erase = function erase(key) {
                    var z = this.find(key);
                    if (!z) {
                        return;
                    }

                    this.splay(z);

                    var s = z.left;
                    var t = z.right;

                    var sMax = null;
                    if (s) {
                        s.parent = null;
                        sMax = this.maxNode(s);
                        this.splay(sMax);
                        this._root = sMax;
                    }
                    if (t) {
                        if (s) {
                            sMax.right = t;
                        } else {
                            this._root = t;
                        }
                        t.parent = sMax;
                    }

                    this._size--;
                }
                ;

                /**
   * Removes and returns the node with smallest key
   * @return {?Node}
   */
                SplayTree.prototype.pop = function pop() {
                    var node = this._root
                      , returnValue = null;
                    if (node) {
                        while (node.left) {
                            node = node.left;
                        }
                        returnValue = {
                            key: node.key,
                            data: node.data
                        };
                        this.remove(node.key);
                    }
                    return returnValue;
                }
                ;

                /* eslint-disable class-methods-use-this */

                /**
   * Successor node
   * @param{Node} node
   * @return {?Node}
   */
                SplayTree.prototype.next = function next(node) {
                    var successor = node;
                    if (successor) {
                        if (successor.right) {
                            successor = successor.right;
                            while (successor && successor.left) {
                                successor = successor.left;
                            }
                        } else {
                            successor = node.parent;
                            while (successor && successor.right === node) {
                                node = successor;
                                successor = successor.parent;
                            }
                        }
                    }
                    return successor;
                }
                ;

                /**
   * Predecessor node
   * @param{Node} node
   * @return {?Node}
   */
                SplayTree.prototype.prev = function prev(node) {
                    var predecessor = node;
                    if (predecessor) {
                        if (predecessor.left) {
                            predecessor = predecessor.left;
                            while (predecessor && predecessor.right) {
                                predecessor = predecessor.right;
                            }
                        } else {
                            predecessor = node.parent;
                            while (predecessor && predecessor.left === node) {
                                node = predecessor;
                                predecessor = predecessor.parent;
                            }
                        }
                    }
                    return predecessor;
                }
                ;
                /* eslint-enable class-methods-use-this */

                /**
   * @param{forEachCallback} callback
   * @return {SplayTree}
   */
                SplayTree.prototype.forEach = function forEach(callback) {
                    var current = this._root;
                    var s = []
                      , done = false
                      , i = 0;

                    while (!done) {
                        // Reach the left most Node of the current Node
                        if (current) {
                            // Place pointer to a tree node on the stack
                            // before traversing the node's left subtree
                            s.push(current);
                            current = current.left;
                        } else {
                            // BackTrack from the empty subtree and visit the Node
                            // at the top of the stack; however, if the stack is
                            // empty you are done
                            if (s.length > 0) {
                                current = s.pop();
                                callback(current, i++);

                                // We have visited the node and its left
                                // subtree. Now, it's right subtree's turn
                                current = current.right;
                            } else {
                                done = true;
                            }
                        }
                    }
                    return this;
                }
                ;

                /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   * @param{Key}    low
   * @param{Key}    high
   * @param{Function} fn
   * @param{*?}     ctx
   * @return {SplayTree}
   */
                SplayTree.prototype.range = function range(low, high, fn, ctx) {
                    var this$1 = this;

                    var Q = [];
                    var compare = this._compare;
                    var node = this._root, cmp;

                    while (Q.length !== 0 || node) {
                        if (node) {
                            Q.push(node);
                            node = node.left;
                        } else {
                            node = Q.pop();
                            cmp = compare(node.key, high);
                            if (cmp > 0) {
                                break;
                            } else if (compare(node.key, low) >= 0) {
                                if (fn.call(ctx, node)) {
                                    return this$1;
                                }
                                // stop if smth is returned
                            }
                            node = node.right;
                        }
                    }
                    return this;
                }
                ;

                /**
   * Returns all keys in order
   * @return {Array<Key>}
   */
                SplayTree.prototype.keys = function keys() {
                    var current = this._root;
                    var s = []
                      , r = []
                      , done = false;

                    while (!done) {
                        if (current) {
                            s.push(current);
                            current = current.left;
                        } else {
                            if (s.length > 0) {
                                current = s.pop();
                                r.push(current.key);
                                current = current.right;
                            } else {
                                done = true;
                            }
                        }
                    }
                    return r;
                }
                ;

                /**
   * Returns `data` fields of all nodes in order.
   * @return {Array<Value>}
   */
                SplayTree.prototype.values = function values() {
                    var current = this._root;
                    var s = []
                      , r = []
                      , done = false;

                    while (!done) {
                        if (current) {
                            s.push(current);
                            current = current.left;
                        } else {
                            if (s.length > 0) {
                                current = s.pop();
                                r.push(current.data);
                                current = current.right;
                            } else {
                                done = true;
                            }
                        }
                    }
                    return r;
                }
                ;

                /**
   * Returns node at given index
   * @param{number} index
   * @return {?Node}
   */
                SplayTree.prototype.at = function at(index) {
                    // removed after a consideration, more misleading than useful
                    // index = index % this.size;
                    // if (index < 0) index = this.size - index;

                    var current = this._root;
                    var s = []
                      , done = false
                      , i = 0;

                    while (!done) {
                        if (current) {
                            s.push(current);
                            current = current.left;
                        } else {
                            if (s.length > 0) {
                                current = s.pop();
                                if (i === index) {
                                    return current;
                                }
                                i++;
                                current = current.right;
                            } else {
                                done = true;
                            }
                        }
                    }
                    return null;
                }
                ;

                /**
   * Bulk-load items. Both array have to be same size
   * @param{Array<Key>}  keys
   * @param{Array<Value>}[values]
   * @param{Boolean}     [presort=false] Pre-sort keys and values, using
   *                                       tree's comparator. Sorting is done
   *                                       in-place
   * @return {AVLTree}
   */
                SplayTree.prototype.load = function load(keys, values, presort) {
                    if (keys === void 0)
                        keys = [];
                    if (values === void 0)
                        values = [];
                    if (presort === void 0)
                        presort = false;

                    if (this._size !== 0) {
                        throw new Error('bulk-load: tree is not empty');
                    }
                    var size = keys.length;
                    if (presort) {
                        sort(keys, values, 0, size - 1, this._compare);
                    }
                    this._root = loadRecursive(null, keys, values, 0, size);
                    this._size = size;
                    return this;
                }
                ;

                SplayTree.prototype.min = function min() {
                    var node = this.minNode(this._root);
                    if (node) {
                        return node.key;
                    } else {
                        return null;
                    }
                }
                ;

                SplayTree.prototype.max = function max() {
                    var node = this.maxNode(this._root);
                    if (node) {
                        return node.key;
                    } else {
                        return null;
                    }
                }
                ;

                SplayTree.prototype.isEmpty = function isEmpty() {
                    return this._root === null;
                }
                ;
                prototypeAccessors.size.get = function() {
                    return this._size;
                }
                ;

                /**
   * Create a tree and load it with items
   * @param{Array<Key>}        keys
   * @param{Array<Value>?}      [values]

   * @param{Function?}          [comparator]
   * @param{Boolean?}           [presort=false] Pre-sort keys and values, using
   *                                             tree's comparator. Sorting is done
   *                                             in-place
   * @param{Boolean?}           [noDuplicates=false] Allow duplicates
   * @return {SplayTree}
   */
                SplayTree.createTree = function createTree(keys, values, comparator, presort, noDuplicates) {
                    return new SplayTree(comparator,noDuplicates).load(keys, values, presort);
                }
                ;

                Object.defineProperties(SplayTree.prototype, prototypeAccessors);

                function loadRecursive(parent, keys, values, start, end) {
                    var size = end - start;
                    if (size > 0) {
                        var middle = start + Math.floor(size / 2);
                        var key = keys[middle];
                        var data = values[middle];
                        var node = {
                            key: key,
                            data: data,
                            parent: parent
                        };
                        node.left = loadRecursive(node, keys, values, start, middle);
                        node.right = loadRecursive(node, keys, values, middle + 1, end);
                        return node;
                    }
                    return null;
                }

                function sort(keys, values, left, right, compare) {
                    if (left >= right) {
                        return;
                    }

                    var pivot = keys[(left + right) >> 1];
                    var i = left - 1;
                    var j = right + 1;

                    while (true) {
                        do {
                            i++;
                        } while (compare(keys[i], pivot) < 0);
                        do {
                            j--;
                        } while (compare(keys[j], pivot) > 0);
                        if (i >= j) {
                            break;
                        }

                        var tmp = keys[i];
                        keys[i] = keys[j];
                        keys[j] = tmp;

                        tmp = values[i];
                        values[i] = values[j];
                        values[j] = tmp;
                    }

                    sort(keys, values, left, j, compare);
                    sort(keys, values, j + 1, right, compare);
                }

                var NORMAL = 0;
                var NON_CONTRIBUTING = 1;
                var SAME_TRANSITION = 2;
                var DIFFERENT_TRANSITION = 3;

                var INTERSECTION = 0;
                var UNION = 1;
                var DIFFERENCE = 2;
                var XOR = 3;

                /**
   * @param  {SweepEvent} event
   * @param  {SweepEvent} prev
   * @param  {Operation} operation
   */
                function computeFields(event, prev, operation) {
                    // compute inOut and otherInOut fields
                    if (prev === null) {
                        event.inOut = false;
                        event.otherInOut = true;

                        // previous line segment in sweepline belongs to the same polygon
                    } else {
                        if (event.isSubject === prev.isSubject) {
                            event.inOut = !prev.inOut;
                            event.otherInOut = prev.otherInOut;

                            // previous line segment in sweepline belongs to the clipping polygon
                        } else {
                            event.inOut = !prev.otherInOut;
                            event.otherInOut = prev.isVertical() ? !prev.inOut : prev.inOut;
                        }

                        // compute prevInResult field
                        if (prev) {
                            event.prevInResult = (!inResult(prev, operation) || prev.isVertical()) ? prev.prevInResult : prev;
                        }
                    }

                    // check if the line segment belongs to the Boolean operation
                    event.inResult = inResult(event, operation);
                }

                /* eslint-disable indent */
                function inResult(event, operation) {
                    switch (event.type) {
                    case NORMAL:
                        switch (operation) {
                        case INTERSECTION:
                            return !event.otherInOut;
                        case UNION:
                            return event.otherInOut;
                        case DIFFERENCE:
                            // return (event.isSubject && !event.otherInOut) ||
                            //         (!event.isSubject && event.otherInOut);
                            return (event.isSubject && event.otherInOut) || (!event.isSubject && !event.otherInOut);
                        case XOR:
                            return true;
                        }
                        break;
                    case SAME_TRANSITION:
                        return operation === INTERSECTION || operation === UNION;
                    case DIFFERENT_TRANSITION:
                        return operation === DIFFERENCE;
                    case NON_CONTRIBUTING:
                        return false;
                    }
                    return false;
                }
                /* eslint-enable indent */

                var SweepEvent = function SweepEvent(point, left, otherEvent, isSubject, edgeType) {

                    /**
     * Is left endpoint?
     * @type {Boolean}
     */
                    this.left = left;

                    /**
     * @type {Array.<Number>}
     */
                    this.point = point;

                    /**
     * Other edge reference
     * @type {SweepEvent}
     */
                    this.otherEvent = otherEvent;

                    /**
     * Belongs to source or clipping polygon
     * @type {Boolean}
     */
                    this.isSubject = isSubject;

                    /**
     * Edge contribution type
     * @type {Number}
     */
                    this.type = edgeType || NORMAL;

                    /**
     * In-out transition for the sweepline crossing polygon
     * @type {Boolean}
     */
                    this.inOut = false;

                    /**
     * @type {Boolean}
     */
                    this.otherInOut = false;

                    /**
     * Previous event in result?
     * @type {SweepEvent}
     */
                    this.prevInResult = null;

                    /**
     * Does event belong to result?
     * @type {Boolean}
     */
                    this.inResult = false;

                    // connection step

                    /**
     * @type {Boolean}
     */
                    this.resultInOut = false;

                    this.isExteriorRing = true;
                };

                /**
   * @param{Array.<Number>}p
   * @return {Boolean}
   */
                SweepEvent.prototype.isBelow = function isBelow(p) {
                    var p0 = this.point
                      , p1 = this.otherEvent.point;
                    return this.left ? (p0[0] - p[0]) * (p1[1] - p[1]) - (p1[0] - p[0]) * (p0[1] - p[1]) > 0 // signedArea(this.point, this.otherEvent.point, p) > 0 :
                    : (p1[0] - p[0]) * (p0[1] - p[1]) - (p0[0] - p[0]) * (p1[1] - p[1]) > 0;
                    //signedArea(this.otherEvent.point, this.point, p) > 0;
                }
                ;

                /**
   * @param{Array.<Number>}p
   * @return {Boolean}
   */
                SweepEvent.prototype.isAbove = function isAbove(p) {
                    return !this.isBelow(p);
                }
                ;

                /**
   * @return {Boolean}
   */
                SweepEvent.prototype.isVertical = function isVertical() {
                    return this.point[0] === this.otherEvent.point[0];
                }
                ;

                SweepEvent.prototype.clone = function clone() {
                    var copy = new SweepEvent(this.point,this.left,this.otherEvent,this.isSubject,this.type);

                    copy.inResult = this.inResult;
                    copy.prevInResult = this.prevInResult;
                    copy.isExteriorRing = this.isExteriorRing;
                    copy.inOut = this.inOut;
                    copy.otherInOut = this.otherInOut;

                    return copy;
                }
                ;

                function equals(p1, p2) {
                    if (p1[0] === p2[0]) {
                        if (p1[1] === p2[1]) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                }

                // const EPSILON = 1e-9;
                // const abs = Math.abs;
                // TODO https://github.com/w8r/martinez/issues/6#issuecomment-262847164
                // Precision problem.
                //
                // module.exports = function equals(p1, p2) {
                //   return abs(p1[0] - p2[0]) <= EPSILON && abs(p1[1] - p2[1]) <= EPSILON;
                // };

                /**
   * Signed area of the triangle (p0, p1, p2)
   * @param  {Array.<Number>} p0
   * @param  {Array.<Number>} p1
   * @param  {Array.<Number>} p2
   * @return {Number}
   */
                function signedArea(p0, p1, p2) {
                    return (p0[0] - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (p0[1] - p2[1]);
                }

                /**
   * @param  {SweepEvent} e1
   * @param  {SweepEvent} e2
   * @return {Number}
   */
                function compareEvents(e1, e2) {
                    var p1 = e1.point;
                    var p2 = e2.point;

                    // Different x-coordinate
                    if (p1[0] > p2[0]) {
                        return 1;
                    }
                    if (p1[0] < p2[0]) {
                        return -1;
                    }

                    // Different points, but same x-coordinate
                    // Event with lower y-coordinate is processed first
                    if (p1[1] !== p2[1]) {
                        return p1[1] > p2[1] ? 1 : -1;
                    }

                    return specialCases(e1, e2, p1, p2);
                }

                /* eslint-disable no-unused-vars */
                function specialCases(e1, e2, p1, p2) {
                    // Same coordinates, but one is a left endpoint and the other is
                    // a right endpoint. The right endpoint is processed first
                    if (e1.left !== e2.left) {
                        return e1.left ? 1 : -1;
                    }

                    // const p2 = e1.otherEvent.point, p3 = e2.otherEvent.point;
                    // const sa = (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
                    // Same coordinates, both events
                    // are left endpoints or right endpoints.
                    // not collinear
                    if (signedArea(p1, e1.otherEvent.point, e2.otherEvent.point) !== 0) {
                        // the event associate to the bottom segment is processed first
                        return (!e1.isBelow(e2.otherEvent.point)) ? 1 : -1;
                    }

                    return (!e1.isSubject && e2.isSubject) ? 1 : -1;
                }
                /* eslint-enable no-unused-vars */

                /**
   * @param  {SweepEvent} se
   * @param  {Array.<Number>} p
   * @param  {Queue} queue
   * @return {Queue}
   */
                function divideSegment(se, p, queue) {
                    var r = new SweepEvent(p,false,se,se.isSubject);
                    var l = new SweepEvent(p,true,se.otherEvent,se.isSubject);

                    /* eslint-disable no-console */
                    if (equals(se.point, se.otherEvent.point)) {

                        console.warn('what is that, a collapsed segment?', se);
                    }
                    /* eslint-enable no-console */

                    r.contourId = l.contourId = se.contourId;

                    // avoid a rounding error. The left event would be processed after the right event
                    if (compareEvents(l, se.otherEvent) > 0) {
                        se.otherEvent.left = true;
                        l.left = false;
                    }

                    // avoid a rounding error. The left event would be processed after the right event
                    // if (compareEvents(se, r) > 0) {}

                    se.otherEvent.otherEvent = l;
                    se.otherEvent = r;

                    queue.push(l);
                    queue.push(r);

                    return queue;
                }

                //const EPS = 1e-9;

                /**
   * Finds the magnitude of the cross product of two vectors (if we pretend
   * they're in three dimensions)
   *
   * @param {Object} a First vector
   * @param {Object} b Second vector
   * @private
   * @returns {Number} The magnitude of the cross product
   */
                function crossProduct(a, b) {
                    return (a[0] * b[1]) - (a[1] * b[0]);
                }

                /**
   * Finds the dot product of two vectors.
   *
   * @param {Object} a First vector
   * @param {Object} b Second vector
   * @private
   * @returns {Number} The dot product
   */
                function dotProduct(a, b) {
                    return (a[0] * b[0]) + (a[1] * b[1]);
                }

                /**
   * Finds the intersection (if any) between two line segments a and b, given the
   * line segments' end points a1, a2 and b1, b2.
   *
   * This algorithm is based on Schneider and Eberly.
   * http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf
   * Page 244.
   *
   * @param {Array.<Number>} a1 point of first line
   * @param {Array.<Number>} a2 point of first line
   * @param {Array.<Number>} b1 point of second line
   * @param {Array.<Number>} b2 point of second line
   * @param {Boolean=}       noEndpointTouch whether to skip single touchpoints
   *                                         (meaning connected segments) as
   *                                         intersections
   * @returns {Array.<Array.<Number>>|Null} If the lines intersect, the point of
   * intersection. If they overlap, the two end points of the overlapping segment.
   * Otherwise, null.
   */
                function intersection(a1, a2, b1, b2, noEndpointTouch) {
                    // The algorithm expects our lines in the form P + sd, where P is a point,
                    // s is on the interval [0, 1], and d is a vector.
                    // We are passed two points. P can be the first point of each pair. The
                    // vector, then, could be thought of as the distance (in x and y components)
                    // from the first point to the second point.
                    // So first, let's make our vectors:
                    var va = [a2[0] - a1[0], a2[1] - a1[1]];
                    var vb = [b2[0] - b1[0], b2[1] - b1[1]];
                    // We also define a function to convert back to regular point form:

                    /* eslint-disable arrow-body-style */

                    function toPoint(p, s, d) {
                        return [p[0] + s * d[0], p[1] + s * d[1]];
                    }

                    /* eslint-enable arrow-body-style */

                    // The rest is pretty much a straight port of the algorithm.
                    var e = [b1[0] - a1[0], b1[1] - a1[1]];
                    var kross = crossProduct(va, vb);
                    var sqrKross = kross * kross;
                    var sqrLenA = dotProduct(va, va);
                    //const sqrLenB  = dotProduct(vb, vb);

                    // Check for line intersection. This works because of the properties of the
                    // cross product -- specifically, two vectors are parallel if and only if the
                    // cross product is the 0 vector. The full calculation involves relative error
                    // to account for possible very small line segments. See Schneider & Eberly
                    // for details.
                    if (sqrKross > 0 /* EPS * sqrLenB * sqLenA */
                    ) {
                        // If they're not parallel, then (because these are line segments) they
                        // still might not actually intersect. This code checks that the
                        // intersection point of the lines is actually on both line segments.
                        var s = crossProduct(e, vb) / kross;
                        if (s < 0 || s > 1) {
                            // not on line segment a
                            return null;
                        }
                        var t = crossProduct(e, va) / kross;
                        if (t < 0 || t > 1) {
                            // not on line segment b
                            return null;
                        }
                        if (s === 0 || s === 1) {
                            // on an endpoint of line segment a
                            return noEndpointTouch ? null : [toPoint(a1, s, va)];
                        }
                        if (t === 0 || t === 1) {
                            // on an endpoint of line segment b
                            return noEndpointTouch ? null : [toPoint(b1, t, vb)];
                        }
                        return [toPoint(a1, s, va)];
                    }

                    // If we've reached this point, then the lines are either parallel or the
                    // same, but the segments could overlap partially or fully, or not at all.
                    // So we need to find the overlap, if any. To do that, we can use e, which is
                    // the (vector) difference between the two initial points. If this is parallel
                    // with the line itself, then the two lines are the same line, and there will
                    // be overlap.
                    //const sqrLenE = dotProduct(e, e);
                    kross = crossProduct(e, va);
                    sqrKross = kross * kross;

                    if (sqrKross > 0 /* EPS * sqLenB * sqLenE */
                    ) {
                        // Lines are just parallel, not the same. No overlap.
                        return null;
                    }

                    var sa = dotProduct(va, e) / sqrLenA;
                    var sb = sa + dotProduct(va, vb) / sqrLenA;
                    var smin = Math.min(sa, sb);
                    var smax = Math.max(sa, sb);

                    // this is, essentially, the FindIntersection acting on floats from
                    // Schneider & Eberly, just inlined into this function.
                    if (smin <= 1 && smax >= 0) {

                        // overlap on an end point
                        if (smin === 1) {
                            return noEndpointTouch ? null : [toPoint(a1, smin > 0 ? smin : 0, va)];
                        }

                        if (smax === 0) {
                            return noEndpointTouch ? null : [toPoint(a1, smax < 1 ? smax : 1, va)];
                        }

                        if (noEndpointTouch && smin === 0 && smax === 1) {
                            return null;
                        }

                        // There's overlap on a segment -- two points of intersection. Return both.
                        return [toPoint(a1, smin > 0 ? smin : 0, va), toPoint(a1, smax < 1 ? smax : 1, va)];
                    }

                    return null;
                }

                /**
   * @param  {SweepEvent} se1
   * @param  {SweepEvent} se2
   * @param  {Queue}      queue
   * @return {Number}
   */
                function possibleIntersection(se1, se2, queue) {
                    // that disallows self-intersecting polygons,
                    // did cost us half a day, so I'll leave it
                    // out of respect
                    // if (se1.isSubject === se2.isSubject) return;
                    var inter = intersection(se1.point, se1.otherEvent.point, se2.point, se2.otherEvent.point);

                    var nintersections = inter ? inter.length : 0;
                    if (nintersections === 0) {
                        return 0;
                    }
                    // no intersection

                    // the line segments intersect at an endpoint of both line segments
                    if ((nintersections === 1) && (equals(se1.point, se2.point) || equals(se1.otherEvent.point, se2.otherEvent.point))) {
                        return 0;
                    }

                    if (nintersections === 2 && se1.isSubject === se2.isSubject) {
                        // if(se1.contourId === se2.contourId){
                        // console.warn('Edges of the same polygon overlap',
                        //   se1.point, se1.otherEvent.point, se2.point, se2.otherEvent.point);
                        // }
                        //throw new Error('Edges of the same polygon overlap');
                        return 0;
                    }

                    // The line segments associated to se1 and se2 intersect
                    if (nintersections === 1) {

                        // if the intersection point is not an endpoint of se1
                        if (!equals(se1.point, inter[0]) && !equals(se1.otherEvent.point, inter[0])) {
                            divideSegment(se1, inter[0], queue);
                        }

                        // if the intersection point is not an endpoint of se2
                        if (!equals(se2.point, inter[0]) && !equals(se2.otherEvent.point, inter[0])) {
                            divideSegment(se2, inter[0], queue);
                        }
                        return 1;
                    }

                    // The line segments associated to se1 and se2 overlap
                    var events = [];
                    var leftCoincide = false;
                    var rightCoincide = false;

                    if (equals(se1.point, se2.point)) {
                        leftCoincide = true;
                        // linked
                    } else if (compareEvents(se1, se2) === 1) {
                        events.push(se2, se1);
                    } else {
                        events.push(se1, se2);
                    }

                    if (equals(se1.otherEvent.point, se2.otherEvent.point)) {
                        rightCoincide = true;
                    } else if (compareEvents(se1.otherEvent, se2.otherEvent) === 1) {
                        events.push(se2.otherEvent, se1.otherEvent);
                    } else {
                        events.push(se1.otherEvent, se2.otherEvent);
                    }

                    if ((leftCoincide && rightCoincide) || leftCoincide) {
                        // both line segments are equal or share the left endpoint
                        se2.type = NON_CONTRIBUTING;
                        se1.type = (se2.inOut === se1.inOut) ? SAME_TRANSITION : DIFFERENT_TRANSITION;

                        if (leftCoincide && !rightCoincide) {
                            // honestly no idea, but changing events selection from [2, 1]
                            // to [0, 1] fixes the overlapping self-intersecting polygons issue
                            divideSegment(events[1].otherEvent, events[0].point, queue);
                        }
                        return 2;
                    }

                    // the line segments share the right endpoint
                    if (rightCoincide) {
                        divideSegment(events[0], events[1].point, queue);
                        return 3;
                    }

                    // no line segment includes totally the other one
                    if (events[0] !== events[3].otherEvent) {
                        divideSegment(events[0], events[1].point, queue);
                        divideSegment(events[1], events[2].point, queue);
                        return 3;
                    }

                    // one line segment includes the other one
                    divideSegment(events[0], events[1].point, queue);
                    divideSegment(events[3].otherEvent, events[2].point, queue);

                    return 3;
                }

                /**
   * @param  {SweepEvent} le1
   * @param  {SweepEvent} le2
   * @return {Number}
   */
                function compareSegments(le1, le2) {
                    if (le1 === le2) {
                        return 0;
                    }

                    // Segments are not collinear
                    if (signedArea(le1.point, le1.otherEvent.point, le2.point) !== 0 || signedArea(le1.point, le1.otherEvent.point, le2.otherEvent.point) !== 0) {

                        // If they share their left endpoint use the right endpoint to sort
                        if (equals(le1.point, le2.point)) {
                            return le1.isBelow(le2.otherEvent.point) ? -1 : 1;
                        }

                        // Different left endpoint: use the left endpoint to sort
                        if (le1.point[0] === le2.point[0]) {
                            return le1.point[1] < le2.point[1] ? -1 : 1;
                        }

                        // has the line segment associated to e1 been inserted
                        // into S after the line segment associated to e2 ?
                        if (compareEvents(le1, le2) === 1) {
                            return le2.isAbove(le1.point) ? -1 : 1;
                        }

                        // The line segment associated to e2 has been inserted
                        // into S after the line segment associated to e1
                        return le1.isBelow(le2.point) ? -1 : 1;
                    }

                    if (le1.isSubject === le2.isSubject) {
                        // same polygon
                        var p1 = le1.point
                          , p2 = le2.point;
                        if (p1[0] === p2[0] && p1[1] === p2[1]/*equals(le1.point, le2.point)*/
                        ) {
                            p1 = le1.otherEvent.point;
                            p2 = le2.otherEvent.point;
                            if (p1[0] === p2[0] && p1[1] === p2[1]) {
                                return 0;
                            } else {
                                return le1.contourId > le2.contourId ? 1 : -1;
                            }
                        }
                    } else {
                        // Segments are collinear, but belong to separate polygons
                        return le1.isSubject ? -1 : 1;
                    }

                    return compareEvents(le1, le2) === 1 ? 1 : -1;
                }

                function subdivide(eventQueue, subject, clipping, sbbox, cbbox, operation) {
                    var sweepLine = new SplayTree(compareSegments);
                    var sortedEvents = [];

                    var rightbound = Math.min(sbbox[2], cbbox[2]);

                    var prev, next, begin;

                    while (eventQueue.length !== 0) {
                        var event = eventQueue.pop();
                        sortedEvents.push(event);

                        // optimization by bboxes for intersection and difference goes here
                        if ((operation === INTERSECTION && event.point[0] > rightbound) || (operation === DIFFERENCE && event.point[0] > sbbox[2])) {
                            break;
                        }

                        if (event.left) {
                            next = prev = sweepLine.insert(event);
                            begin = sweepLine.minNode();

                            if (prev !== begin) {
                                prev = sweepLine.prev(prev);
                            } else {
                                prev = null;
                            }

                            next = sweepLine.next(next);

                            var prevEvent = prev ? prev.key : null;
                            var prevprevEvent = (void 0);
                            computeFields(event, prevEvent, operation);
                            if (next) {
                                if (possibleIntersection(event, next.key, eventQueue) === 2) {
                                    computeFields(event, prevEvent, operation);
                                    computeFields(event, next.key, operation);
                                }
                            }

                            if (prev) {
                                if (possibleIntersection(prev.key, event, eventQueue) === 2) {
                                    var prevprev = prev;
                                    if (prevprev !== begin) {
                                        prevprev = sweepLine.prev(prevprev);
                                    } else {
                                        prevprev = null;
                                    }

                                    prevprevEvent = prevprev ? prevprev.key : null;
                                    computeFields(prevEvent, prevprevEvent, operation);
                                    computeFields(event, prevEvent, operation);
                                }
                            }
                        } else {
                            event = event.otherEvent;
                            next = prev = sweepLine.find(event);

                            if (prev && next) {

                                if (prev !== begin) {
                                    prev = sweepLine.prev(prev);
                                } else {
                                    prev = null;
                                }

                                next = sweepLine.next(next);
                                sweepLine.remove(event);

                                if (next && prev) {
                                    possibleIntersection(prev.key, next.key, eventQueue);
                                }
                            }
                        }
                    }
                    return sortedEvents;
                }

                /**
   * @param  {Array.<SweepEvent>} sortedEvents
   * @return {Array.<SweepEvent>}
   */
                function orderEvents(sortedEvents) {
                    var event, i, len, tmp;
                    var resultEvents = [];
                    for (i = 0,
                    len = sortedEvents.length; i < len; i++) {
                        event = sortedEvents[i];
                        if ((event.left && event.inResult) || (!event.left && event.otherEvent.inResult)) {
                            resultEvents.push(event);
                        }
                    }
                    // Due to overlapping edges the resultEvents array can be not wholly sorted
                    var sorted = false;
                    while (!sorted) {
                        sorted = true;
                        for (i = 0,
                        len = resultEvents.length; i < len; i++) {
                            if ((i + 1) < len && compareEvents(resultEvents[i], resultEvents[i + 1]) === 1) {
                                tmp = resultEvents[i];
                                resultEvents[i] = resultEvents[i + 1];
                                resultEvents[i + 1] = tmp;
                                sorted = false;
                            }
                        }
                    }

                    for (i = 0,
                    len = resultEvents.length; i < len; i++) {
                        event = resultEvents[i];
                        event.pos = i;
                    }

                    // imagine, the right event is found in the beginning of the queue,
                    // when his left counterpart is not marked yet
                    for (i = 0,
                    len = resultEvents.length; i < len; i++) {
                        event = resultEvents[i];
                        if (!event.left) {
                            tmp = event.pos;
                            event.pos = event.otherEvent.pos;
                            event.otherEvent.pos = tmp;
                        }
                    }

                    return resultEvents;
                }

                /**
   * @param  {Number} pos
   * @param  {Array.<SweepEvent>} resultEvents
   * @param  {Object>}    processed
   * @return {Number}
   */
                function nextPos(pos, resultEvents, processed, origIndex) {
                    var newPos = pos + 1;
                    var length = resultEvents.length;
                    if (newPos > length - 1) {
                        return pos - 1;
                    }
                    var p = resultEvents[pos].point;
                    var p1 = resultEvents[newPos].point;

                    // while in range and not the current one by value
                    while (newPos < length && p1[0] === p[0] && p1[1] === p[1]) {
                        if (!processed[newPos]) {
                            return newPos;
                        } else {
                            newPos++;
                        }
                        p1 = resultEvents[newPos].point;
                    }

                    newPos = pos - 1;

                    while (processed[newPos] && newPos >= origIndex) {
                        newPos--;
                    }
                    return newPos;
                }

                /**
   * @param  {Array.<SweepEvent>} sortedEvents
   * @return {Array.<*>} polygons
   */
                function connectEdges(sortedEvents, operation) {
                    var i, len;
                    var resultEvents = orderEvents(sortedEvents);

                    // "false"-filled array
                    var processed = {};
                    var result = [];
                    var event;

                    for (i = 0,
                    len = resultEvents.length; i < len; i++) {
                        if (processed[i]) {
                            continue;
                        }
                        var contour = [[]];

                        if (!resultEvents[i].isExteriorRing) {
                            if (operation === DIFFERENCE && !resultEvents[i].isSubject && result.length === 0) {
                                result.push(contour);
                            } else if (result.length === 0) {
                                result.push([[contour]]);
                            } else {
                                result[result.length - 1].push(contour[0]);
                            }
                        } else if (operation === DIFFERENCE && !resultEvents[i].isSubject && result.length > 1) {
                            result[result.length - 1].push(contour[0]);
                        } else {
                            result.push(contour);
                        }

                        var ringId = result.length - 1;
                        var pos = i;

                        var initial = resultEvents[i].point;
                        contour[0].push(initial);

                        while (pos >= i) {
                            event = resultEvents[pos];
                            processed[pos] = true;

                            if (event.left) {
                                event.resultInOut = false;
                                event.contourId = ringId;
                            } else {
                                event.otherEvent.resultInOut = true;
                                event.otherEvent.contourId = ringId;
                            }

                            pos = event.pos;
                            processed[pos] = true;
                            contour[0].push(resultEvents[pos].point);
                            pos = nextPos(pos, resultEvents, processed, i);
                        }

                        pos = pos === -1 ? i : pos;

                        event = resultEvents[pos];
                        processed[pos] = processed[event.pos] = true;
                        event.otherEvent.resultInOut = true;
                        event.otherEvent.contourId = ringId;
                    }

                    // Handle if the result is a polygon (eg not multipoly)
                    // Commented it again, let's see what do we mean by that
                    // if (result.length === 1) result = result[0];
                    return result;
                }

                var tinyqueue = TinyQueue;
                var default_1 = TinyQueue;

                function TinyQueue(data, compare) {
                    var this$1 = this;

                    if (!(this instanceof TinyQueue)) {
                        return new TinyQueue(data,compare);
                    }

                    this.data = data || [];
                    this.length = this.data.length;
                    this.compare = compare || defaultCompare;

                    if (this.length > 0) {
                        for (var i = (this.length >> 1) - 1; i >= 0; i--) {
                            this$1._down(i);
                        }
                    }
                }

                function defaultCompare(a, b) {
                    return a < b ? -1 : a > b ? 1 : 0;
                }

                TinyQueue.prototype = {

                    push: function(item) {
                        this.data.push(item);
                        this.length++;
                        this._up(this.length - 1);
                    },

                    pop: function() {
                        if (this.length === 0) {
                            return undefined;
                        }

                        var top = this.data[0];
                        this.length--;

                        if (this.length > 0) {
                            this.data[0] = this.data[this.length];
                            this._down(0);
                        }
                        this.data.pop();

                        return top;
                    },

                    peek: function() {
                        return this.data[0];
                    },

                    _up: function(pos) {
                        var data = this.data;
                        var compare = this.compare;
                        var item = data[pos];

                        while (pos > 0) {
                            var parent = (pos - 1) >> 1;
                            var current = data[parent];
                            if (compare(item, current) >= 0) {
                                break;
                            }
                            data[pos] = current;
                            pos = parent;
                        }

                        data[pos] = item;
                    },

                    _down: function(pos) {
                        var this$1 = this;

                        var data = this.data;
                        var compare = this.compare;
                        var halfLength = this.length >> 1;
                        var item = data[pos];

                        while (pos < halfLength) {
                            var left = (pos << 1) + 1;
                            var right = left + 1;
                            var best = data[left];

                            if (right < this$1.length && compare(data[right], best) < 0) {
                                left = right;
                                best = data[right];
                            }
                            if (compare(best, item) >= 0) {
                                break;
                            }

                            data[pos] = best;
                            pos = left;
                        }

                        data[pos] = item;
                    }
                };
                tinyqueue.default = default_1;

                var max = Math.max;
                var min = Math.min;

                var contourId = 0;

                function processPolygon(contourOrHole, isSubject, depth, Q, bbox, isExteriorRing) {
                    var i, len, s1, s2, e1, e2;
                    for (i = 0,
                    len = contourOrHole.length - 1; i < len; i++) {
                        s1 = contourOrHole[i];
                        s2 = contourOrHole[i + 1];
                        e1 = new SweepEvent(s1,false,undefined,isSubject);
                        e2 = new SweepEvent(s2,false,e1,isSubject);
                        e1.otherEvent = e2;

                        if (s1[0] === s2[0] && s1[1] === s2[1]) {
                            continue;
                            // skip collapsed edges, or it breaks
                        }

                        e1.contourId = e2.contourId = depth;
                        if (!isExteriorRing) {
                            e1.isExteriorRing = false;
                            e2.isExteriorRing = false;
                        }
                        if (compareEvents(e1, e2) > 0) {
                            e2.left = true;
                        } else {
                            e1.left = true;
                        }

                        var x = s1[0]
                          , y = s1[1];
                        bbox[0] = min(bbox[0], x);
                        bbox[1] = min(bbox[1], y);
                        bbox[2] = max(bbox[2], x);
                        bbox[3] = max(bbox[3], y);

                        // Pushing it so the queue is sorted from left to right,
                        // with object on the left having the highest priority.
                        Q.push(e1);
                        Q.push(e2);
                    }
                }

                function fillQueue(subject, clipping, sbbox, cbbox, operation) {
                    var eventQueue = new tinyqueue(null,compareEvents);
                    var polygonSet, isExteriorRing, i, ii, j, jj;
                    //, k, kk;

                    for (i = 0,
                    ii = subject.length; i < ii; i++) {
                        polygonSet = subject[i];
                        for (j = 0,
                        jj = polygonSet.length; j < jj; j++) {
                            isExteriorRing = j === 0;
                            if (isExteriorRing) {
                                contourId++;
                            }
                            processPolygon(polygonSet[j], true, contourId, eventQueue, sbbox, isExteriorRing);
                        }
                    }

                    for (i = 0,
                    ii = clipping.length; i < ii; i++) {
                        polygonSet = clipping[i];
                        for (j = 0,
                        jj = polygonSet.length; j < jj; j++) {
                            isExteriorRing = j === 0;
                            if (operation === DIFFERENCE) {
                                isExteriorRing = false;
                            }
                            if (isExteriorRing) {
                                contourId++;
                            }
                            processPolygon(polygonSet[j], false, contourId, eventQueue, cbbox, isExteriorRing);
                        }
                    }

                    return eventQueue;
                }

                var EMPTY = [];

                function trivialOperation(subject, clipping, operation) {
                    var result = null;
                    if (subject.length * clipping.length === 0) {
                        if (operation === INTERSECTION) {
                            result = EMPTY;
                        } else if (operation === DIFFERENCE) {
                            result = subject;
                        } else if (operation === UNION || operation === XOR) {
                            result = (subject.length === 0) ? clipping : subject;
                        }
                    }
                    return result;
                }

                function compareBBoxes(subject, clipping, sbbox, cbbox, operation) {
                    var result = null;
                    if (sbbox[0] > cbbox[2] || cbbox[0] > sbbox[2] || sbbox[1] > cbbox[3] || cbbox[1] > sbbox[3]) {
                        if (operation === INTERSECTION) {
                            result = EMPTY;
                        } else if (operation === DIFFERENCE) {
                            result = subject;
                        } else if (operation === UNION || operation === XOR) {
                            result = subject.concat(clipping);
                        }
                    }
                    return result;
                }

                function boolean(subject, clipping, operation) {
                    if (typeof subject[0][0][0] === 'number') {
                        subject = [subject];
                    }
                    if (typeof clipping[0][0][0] === 'number') {
                        clipping = [clipping];
                    }
                    var trivial = trivialOperation(subject, clipping, operation);
                    if (trivial) {
                        return trivial === EMPTY ? null : trivial;
                    }
                    var sbbox = [Infinity, Infinity, -Infinity, -Infinity];
                    var cbbox = [Infinity, Infinity, -Infinity, -Infinity];

                    //console.time('fill queue');
                    var eventQueue = fillQueue(subject, clipping, sbbox, cbbox, operation);
                    //console.timeEnd('fill queue');

                    trivial = compareBBoxes(subject, clipping, sbbox, cbbox, operation);
                    if (trivial) {
                        return trivial === EMPTY ? null : trivial;
                    }
                    //console.time('subdivide edges');
                    var sortedEvents = subdivide(eventQueue, subject, clipping, sbbox, cbbox, operation);
                    //console.timeEnd('subdivide edges');

                    //console.time('connect vertices');
                    var result = connectEdges(sortedEvents, operation);
                    //console.timeEnd('connect vertices');
                    return result;
                }

                function union(subject, clipping) {
                    return boolean(subject, clipping, UNION);
                }

                function diff(subject, clipping) {
                    return boolean(subject, clipping, DIFFERENCE);
                }

                function xor(subject, clipping) {
                    return boolean(subject, clipping, XOR);
                }

                function intersection$1(subject, clipping) {
                    return boolean(subject, clipping, INTERSECTION);
                }

                /**
   * @enum {Number}
   */
                var operations = {
                    UNION: UNION,
                    DIFFERENCE: DIFFERENCE,
                    INTERSECTION: INTERSECTION,
                    XOR: XOR
                };

                exports.union = union;
                exports.diff = diff;
                exports.xor = xor;
                exports.intersection = intersection$1;
                exports.operations = operations;

                Object.defineProperty(exports, '__esModule', {
                    value: true
                });

            }
            )));

        }
        , {}],
        23: [function(require, module, exports) {
            (function(global, factory) {
                typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.quickselect = factory());
            }(this, (function() {
                'use strict';

                function quickselect(arr, k, left, right, compare) {
                    quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
                }

                function quickselectStep(arr, k, left, right, compare) {

                    while (right > left) {
                        if (right - left > 600) {
                            var n = right - left + 1;
                            var m = k - left + 1;
                            var z = Math.log(n);
                            var s = 0.5 * Math.exp(2 * z / 3);
                            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                            quickselectStep(arr, k, newLeft, newRight, compare);
                        }

                        var t = arr[k];
                        var i = left;
                        var j = right;

                        swap(arr, left, k);
                        if (compare(arr[right], t) > 0)
                            swap(arr, left, right);

                        while (i < j) {
                            swap(arr, i, j);
                            i++;
                            j--;
                            while (compare(arr[i], t) < 0)
                                i++;
                            while (compare(arr[j], t) > 0)
                                j--;
                        }

                        if (compare(arr[left], t) === 0)
                            swap(arr, left, j);
                        else {
                            j++;
                            swap(arr, j, right);
                        }

                        if (j <= k)
                            left = j + 1;
                        if (k <= j)
                            right = j - 1;
                    }
                }

                function swap(arr, i, j) {
                    var tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                }

                function defaultCompare(a, b) {
                    return a < b ? -1 : a > b ? 1 : 0;
                }

                return quickselect;

            }
            )));

        }
        , {}],
        24: [function(require, module, exports) {
            'use strict';

            module.exports = rbush;
            module.exports.default = rbush;

            var quickselect = require('quickselect');

            function rbush(maxEntries, format) {
                if (!(this instanceof rbush))
                    return new rbush(maxEntries,format);

                // max entries in a node is 9 by default; min node fill is 40% for best performance
                this._maxEntries = Math.max(4, maxEntries || 9);
                this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

                if (format) {
                    this._initFormat(format);
                }

                this.clear();
            }

            rbush.prototype = {

                all: function() {
                    return this._all(this.data, []);
                },

                search: function(bbox) {

                    var node = this.data
                      , result = []
                      , toBBox = this.toBBox;

                    if (!intersects(bbox, node))
                        return result;

                    var nodesToSearch = [], i, len, child, childBBox;

                    while (node) {
                        for (i = 0,
                        len = node.children.length; i < len; i++) {

                            child = node.children[i];
                            childBBox = node.leaf ? toBBox(child) : child;

                            if (intersects(bbox, childBBox)) {
                                if (node.leaf)
                                    result.push(child);
                                else if (contains(bbox, childBBox))
                                    this._all(child, result);
                                else
                                    nodesToSearch.push(child);
                            }
                        }
                        node = nodesToSearch.pop();
                    }

                    return result;
                },

                collides: function(bbox) {

                    var node = this.data
                      , toBBox = this.toBBox;

                    if (!intersects(bbox, node))
                        return false;

                    var nodesToSearch = [], i, len, child, childBBox;

                    while (node) {
                        for (i = 0,
                        len = node.children.length; i < len; i++) {

                            child = node.children[i];
                            childBBox = node.leaf ? toBBox(child) : child;

                            if (intersects(bbox, childBBox)) {
                                if (node.leaf || contains(bbox, childBBox))
                                    return true;
                                nodesToSearch.push(child);
                            }
                        }
                        node = nodesToSearch.pop();
                    }

                    return false;
                },

                load: function(data) {
                    if (!(data && data.length))
                        return this;

                    if (data.length < this._minEntries) {
                        for (var i = 0, len = data.length; i < len; i++) {
                            this.insert(data[i]);
                        }
                        return this;
                    }

                    // recursively build the tree with the given data from scratch using OMT algorithm
                    var node = this._build(data.slice(), 0, data.length - 1, 0);

                    if (!this.data.children.length) {
                        // save as is if tree is empty
                        this.data = node;

                    } else if (this.data.height === node.height) {
                        // split root if trees have the same height
                        this._splitRoot(this.data, node);

                    } else {
                        if (this.data.height < node.height) {
                            // swap trees if inserted one is bigger
                            var tmpNode = this.data;
                            this.data = node;
                            node = tmpNode;
                        }

                        // insert the small tree into the large tree at appropriate level
                        this._insert(node, this.data.height - node.height - 1, true);
                    }

                    return this;
                },

                insert: function(item) {
                    if (item)
                        this._insert(item, this.data.height - 1);
                    return this;
                },

                clear: function() {
                    this.data = createNode([]);
                    return this;
                },

                remove: function(item, equalsFn) {
                    if (!item)
                        return this;

                    var node = this.data, bbox = this.toBBox(item), path = [], indexes = [], i, parent, index, goingUp;

                    // depth-first iterative tree traversal
                    while (node || path.length) {

                        if (!node) {
                            // go up
                            node = path.pop();
                            parent = path[path.length - 1];
                            i = indexes.pop();
                            goingUp = true;
                        }

                        if (node.leaf) {
                            // check current node
                            index = findItem(item, node.children, equalsFn);

                            if (index !== -1) {
                                // item found, remove the item and condense tree upwards
                                node.children.splice(index, 1);
                                path.push(node);
                                this._condense(path);
                                return this;
                            }
                        }

                        if (!goingUp && !node.leaf && contains(node, bbox)) {
                            // go down
                            path.push(node);
                            indexes.push(i);
                            i = 0;
                            parent = node;
                            node = node.children[0];

                        } else if (parent) {
                            // go right
                            i++;
                            node = parent.children[i];
                            goingUp = false;

                        } else
                            node = null;
                        // nothing found
                    }

                    return this;
                },

                toBBox: function(item) {
                    return item;
                },

                compareMinX: compareNodeMinX,
                compareMinY: compareNodeMinY,

                toJSON: function() {
                    return this.data;
                },

                fromJSON: function(data) {
                    this.data = data;
                    return this;
                },

                _all: function(node, result) {
                    var nodesToSearch = [];
                    while (node) {
                        if (node.leaf)
                            result.push.apply(result, node.children);
                        else
                            nodesToSearch.push.apply(nodesToSearch, node.children);

                        node = nodesToSearch.pop();
                    }
                    return result;
                },

                _build: function(items, left, right, height) {

                    var N = right - left + 1, M = this._maxEntries, node;

                    if (N <= M) {
                        // reached leaf level; return leaf
                        node = createNode(items.slice(left, right + 1));
                        calcBBox(node, this.toBBox);
                        return node;
                    }

                    if (!height) {
                        // target height of the bulk-loaded tree
                        height = Math.ceil(Math.log(N) / Math.log(M));

                        // target number of root entries to maximize storage utilization
                        M = Math.ceil(N / Math.pow(M, height - 1));
                    }

                    node = createNode([]);
                    node.leaf = false;
                    node.height = height;

                    // split the items into M mostly square tiles

                    var N2 = Math.ceil(N / M), N1 = N2 * Math.ceil(Math.sqrt(M)), i, j, right2, right3;

                    multiSelect(items, left, right, N1, this.compareMinX);

                    for (i = left; i <= right; i += N1) {

                        right2 = Math.min(i + N1 - 1, right);

                        multiSelect(items, i, right2, N2, this.compareMinY);

                        for (j = i; j <= right2; j += N2) {

                            right3 = Math.min(j + N2 - 1, right2);

                            // pack each entry recursively
                            node.children.push(this._build(items, j, right3, height - 1));
                        }
                    }

                    calcBBox(node, this.toBBox);

                    return node;
                },

                _chooseSubtree: function(bbox, node, level, path) {

                    var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

                    while (true) {
                        path.push(node);

                        if (node.leaf || path.length - 1 === level)
                            break;

                        minArea = minEnlargement = Infinity;

                        for (i = 0,
                        len = node.children.length; i < len; i++) {
                            child = node.children[i];
                            area = bboxArea(child);
                            enlargement = enlargedArea(bbox, child) - area;

                            // choose entry with the least area enlargement
                            if (enlargement < minEnlargement) {
                                minEnlargement = enlargement;
                                minArea = area < minArea ? area : minArea;
                                targetNode = child;

                            } else if (enlargement === minEnlargement) {
                                // otherwise choose one with the smallest area
                                if (area < minArea) {
                                    minArea = area;
                                    targetNode = child;
                                }
                            }
                        }

                        node = targetNode || node.children[0];
                    }

                    return node;
                },

                _insert: function(item, level, isNode) {

                    var toBBox = this.toBBox
                      , bbox = isNode ? item : toBBox(item)
                      , insertPath = [];

                    // find the best node for accommodating the item, saving all nodes along the path too
                    var node = this._chooseSubtree(bbox, this.data, level, insertPath);

                    // put the item into the node
                    node.children.push(item);
                    extend(node, bbox);

                    // split on node overflow; propagate upwards if necessary
                    while (level >= 0) {
                        if (insertPath[level].children.length > this._maxEntries) {
                            this._split(insertPath, level);
                            level--;
                        } else
                            break;
                    }

                    // adjust bboxes along the insertion path
                    this._adjustParentBBoxes(bbox, insertPath, level);
                },

                // split overflowed node into two
                _split: function(insertPath, level) {

                    var node = insertPath[level]
                      , M = node.children.length
                      , m = this._minEntries;

                    this._chooseSplitAxis(node, m, M);

                    var splitIndex = this._chooseSplitIndex(node, m, M);

                    var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
                    newNode.height = node.height;
                    newNode.leaf = node.leaf;

                    calcBBox(node, this.toBBox);
                    calcBBox(newNode, this.toBBox);

                    if (level)
                        insertPath[level - 1].children.push(newNode);
                    else
                        this._splitRoot(node, newNode);
                },

                _splitRoot: function(node, newNode) {
                    // split root node
                    this.data = createNode([node, newNode]);
                    this.data.height = node.height + 1;
                    this.data.leaf = false;
                    calcBBox(this.data, this.toBBox);
                },

                _chooseSplitIndex: function(node, m, M) {

                    var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

                    minOverlap = minArea = Infinity;

                    for (i = m; i <= M - m; i++) {
                        bbox1 = distBBox(node, 0, i, this.toBBox);
                        bbox2 = distBBox(node, i, M, this.toBBox);

                        overlap = intersectionArea(bbox1, bbox2);
                        area = bboxArea(bbox1) + bboxArea(bbox2);

                        // choose distribution with minimum overlap
                        if (overlap < minOverlap) {
                            minOverlap = overlap;
                            index = i;

                            minArea = area < minArea ? area : minArea;

                        } else if (overlap === minOverlap) {
                            // otherwise choose distribution with minimum area
                            if (area < minArea) {
                                minArea = area;
                                index = i;
                            }
                        }
                    }

                    return index;
                },

                // sorts node children by the best axis for split
                _chooseSplitAxis: function(node, m, M) {

                    var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX
                      , compareMinY = node.leaf ? this.compareMinY : compareNodeMinY
                      , xMargin = this._allDistMargin(node, m, M, compareMinX)
                      , yMargin = this._allDistMargin(node, m, M, compareMinY);

                    // if total distributions margin value is minimal for x, sort by minX,
                    // otherwise it's already sorted by minY
                    if (xMargin < yMargin)
                        node.children.sort(compareMinX);
                },

                // total margin of all possible split distributions where each node is at least m full
                _allDistMargin: function(node, m, M, compare) {

                    node.children.sort(compare);

                    var toBBox = this.toBBox, leftBBox = distBBox(node, 0, m, toBBox), rightBBox = distBBox(node, M - m, M, toBBox), margin = bboxMargin(leftBBox) + bboxMargin(rightBBox), i, child;

                    for (i = m; i < M - m; i++) {
                        child = node.children[i];
                        extend(leftBBox, node.leaf ? toBBox(child) : child);
                        margin += bboxMargin(leftBBox);
                    }

                    for (i = M - m - 1; i >= m; i--) {
                        child = node.children[i];
                        extend(rightBBox, node.leaf ? toBBox(child) : child);
                        margin += bboxMargin(rightBBox);
                    }

                    return margin;
                },

                _adjustParentBBoxes: function(bbox, path, level) {
                    // adjust bboxes along the given tree path
                    for (var i = level; i >= 0; i--) {
                        extend(path[i], bbox);
                    }
                },

                _condense: function(path) {
                    // go through the path, removing empty nodes and updating bboxes
                    for (var i = path.length - 1, siblings; i >= 0; i--) {
                        if (path[i].children.length === 0) {
                            if (i > 0) {
                                siblings = path[i - 1].children;
                                siblings.splice(siblings.indexOf(path[i]), 1);

                            } else
                                this.clear();

                        } else
                            calcBBox(path[i], this.toBBox);
                    }
                },

                _initFormat: function(format) {
                    // data format (minX, minY, maxX, maxY accessors)

                    // uses eval-type function compilation instead of just accepting a toBBox function
                    // because the algorithms are very sensitive to sorting functions performance,
                    // so they should be dead simple and without inner calls

                    var compareArr = ['return a', ' - b', ';'];

                    this.compareMinX = new Function('a','b',compareArr.join(format[0]));
                    this.compareMinY = new Function('a','b',compareArr.join(format[1]));

                    this.toBBox = new Function('a','return {minX: a' + format[0] + ', minY: a' + format[1] + ', maxX: a' + format[2] + ', maxY: a' + format[3] + '};');
                }
            };

            function findItem(item, items, equalsFn) {
                if (!equalsFn)
                    return items.indexOf(item);

                for (var i = 0; i < items.length; i++) {
                    if (equalsFn(item, items[i]))
                        return i;
                }
                return -1;
            }

            // calculate node's bbox from bboxes of its children
            function calcBBox(node, toBBox) {
                distBBox(node, 0, node.children.length, toBBox, node);
            }

            // min bounding rectangle of node children from k to p-1
            function distBBox(node, k, p, toBBox, destNode) {
                if (!destNode)
                    destNode = createNode(null);
                destNode.minX = Infinity;
                destNode.minY = Infinity;
                destNode.maxX = -Infinity;
                destNode.maxY = -Infinity;

                for (var i = k, child; i < p; i++) {
                    child = node.children[i];
                    extend(destNode, node.leaf ? toBBox(child) : child);
                }

                return destNode;
            }

            function extend(a, b) {
                a.minX = Math.min(a.minX, b.minX);
                a.minY = Math.min(a.minY, b.minY);
                a.maxX = Math.max(a.maxX, b.maxX);
                a.maxY = Math.max(a.maxY, b.maxY);
                return a;
            }

            function compareNodeMinX(a, b) {
                return a.minX - b.minX;
            }
            function compareNodeMinY(a, b) {
                return a.minY - b.minY;
            }

            function bboxArea(a) {
                return (a.maxX - a.minX) * (a.maxY - a.minY);
            }
            function bboxMargin(a) {
                return (a.maxX - a.minX) + (a.maxY - a.minY);
            }

            function enlargedArea(a, b) {
                return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) * (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
            }

            function intersectionArea(a, b) {
                var minX = Math.max(a.minX, b.minX)
                  , minY = Math.max(a.minY, b.minY)
                  , maxX = Math.min(a.maxX, b.maxX)
                  , maxY = Math.min(a.maxY, b.maxY);

                return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
            }

            function contains(a, b) {
                return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
            }

            function intersects(a, b) {
                return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
            }

            function createNode(children) {
                return {
                    children: children,
                    height: 1,
                    leaf: true,
                    minX: Infinity,
                    minY: Infinity,
                    maxX: -Infinity,
                    maxY: -Infinity
                };
            }

            // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
            // combines selection algorithm with binary divide & conquer approach

            function multiSelect(arr, left, right, n, compare) {
                var stack = [left, right], mid;

                while (stack.length) {
                    right = stack.pop();
                    left = stack.pop();

                    if (right - left <= n)
                        continue;

                    mid = left + Math.ceil((right - left) / n / 2) * n;
                    quickselect(arr, mid, left, right, compare);

                    stack.push(left, mid, mid, right);
                }
            }

        }
        , {
            "quickselect": 23
        }],
        25: [function(require, module, exports) {
            module.exports = {
                booleanOverlap: require('@turf/boolean-overlap').default,
                union: require('@turf/union').default,
                bbox: require('@turf/bbox').default,
                booleanWithin: require('@turf/boolean-within').default
            };
        }
        , {
            "@turf/bbox": 1,
            "@turf/boolean-overlap": 3,
            "@turf/boolean-within": 6,
            "@turf/union": 16
        }]
    }, {}, [25])(25)
});

    (function(app) {
        var defaultRadius = 10,
            pointsFunctions = app.createPointsObject(),
            newPoint = pointsFunctions.newPoint,
            shiftTo = pointsFunctions.shiftTo,
            shiftBy = pointsFunctions.shiftBy,
            createAxis = pointsFunctions.createAxis;

        app.createHelixObject = function() {
            function getCurvePointSetsForCircleAtOrigin(r) {
                var c = 0.551915024494; // magic constant for creating circles from bezier curves see http://spencermortensen.com/articles/bezier-circle/
                c *= r;

                return {
                    points: [
                        { x: 0, y: r, z: 0 },
                        { x: r, y: 0, z: 0 },
                        { x: 0, y: -r, z: 0 },
                        { x: -r, y: 0, z: 0 }
                    ],
                    handles: [
                        [
                            { x: c, y: r, z: 0 },
                            { x: r, y: c, z: 0 }
                        ],
                        [
                            { x: r, y: -c, z: 0 },
                            { x: c, y: -r, z: 0 }
                        ],
                        [
                            { x: -c, y: -r, z: 0 },
                            { x: -r, y: -c, z: 0 }
                        ],
                        [
                            { x: -r, y: c, z: 0 },
                            { x: -c, y: r, z: 0 }
                        ]
                    ]
                };
            }

            function toOrigin(points, numberOfTurns, radius) {
                var curvesAtOrigin = getCurvePointSetsForCircleAtOrigin(radius);

                shiftTo(points[0], curvesAtOrigin.points[0]);

                for (var i = numberOfTurns - 1; i >= 0; i -= 1) {
                    var j = i * 12;

                    shiftTo(points[j + 1], curvesAtOrigin.handles[0][0]);
                    shiftTo(points[j + 2], curvesAtOrigin.handles[0][1]);
                    shiftTo(points[j + 3], curvesAtOrigin.points[1]);

                    shiftTo(points[j + 4], curvesAtOrigin.handles[1][0]);
                    shiftTo(points[j + 5], curvesAtOrigin.handles[1][1]);
                    shiftTo(points[j + 6], curvesAtOrigin.points[2]);

                    shiftTo(points[j + 7], curvesAtOrigin.handles[2][0]);
                    shiftTo(points[j + 8], curvesAtOrigin.handles[2][1]);
                    shiftTo(points[j + 9], curvesAtOrigin.points[3]);

                    shiftTo(points[j + 10], curvesAtOrigin.handles[3][0]);
                    shiftTo(points[j + 11], curvesAtOrigin.handles[3][1]);
                    shiftTo(points[j + 12], curvesAtOrigin.points[0]);
                }
            }

            function getPointsForHelix(numberOfTurns) {
                var points = [newPoint()];
                for (var i = numberOfTurns * 12; i > 0; i -= 1) {
                    points.push(newPoint());
                }
                return points;
            }

            function createCurvePointSetsForHelix(points) {
                var numberOfPoints = points.length,
                    sets = [];

                for (var i = numberOfPoints - 1; i > 2; i -= 3) {
                    sets.unshift([
                        points[i],
                        points[i - 1],
                        points[i - 2],
                        points[i - 3]
                    ]);
                }
                return sets;
            }

            function getPrimitives(curvePointSets, lineColour, alpha) {
                var createCurve = app.primitives.createCurve,
                    curves = [];

                curvePointSets.forEach(function(set) {
                    curves.push(createCurve(set, lineColour, alpha));
                });

                return curves;
            }

            function createHelix(pointA, pointB, r, numberOfTurns, lineColour, alpha) {
                var radius = r || defaultRadius,
                    points = getPointsForHelix(numberOfTurns),
                    curvePointSets = createCurvePointSetsForHelix(points);

                function align() {
                    var inclination = { x: Math.PI / 2, y: 0, z: 0 },
                        axis = createAxis(pointA, pointB);

                    toOrigin(points, numberOfTurns, radius);
                    axis.align(points, inclination);
                    axis.distribute(points);
                    shiftBy(points, pointA);
                }
                align();

                return {
                    points: points,
                    primitives: getPrimitives(curvePointSets, lineColour, alpha),
                    align: align
                };
            }

            return { createHelix: createHelix };
        };

        app.createSpringTransformationsObject = function() {
            function createTransformer(springs) {
                function transform() {
                    springs.forEach(function(spring) {
                        spring.align();
                    });
                }

                return { transform: transform };
            }

            return { createTransformer: createTransformer };
        };
    })(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
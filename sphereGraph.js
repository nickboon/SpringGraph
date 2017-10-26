(function(app) {
    app.createforceDirectedSphereGraphObject = function(perspective) {
        function forEachNodeIn(nodes, doAction) {
            for (var key in nodes) {
                if (nodes.hasOwnProperty(key)) {
                    doAction(nodes[key]);
                }
            }
        }

        function create(nodes, edges, fillColour, su) {
            var setUp = su || app.createForceDirectedGraphTransformationsObject().defaultSetUp,
                primitives = [],
                points = [],
                sphere;

            forEachNodeIn(nodes, function(node) {
                points.push(node.centre);

                sphere = app.createFakeSpheresObject(perspective)
                    .create(node.centre, node.radius, node.colour, fillColour);
                primitives = primitives.concat(sphere.primitives);
            });

            setUp(nodes);

            return {
                points: points,
                primitives: primitives
            };
        }

        function createFloatingLabel(text, anchor, offset, colour, alpha, size, isScaled) {
            var drawing = app.createDrawingObject(perspective),
                vectorDrawing = app.createVectorDrawingObject(perspective),
                pointsFunctions = app.createPointsObject(),
                newPoint = pointsFunctions.newPoint,
                copyOf = pointsFunctions.copyOf,
                shiftTo = pointsFunctions.shiftTo,
                point = newPoint(),
                defaultOffset = 3,

                getNearestZ = function() {
                    return point.z;
                },
                draw = function(drawingContext, alpha) {
                    drawing.drawLabel(drawingContext, text, point, colour, alpha, size, isScaled);
                },
                getSvg = function() {
                    return vectorDrawing.label(text, point, colour, alpha, size, isScaled);
                },

                primitive = {
                    points: [point],
                    getNearestZ: getNearestZ,
                    draw: draw,
                    getSvg: getSvg
                },

                align = function() {
                    var target = copyOf(anchor);

                    target.z -= offset || defaultOffset;
                    shiftTo(point, target);
                }

            return {
                points: [point],
                primitives: [primitive],
                align: align
            };
        }

        function createFloatingLabelTransformer(labels) {
            function transform() {
                labels.forEach(function(label) {
                    label.align();
                });
            }

            return { transform: transform };
        }

        if (!perspective) {
            throw 'You need to pass in a perspective object to create sphere graph components.';
        }

        return {
            forEachNodeIn: forEachNodeIn,
            create: create,
            createFloatingLabel: createFloatingLabel,
            createFloatingLabelTransformer: createFloatingLabelTransformer
        };
    };
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
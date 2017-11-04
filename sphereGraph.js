(function(app) {
    app.createforceDirectedSphereGraphObject = function() {
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

                sphere = app.createFakeSpheresObject()
                    .create(node.centre, node.radius, node.colour, fillColour);
                primitives = primitives.concat(sphere.primitives);
            });

            setUp(nodes);

            return {
                points: points,
                primitives: primitives
            };
        }

        function createFloatingLabel(text, anchor, offset, colour, alpha, font, isScaled) {
            var //drawing = app.draw(),
            //vectorDrawing = app.createVectorDrawingObject(),
                pointsFunctions = app.createPointsObject(),
                newPoint = pointsFunctions.newPoint,
                copyOf = pointsFunctions.copyOf,
                shiftTo = pointsFunctions.shiftTo,
                point = newPoint(),
                defaultOffset = 3,

                // getNearestZ = function() {
                //     return point.z;
                // },

                // draw = function(context, perspective, alpha) {
                //     drawing.label(context, perspective, text, point, colour, alpha, font, isScaled);
                // },
                // getSvg = function() {
                //     return vectorDrawing.label(text, point, colour, alpha, size, isScaled);
                // },

                // primitive = {
                //     points: [point],
                //     getNearestZ: getNearestZ,
                //     draw: draw,
                //     //getSvg: getSvg
                // },

                align = function() {
                    var target = copyOf(anchor);

                    target.z -= offset || defaultOffset;
                    shiftTo(point, target);
                }

            return {
                points: [point],
                primitives: [app.createPrimitives().label(text, point, colour, alpha, font, isScaled)],
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

        return {
            forEachNodeIn: forEachNodeIn,
            create: create,
            createFloatingLabel: createFloatingLabel,
            createFloatingLabelTransformer: createFloatingLabelTransformer
        };
    };
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
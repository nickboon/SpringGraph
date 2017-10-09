(function(app) {
    var foregroundColour = '#0000ff';

    app.run = function() {
        var diagram = app.createDefaultFullScreenDiagram(),
            perspective = diagram.perspective,
            drawing = app.createDrawingObject(perspective),
            primitives = app.createPrimitivesObject(drawing),

            forceDirectedGraphs = app.createForceDirectedGraphObject(),
            createEdge = forceDirectedGraphs.createEdge,
            createNode = forceDirectedGraphs.createNode,
            nodes = {
                a: createNode(':p', '#66aa66'), // red bb2222
                b: createNode(';p', '#66aa66'), // green 66aa66
                c: createNode(':(', '#66aa66'), // blue 2222bb
                d: createNode(':(', '#66aa66'), // brown bb9966
                e: createNode(':p', '#66aa66'), // red bb2222
                f: createNode(';p', '#66aa66'), // green 66aa66
                g: createNode(':(', '#66aa66'), // blue 2222bb
                h: createNode(':(', '#66aa66'), // brown bb9966
                i: createNode(':p', '#66aa66'), // red bb2222
                j: createNode(';p', '#66aa66'), // green 66aa66
                k: createNode(':(', '#66aa66'), // blue 2222bb
                l: createNode(':(', '#66aa66'), // brown bb9966
            },
            edges = [
                createEdge('a', 'b'),
                createEdge('a', 'c'),
                createEdge('a', 'd'),
                createEdge('a', 'e'),
                createEdge('a', 'f'),
                createEdge('b', 'f'),
                createEdge('b', 'c'),
                createEdge('b', 'h'),
                createEdge('b', 'g'),
                createEdge('c', 'l'),
                createEdge('c', 'g'),
                createEdge('c', 'd'),
                createEdge('d', 'e'),
                createEdge('d', 'j'),
                createEdge('d', 'l'),
                createEdge('e', 'f'),
                createEdge('e', 'j'),
                createEdge('e', 'i'),
                createEdge('f', 'h'),
                createEdge('f', 'i'),
                createEdge('g', 'h'),
                createEdge('g', 'l'),
                createEdge('g', 'k'),
                createEdge('h', 'i'),
                createEdge('h', 'k'),
                createEdge('i', 'k'),
                createEdge('i', 'j'),
                createEdge('j', 'k'),
                createEdge('j', 'l'),
                createEdge('k', 'l')
            ],
            tree = forceDirectedGraphs.solids.createTree(perspective, nodes, edges),
            getHelices = function() {
                var numberOfTurns = 60,
                    createHelix = app.createHelixObject(primitives).createHelix,
                    a,
                    b,
                    result = [];

                edges.forEach(function(edge) {
                    a = edge.nodeA;
                    b = edge.nodeB;
                    result.push(createHelix(
                        nodes[a].centre,
                        nodes[b].centre,
                        nodes[a].radius,
                        numberOfTurns,
                        nodes[a].colour
                    ));
                });
                return result;
            },
            helices = getHelices(),
            solidsList = helices, //[tree].concat(helices),
            stage = diagram.stage;

        stage.setSolids(solidsList);
        stage.setTransformers([
            app.createTransformationObject().createKeyboardDrivenTransformer(solidsList),
            app.createForceDirectedGraphTransformationsObject().createDefaultTransformer(nodes, edges, 200),
            app.createSpringTransformationsObject().createTransformer(helices)
        ]);
    }
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
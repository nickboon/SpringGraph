(function(app) {
    /* Some colours...
     *  
     * red bb2222
     * green 66aa66
     * blue 2222bb
     * brown bb9966            
     */
    var foregroundColour = '#66aa66',
        backgroundColour = '#ffffff',
        labelColour = '#ff0000',
        nodeRadius = 30,

        forceDirectedGraphs = app.createForceDirectedGraphObject(),
        createEdge = forceDirectedGraphs.createEdge,
        createNode = forceDirectedGraphs.createNode;

    function getReqularIsohedronSphereGraph() {
        return {
            nodes: {
                a: createNode('a', foregroundColour, nodeRadius),
                b: createNode('b', foregroundColour, nodeRadius),
                c: createNode('c', foregroundColour, nodeRadius),
                d: createNode('d', foregroundColour, nodeRadius),
                e: createNode('e', foregroundColour, nodeRadius),
                f: createNode('f', foregroundColour, nodeRadius),
                g: createNode('g', foregroundColour, nodeRadius),
                h: createNode('h', foregroundColour, nodeRadius),
                i: createNode('i', foregroundColour, nodeRadius),
                j: createNode('j', foregroundColour, nodeRadius),
                k: createNode('k', foregroundColour, nodeRadius),
                l: createNode('l', foregroundColour, nodeRadius),
            },
            edges: [
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
            ]
        };
    }

    app.run = function() {
        var isohedron = getReqularIsohedronSphereGraph(),
            nodes = isohedron.nodes,
            edges = isohedron.edges,
            sphereGraph = app.createforceDirectedSphereGraphObject(),
            graph = sphereGraph.create(nodes, edges, backgroundColour),

            getHelices = function() {
                var numberOfTurns = 40,
                    createHelix = app.createHelixObject().createHelix,
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

            getLabels = function() {
                var createLabel = sphereGraph.createFloatingLabel,
                    forEachNodeIn = sphereGraph.forEachNodeIn,
                    result = [];

                forEachNodeIn(nodes, function(node) {
                    var offset = node.radius;
                    result.push(createLabel(node.text, node.centre, offset, labelColour, undefined, undefined, true));
                });
                return result;
            },
            labels = getLabels(),
            solids = labels.concat(helices).concat([graph]),
            stage = app.createStage(),
            inputTransformer = app.createInputTransformer([graph]);

        document.body.style.background = backgroundColour;
        stage.setSolids(solids);
        stage.setTransformers([
            inputTransformer,
            app.createForceDirectedGraphTransformationsObject().createDefaultTransformer(nodes, edges, 200),
            app.createSpringTransformationsObject().createTransformer(helices),
            sphereGraph.createFloatingLabelTransformer(labels)
        ]);
        app.createUiObject().setDefaultTransformationKeyListeners(inputTransformer);
    }
})(window.DIAGRAM_APP || (window.DIAGRAM_APP = {}));
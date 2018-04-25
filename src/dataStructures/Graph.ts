export class GraphVertex {
    id: string;

    constructor(id: string) {
        this.id = id;
    };
}

export class GraphEdge {
    incomingVertex: GraphVertex;
    outgoingVertex: GraphVertex;
    minFlow: number;
    maxFlow: number;
    constructor(outgoingVertex: GraphVertex, incomingVertex: GraphVertex, minFlow: number, maxFlow: number) {
        this.incomingVertex = incomingVertex;
        this.outgoingVertex = outgoingVertex;
        this.minFlow = minFlow;
        this.maxFlow = maxFlow;
    }
}

export class DirectedGraph {
    edges: {[id: string]: string[]}[]; // adjacency list
    vertices: GraphVertex[];
    vertexReverseLookupTable: {[id: string]: GraphVertex};
    minFlow: {[id: string]: number}[];
    maxFlow: {[id: string]: number}[];
    constructor() {
        this.edges = [];
        this.vertices = [];
        this.vertexReverseLookupTable = {}
        this.minFlow = [];
        this.maxFlow = [];
    }

    addVertex(vertex: GraphVertex) {
        this.vertices.push(vertex);
        this.vertexReverseLookupTable[vertex.id] = vertex;
        this.edges[vertex.id] = [];
    }

    addEdge(edge: GraphEdge) {
        // TODO: check if edge already exists
        this.edges[edge.outgoingVertex.id].push(edge.incomingVertex.id);
        this.minFlow[edge.outgoingVertex.id + '-' + edge.incomingVertex.id] = edge.minFlow;
        this.maxFlow[edge.outgoingVertex.id + '-' + edge.incomingVertex.id] = edge.maxFlow;
    }
}
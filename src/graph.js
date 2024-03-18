export class Graph {
    nodes = new Set();
    edges = new Set();
    nodesNamed;
    constructor(builder, defaultVal) {
        const output = builder((value = defaultVal()) => {
            const node = new GNode(value, []);
            this.nodes.add(node);
            return node;
        }, (a, b, value) => {
            const edge = new Edge(a, b, value);
            a.edges.push(edge);
            b.edges.push(edge);
            this.edges.add(edge);
            return edge;
        });
        const nodesNamed = Object.entries(output);
        for (const [k, v] of nodesNamed) {
            v.name = k;
        }
        this.nodesNamed = new Map(nodesNamed);
    }
    max(func, filter) {
        let maxScore = -Infinity;
        let maxNode = null;
        this.nodes.forEach(n => {
            if (filter && !filter(n))
                return;
            const score = func(n);
            if (score > maxScore) {
                maxScore = score;
                maxNode = n;
            }
        });
        return maxNode;
    }
}
export class GNode {
    value;
    edges;
    name;
    constructor(value, edges) {
        this.value = value;
        this.edges = edges;
    }
    *connections() {
        for (const edge of this.edges) {
            yield [edge.opposite(this), edge];
        }
    }
}
export class Edge {
    a;
    b;
    value;
    constructor(a, b, value) {
        this.a = a;
        this.b = b;
        this.value = value;
    }
    opposite(node) {
        if (node == this.a)
            return this.b;
        return this.a;
    }
}

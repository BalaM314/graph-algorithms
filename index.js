"use strict";
class Graph {
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
class GNode {
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
class Edge {
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
const graph = new Graph((node, edge) => {
    const base = node();
    const t1 = node();
    const t2 = node();
    const t3 = node();
    const t4 = node();
    const t5 = node();
    const t6 = node();
    edge(base, t1, 4);
    edge(base, t2, 5);
    edge(base, t3, 2);
    edge(t1, t3, 1);
    edge(t1, t4, 7);
    edge(t1, t2, 8);
    edge(t2, t5, 3);
    edge(t5, t6, 5);
    edge(t4, t5, 6);
    edge(t3, t5, 1);
    return { base, t1, t2, t3, t4, t5, t6 };
}, () => [null, []]);
function dijkstra(graph, source, target) {
    let sourceNode = graph.nodesNamed.get(source) ?? null;
    const targetNode = graph.nodesNamed.get(target) ?? null;
    if (!sourceNode)
        throw new Error(`Invalid source node`);
    if (!targetNode)
        throw new Error(`Invalid source node`);
    let currentNode = sourceNode;
    currentNode.value[1] = [0];
    while (currentNode) {
        currentNode.value[0] = currentNode.value[1].at(-1);
        for (const [node, edge] of currentNode.connections()) {
            if (currentNode.value[0] + edge.value < (node.value[1].at(-1) ?? Infinity)) {
                node.value[1].push(currentNode.value[0] + edge.value);
            }
        }
        currentNode = graph.max(n => -(n.value[1].at(-1) ?? Infinity), n => n.value[0] == null); //Find the lowest working value that is not a final value
    }
    let reversedPath = [];
    currentNode = targetNode;
    nextNode: while (currentNode != sourceNode) {
        for (const [node, edge] of currentNode.connections()) {
            if (node.value[0] === null || currentNode.value[0] === null)
                throw new Error(`Impossible`);
            if (currentNode.value[0] - edge.value == node.value[0]) {
                currentNode = node;
                reversedPath.push(edge);
                continue nextNode;
            }
        }
        console.log(currentNode);
        throw new Error(`Cannot find path from node ${currentNode.name}`);
    }
    return reversedPath.reverse();
}
console.log(dijkstra(graph, "base", "t6"));

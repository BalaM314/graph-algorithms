import { crash, impossible } from "./src/funcs.js";
import { Graph } from "./src/graph.js";
const graph1 = new Graph((node, edge) => {
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
const graph2 = new Graph((node, edge) => {
    const begin = node();
    const a = node();
    const b = node();
    const c = node();
    const d = node();
    const e = node();
    const f = node();
    const g = node();
    const end = node();
    edge(begin, a, 5);
    edge(begin, b, 6);
    edge(begin, c, 5);
    edge(begin, d, 4);
    edge(a, e, 6);
    edge(e, f, 7);
    edge(a, end, 8);
    edge(b, end, 7);
    edge(g, end, 7);
    edge(f, end, 1);
    edge(f, g, 4);
    edge(c, g, 2);
    edge(d, g, 6);
    return { begin, a, b, c, d, e, f, g, end };
}, () => ({
    movementCost: null,
    movementCostFinalized: false,
    totalScore: null,
}));
const graph2heuristic = (node) => ({
    begin: 12,
    a: 8,
    b: 6,
    c: 7,
    d: 11,
    e: 8,
    f: 1,
    g: 5,
    end: 0,
})[node.name] ?? crash(`Unknown node ${node.name}`);
function dijkstra(graph, source, target) {
    let sourceNode = graph.nodesNamed.get(source) ?? crash("Invalid source node");
    const targetNode = graph.nodesNamed.get(target) ?? crash("Invalid target node");
    let currentNode = sourceNode;
    currentNode.value[1] = [0];
    while (currentNode) {
        currentNode.value[0] = currentNode.value[1].at(-1);
        for (const [node, edge] of currentNode.connections()) {
            if (currentNode.value[0] + edge.value < (node.value[1].at(-1) ?? Infinity)) {
                node.value[1].push(currentNode.value[0] + edge.value);
            }
        }
        //Find the lowest working value that is not a final value
        currentNode = graph.max(n => -(n.value[1].at(-1) ?? Infinity), n => n.value[0] == null);
    }
    let reversedPath = [targetNode];
    currentNode = targetNode;
    nextNode: while (currentNode != sourceNode) {
        for (const [node, edge] of currentNode.connections()) {
            if (node.value[0] === null || currentNode.value[0] === null)
                impossible();
            if (currentNode.value[0] - edge.value == node.value[0]) {
                currentNode = node;
                reversedPath.push(node);
                continue nextNode;
            }
        }
        console.log(currentNode);
        crash(`Cannot find path from node ${currentNode.name}`);
    }
    return reversedPath.reverse();
}
function aStar(graph, heuristic, source, target) {
    let sourceNode = graph.nodesNamed.get(source) ?? crash("Invalid source node");
    const targetNode = graph.nodesNamed.get(target) ?? crash("Invalid target node");
    sourceNode.value.movementCost = 0;
    sourceNode.value.totalScore = heuristic(sourceNode);
    let currentNode = sourceNode;
    while (currentNode && currentNode != targetNode) { //if the lowest working score is the target node, there cannot be any lower path so the search is complete
        console.log(`Exploring ${currentNode.name}`);
        currentNode.value.movementCostFinalized = true;
        for (const [node, edge] of currentNode.connections()) {
            node.value.movementCost = Math.min(node.value.movementCost ?? Infinity, currentNode.value.movementCost + edge.value);
            node.value.totalScore = node.value.movementCost + heuristic(node);
        }
        //Find the lowest working score that is not a final value
        currentNode = graph.max(n => -(n.value.totalScore ?? Infinity), n => !n.value.movementCostFinalized);
    }
    let reversedPath = [targetNode];
    let currentNode2 = targetNode;
    nextNode: while (currentNode2 != sourceNode) {
        for (const [node, edge] of currentNode2.connections()) {
            if (!node.value.movementCostFinalized || node.value.movementCost == null)
                continue; //this node was not explored, so it cannot be part of the path
            if (currentNode2.value.movementCost == null)
                impossible();
            if (currentNode2.value.movementCost - edge.value == node.value.movementCost) {
                currentNode2 = node;
                reversedPath.push(node);
                continue nextNode;
            }
        }
        console.log(currentNode);
        crash(`Cannot find path from node ${currentNode2.name}`);
    }
    return reversedPath.reverse();
}
//n => n.edges.reduce((acc, e) => Math.min(acc, e.value), Infinity)
console.log(aStar(graph2, graph2heuristic, "begin", "end").map(n => n.name));
// console.log(graph2.nodes);

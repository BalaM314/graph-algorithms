import { crash } from "./src/funcs.js";
import { GNode, Graph } from "./src/graph.js";


const graph = new Graph<DData>((node, edge) => {
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
	return {base, t1, t2, t3, t4, t5, t6};
}, () => [null, []]);

type DData = [final:number | null, working:number[]];

function dijkstra(graph:Graph<DData>, source:string, target:string):GNode<DData>[] {
	let sourceNode:GNode<DData> | null = graph.nodesNamed.get(source) ?? null;
	const targetNode:GNode<DData> | null = graph.nodesNamed.get(target) ?? null;
	if(!sourceNode) throw new Error(`Invalid source node`);
	if(!targetNode) throw new Error(`Invalid source node`);
	let currentNode:GNode<DData> | null = sourceNode;
	currentNode.value[1] = [0];
	while(currentNode){
		currentNode.value[0] = currentNode.value[1].at(-1)!;
		for(const [node, edge] of currentNode.connections()){
			if(currentNode.value[0] + edge.value < (node.value[1].at(-1) ?? Infinity)){
				node.value[1].push(currentNode.value[0] + edge.value);
			}
		}
		//Find the lowest working value that is not a final value
		currentNode = graph.max(n => -(n.value[1].at(-1) ?? Infinity), n => n.value[0] == null);
	}
	
	let reversedPath:GNode<DData>[] = [targetNode];
	currentNode = targetNode;
	nextNode:
	while(currentNode != sourceNode){
		for(const [node, edge] of currentNode.connections()){
			if(node.value[0] === null || currentNode.value[0] === null) crash(`Impossible`);
			if(currentNode.value[0] - edge.value == node.value[0]){
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

console.log(dijkstra(graph, "base", "t6"));

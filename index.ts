class Graph<T> {
	nodes = new Set<GNode<T>>();
	edges = new Set<Edge<T>>();
	nodesNamed: Map<string, GNode<T>>;
	constructor(
		builder:(node:() => GNode<T>, edge:(a:GNode<T>, b:GNode<T>, value:number) => Edge<T>) => Record<string, GNode<T>>,
		defaultVal: () => T
	);
	constructor(builder:(node:(value:T) => GNode<T>, edge:(a:GNode<T>, b:GNode<T>, value:number) => Edge<T>) => Record<string, GNode<T>>);
	constructor(builder:(node:(value?:T) => GNode<T>, edge:(a:GNode<T>, b:GNode<T>, value:number) => Edge<T>) => Record<string, GNode<T>>, defaultVal?:() => T){
		const output = builder(
			(value = defaultVal!()) => {
				const node = new GNode(value, []);
				this.nodes.add(node);
				return node;
			},
			(a, b, value) => {
				const edge = new Edge(a, b, value);
				a.edges.push(edge);
				b.edges.push(edge);
				this.edges.add(edge);
				return edge;
			},
		);
		const nodesNamed = Object.entries(output);
		for(const [k, v] of nodesNamed){
			v.name = k;
		}
		this.nodesNamed = new Map<string, GNode<T>>(nodesNamed);
	}
	max(func:(node:GNode<T>) => number, filter?:(node:GNode<T>) => boolean){
		let maxScore = -Infinity;
		let maxNode:GNode<T> | null = null;
		this.nodes.forEach(n => {
			if(filter && !filter(n)) return;
			const score = func(n);
			if(score > maxScore){
				maxScore = score;
				maxNode = n;
			}
		});
		return maxNode;
	}
}

class GNode<T> {
	name!:string;
	constructor(
		public value: T,
		public edges: Edge<T>[]
	){}
	*connections(){
		for(const edge of this.edges){
			yield [edge.opposite(this), edge] as const;
		}
	}
}

class Edge<T> {
	constructor(
		public a: GNode<T>,
		public b: GNode<T>,
		public value: number,
	){}
	opposite(this:Edge<T>, node:GNode<T>):GNode<T> {
		if(node == this.a) return this.b;
		return this.a;
	}
}

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

function dijkstra(graph: Graph<DData>, source:string, target:string):Edge<DData>[]{
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
		currentNode = graph.max(n => -(n.value[1].at(-1) ?? Infinity), n => n.value[0] == null); //Find the lowest working value that is not a final value
	}
	
	let reversedPath:Edge<DData>[] = [];
	currentNode = targetNode;
	nextNode:
	while(currentNode != sourceNode){
		for(const [node, edge] of currentNode.connections()){
			if(node.value[0] === null || currentNode.value[0] === null) throw new Error(`Impossible`);
			if(currentNode.value[0] - edge.value == node.value[0]){
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


export class Graph<T> {
	nodes = new Set<GNode<T>>();
	edges = new Set<Edge<T>>();
	nodesNamed: Map<string, GNode<T>>;
	constructor(
		builder:(node:() => GNode<T>, edge:(a:GNode<T>, b:GNode<T>, value:number) => Edge<T>) => Record<string, GNode<T>>,
		defaultVal: () => T
	);
	constructor(
		builder:(node:(value:T) => GNode<T>, edge:(a:GNode<T>, b:GNode<T>, value:number) => Edge<T>) => Record<string, GNode<T>>
	);
	constructor(
		builder:(node:(value?:T) => GNode<T>, edge:(a:GNode<T>, b:GNode<T>, value:number) => Edge<T>) => Record<string, GNode<T>>,
		defaultVal?:() => T
	){
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

export class GNode<T> {
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

export class Edge<T> {
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

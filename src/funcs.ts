export function crash(message:string):never {
	throw new Error(message);
}

export function impossible():never {
	throw new Error("unreachable code was reached!");
}


export function crash(message) {
    throw new Error(message);
}
export function impossible() {
    throw new Error("unreachable code was reached!");
}

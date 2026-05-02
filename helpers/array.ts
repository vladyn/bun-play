export function shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - .5);
}
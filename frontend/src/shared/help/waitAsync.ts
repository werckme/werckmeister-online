export async function waitAsync(delay: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, delay);
    });
}
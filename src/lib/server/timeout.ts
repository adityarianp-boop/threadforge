export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message = "Request timed out") {
  const timeout = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(message));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

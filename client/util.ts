const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_-abcdefghijklmnopqrstuvwxyz";

export function genId(): string {
  let id = "";
  let i = 12;
  while (i--) {
    id += alphabet[(Math.random() * 64) | 0];
  }
  return id;
}

export function ensureMode(name: string | null): Promise<void> {
  return new Promise(resolve => {
    const modeUrl = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.53.2/mode/${name}/${name}.min.js`;
    if (name != null && !document.querySelector(`script[src="${modeUrl}"]`)) {
      const s = document.createElement("script");
      s.src = modeUrl;
      s.onload = () => resolve();
      document.body.appendChild(s);
    } else {
      resolve();
    }
  });
}

type deferred<T> = Promise<T> & { resolve: (v: T) => void };
export function deferred<T>(): deferred<T> {
  let resolve: unknown;
  const p = new Promise<T>(res => {
    resolve = res;
  });

  return Object.assign(p, { resolve }) as deferred<T>;
}

export function modeId(name: string): string {
  return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
}

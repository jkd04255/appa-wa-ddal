const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicAsset(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`Public asset paths must start with "/": ${path}`);
  }

  if (!publicBasePath || path === publicBasePath || path.startsWith(`${publicBasePath}/`)) {
    return path;
  }

  return `${publicBasePath}${path}`;
}

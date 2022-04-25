export const encode = (obj: Record<string, any>): string =>
  Buffer.from(JSON.stringify(obj)).toString("base64");
export const decode = (value: string): Record<string, any> =>
  JSON.parse(Buffer.from(value, "base64").toString());

export function tryParseToolCall(text: string) {
  try {
    const json = JSON.parse(text);
    if (json.tool) return json;
  } catch {}
  return null;
}

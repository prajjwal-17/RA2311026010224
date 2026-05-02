export function formatNotificationTime(timestamp: string): string {
  const value = Date.parse(timestamp);

  if (Number.isNaN(value)) {
    return "Invalid timestamp";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function compareByRecency(left: string, right: string): number {
  return Date.parse(left) - Date.parse(right);
}

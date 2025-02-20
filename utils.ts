export const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
}

export const categoryColors = {
  work: "bg-purple-500",
  personal: "bg-green-500",
  shopping: "bg-orange-500",
  other: "bg-gray-500",
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}


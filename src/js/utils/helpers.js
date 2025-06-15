export function formatDate(date) {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date");
  }
  return date.toISOString().split("T")[0];
}

export function validateInput(input) {
  return input && input.trim() !== "";
}

export function generateUniqueId() {
  return "id-" + Math.random().toString(36).substr(2, 16);
}

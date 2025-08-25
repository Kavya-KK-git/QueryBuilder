function parseValue(value) {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "true") return true;
    if (lower === "false") return false;
  }

  if (!isNaN(value) && value !== "") {
    return Number(value);
  }

  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return value;
}

module.exports = { parseValue };

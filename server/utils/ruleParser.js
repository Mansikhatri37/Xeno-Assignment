function buildMongoQuery(rules) {
  const conditions = rules.conditions.map((cond) => {
    const field = cond.field === "inactiveDays" ? "last_active" : cond.field;

    if (cond.field === "inactiveDays") {
      const targetDate = new Date(Date.now() - cond.value * 24 * 60 * 60 * 1000);
      return cond.operator === ">"
        ? { [field]: { $lt: targetDate } }
        : { [field]: { $gt: targetDate } };
    }

    switch (cond.operator) {
      case ">": return { [field]: { $gt: cond.value } };
      case "<": return { [field]: { $lt: cond.value } };
      case "=": return { [field]: cond.value };
      default: throw new Error("Invalid operator");
    }
  });

  return rules.logic === "AND" ? { $and: conditions } : { $or: conditions };
}

module.exports = { buildMongoQuery };

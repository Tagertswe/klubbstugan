export default defineEventHandler(async () => {
  const rows = await useDb().faqItem.findMany({ orderBy: [{ topic: "asc" }, { sortOrder: "asc" }] });
  const topics = new Map<string, { id: string; question: string; answer: string }[]>();
  for (const { id, topic, question, answer } of rows) {
    topics.set(topic, [...(topics.get(topic) ?? []), { id, question, answer }]);
  }
  return [...topics.entries()].map(([topic, items]) => ({ topic, items }));
});

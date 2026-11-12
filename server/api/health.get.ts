// Liveness for Docker and the smoke test: the app answers, and says whether
// the database does.
export default defineEventHandler(async () => {
  let database = "ok";
  try {
    await useDb().$queryRaw`SELECT 1`;
  } catch {
    database = "unavailable";
  }
  return { status: "ok", database };
});

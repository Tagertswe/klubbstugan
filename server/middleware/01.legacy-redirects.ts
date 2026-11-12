import { mapLegacyPath } from "../../shared/utils/legacy";

// Old SvenskaLag links (bookmarks, Google, the Facebook group) keep working:
// they get a permanent redirect to the new page (spec §8, step 4).
export default defineEventHandler((event) => {
  const target = mapLegacyPath(event.path);
  if (target) return sendRedirect(event, target, 301);
});

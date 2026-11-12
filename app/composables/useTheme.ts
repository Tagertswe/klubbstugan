import { THEMES, type ThemeConfig, type ThemeId } from "#shared/utils/themes";

/** The theme chosen for this request (set on the server by middleware/02.theme). */
export function useTheme() {
  const id = useState<ThemeId>("theme", () => "klassisk");
  const config = computed<ThemeConfig>(() => THEMES[id.value] ?? THEMES.klassisk);
  return { id, config };
}

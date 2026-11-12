// Copies the server's theme decision into shared state before rendering, so
// <html data-theme> is right in the first byte of HTML.
export default defineNuxtPlugin(() => {
  const event = useRequestEvent();
  const theme = useState("theme", () => "klassisk");
  if (event?.context.theme) theme.value = event.context.theme;
});

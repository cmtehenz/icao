/** Dynamic import with retry — recovers from stale chunk errors after hot reload. */
export async function loadSpeechSdk() {
  const importSdk = () =>
    import(/* webpackChunkName: "azure-speech-sdk" */ "microsoft-cognitiveservices-speech-sdk");

  try {
    return await importSdk();
  } catch (first) {
    try {
      return await importSdk();
    } catch {
      throw new Error(
        "Falha ao carregar Azure Speech. Recarregue a página com Cmd+Shift+R (Mac) ou Ctrl+Shift+R.",
        { cause: first },
      );
    }
  }
}

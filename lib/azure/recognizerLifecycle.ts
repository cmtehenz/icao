export type RecognizerLifecycle = "idle" | "starting" | "listening" | "stopping";

export function canStopRecognizer(lifecycle: RecognizerLifecycle): boolean {
  return lifecycle === "listening" || lifecycle === "stopping";
}

export function isRecognizerBusy(lifecycle: RecognizerLifecycle): boolean {
  return lifecycle === "starting" || lifecycle === "listening" || lifecycle === "stopping";
}

/** stop() should run drain/close only when the SDK session was actually listening. */
export function shouldDrainRecognizerOnStop(lifecycle: RecognizerLifecycle): boolean {
  return lifecycle === "listening" || lifecycle === "stopping";
}

import { execFile } from "child_process"
import { writeFile, readFile, unlink } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { promisify } from "util"

const execFileAsync = promisify(execFile)

// macOS Enhanced voices — installed via System Settings → Accessibility → Spoken Content
const VOICE_MAP: Record<string, string> = {
  mexico:        "Mónica",
  spain:         "Mónica",
  latin_america: "Mónica",
  france:        "Amélie",
  quebec:        "Amélie",
}

const FALLBACK_VOICE: Record<string, string> = {
  mexico:        "Mónica",
  spain:         "Mónica",
  latin_america: "Mónica",
  france:        "Amélie",
  quebec:        "Amélie",
}

async function runSay(voice: string, textFile: string, aiffFile: string): Promise<void> {
  await execFileAsync("say", ["-v", voice, "-o", aiffFile, "-f", textFile])
}

export async function POST(request: Request) {
  const body = await request.json()
  const { text, region, voice: requestedVoice } = body as { text: string; region: string; voice?: string }

  if (!text?.trim()) {
    return new Response(null, { status: 204 })
  }

  const id = crypto.randomUUID()
  const textFile = join(tmpdir(), `tts_text_${id}.txt`)
  const aiffFile = join(tmpdir(), `tts_${id}.aiff`)
  const audioFile = join(tmpdir(), `tts_${id}.m4a`)

  try {
    await writeFile(textFile, text, "utf8")

    // Use caller-supplied voice, fall back to region default
    const enhancedVoice = requestedVoice ?? VOICE_MAP[region] ?? "Paulina (Enhanced)"
    const fallbackVoice = FALLBACK_VOICE[region] ?? "Paulina"

    try {
      await runSay(enhancedVoice, textFile, aiffFile)
      console.log(`[TTS] voice="${enhancedVoice}" region="${region}"`)
    } catch (err) {
      console.warn(`[TTS] enhanced voice failed, falling back. voice="${enhancedVoice}" error:`, err)
      await runSay(fallbackVoice, textFile, aiffFile)
    }

    // Convert AIFF → AAC/M4A (browser-compatible)
    await execFileAsync("afconvert", [aiffFile, audioFile, "-d", "aac", "-f", "m4af"])

    const audioData = await readFile(audioFile)

    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mp4",
        "Content-Length": String(audioData.byteLength),
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("TTS error:", error)
    return Response.json({ error: "TTS failed" }, { status: 500 })
  } finally {
    await Promise.allSettled([
      unlink(textFile).catch(() => {}),
      unlink(aiffFile).catch(() => {}),
      unlink(audioFile).catch(() => {}),
    ])
  }
}

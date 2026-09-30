/* =====================================================================
   BreatheWell AI — photo analysis (on-device computer vision)
   Scans an uploaded photo of lips / fingernails / face for a bluish
   or dusky tint (cyanosis-type sign) and estimates image quality.
   Screening only — never a diagnosis.
   ===================================================================== */

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = 60 * (((g - b) / d) + (g < b ? 6 : 0))
    else if (max === g) h = 60 * (((b - r) / d) + 2)
    else h = 60 * (((r - g) / d) + 4)
  }
  return [h, s, l]
}

async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read this image. Try a JPG or PNG photo.'))
    img.src = url
  })
}

/** Analyze an image File. Returns color findings + a display URL + downscaled pixel info. */
export async function analyzeImageFile(file) {
  const url = URL.createObjectURL(file)
  const img = await loadImage(url)

  // downscale for fast analysis
  const MAX = 720
  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))

  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)

  const total = w * h
  let skin = 0, lip = 0, blue = 0, paleBlue = 0
  let sumL = 0
  let gradSum = 0, gradN = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const [hh, s, l] = rgbToHsl(r, g, b)
    sumL += l

    const isSkin = s > 0.12 && s < 0.78 && l > 0.12 && l < 0.92 && (hh <= 48 || hh >= 330)
    const isLip  = hh <= 22 && s > 0.36 && l > 0.18 && l < 0.75
    const isBlue = hh >= 195 && hh <= 300 && s > 0.18 && l < 0.62
    const isPaleBlue = hh >= 185 && hh <= 310 && s > 0.08 && s <= 0.22 && l < 0.7

    if (isSkin) skin++
    if (isLip) lip++
    if (isBlue) blue++
    if (isPaleBlue) paleBlue++

    // sharpness: horizontal gradient energy on every 6th pixel row
    if (i % 24 === 0 && i + 4 < data.length) {
      gradSum += Math.abs(data[i] - data[i + 4]) + Math.abs(data[i + 1] - data[i + 5])
      gradN += 2
    }
  }

  const relevant = skin + lip + blue + 1
  const brightness = sumL / total
  const sharpness = gradN ? gradSum / gradN : 0

  const findings = {
    skinPct: +(100 * skin / total).toFixed(1),
    lipPct: +(100 * lip / total).toFixed(1),
    cyanPct: +(100 * blue / relevant).toFixed(1),
    paleCyanPct: +(100 * paleBlue / relevant).toFixed(1),
    brightness: +brightness.toFixed(2),
    sharpness: Math.round(sharpness),
    width: img.naturalWidth,
    height: img.naturalHeight,
  }

  // quality checks
  const issues = []
  if (brightness < 0.2) issues.push('Photo looks too dark — retake in good daylight.')
  if (brightness > 0.85) issues.push('Photo looks overexposed — avoid direct flash.')
  if (sharpness < 6) issues.push('Photo looks blurry — hold the camera steady and tap to focus.')
  if (skin + lip < total * 0.04) issues.push("Couldn't clearly find skin, lips or nails — take a closer, well-lit close-up.")
  findings.issues = issues

  // cyanosis-style flags (heuristic)
  findings.cyanosisFlag = findings.cyanPct >= 8 && issues.length === 0
  findings.cyanosisSuspect = !findings.cyanosisFlag && findings.cyanPct >= 4.5 && brightness >= 0.2

  return { findings, previewUrl: url }
}

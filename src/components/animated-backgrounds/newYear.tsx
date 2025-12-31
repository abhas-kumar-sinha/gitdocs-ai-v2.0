"use client"

import { Fireworks } from "fireworks-js"
import { useEffect, useRef, useState } from "react"

const brandHues = [
  25, 30,      // peach
  50, 55,      // yellow
  205, 210,    // sky blue
  270, 280,    // lavender
  330, 335     // soft pink
]

// helper to pick a random hue range
function getRandomHueRange() {
  const idx = Math.floor(Math.random() * (brandHues.length / 2)) * 2
  return { min: brandHues[idx], max: brandHues[idx + 1] }
}

const NewYear = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const fireworksRef = useRef<Fireworks | null>(null)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const fireworks = new Fireworks(containerRef.current, {
      autoresize: true,
      opacity: 0.45,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.4,
      particles: 50,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 8,
      intensity: 28,
      flickering: 40,
      lineStyle: "round",

      // default hue — will be overridden per rocket
      hue: getRandomHueRange(),

      brightness: {
        min: 70,
        max: 90, // lighter shades only
      },

      decay: {
        min: 0.015,
        max: 0.03,
      },

      delay: {
        min: 30,
        max: 60,
      },

      rocketsPoint: {
        min: 0,
        max: 100,
      },

      lineWidth: {
        explosion: { min: 1, max: 2 },
        trace: { min: 1, max: 2 },
      },

      mouse: {
        click: false,
        move: false,
        max: 1,
      },
    })

    fireworksRef.current = fireworks
    fireworks.start()

    // periodically update hue per firework
    const hueInterval = setInterval(() => {
      if (!fireworksRef.current) return
      fireworksRef.current.updateOptions({
        hue: getRandomHueRange(),
      })
      fireworksRef.current.launch(3)  // launch a few with new colors
    }, 800)

    const unmountTimer = setTimeout(() => {
      setShouldRender(false)
    }, 10000)

    return () => {
      clearInterval(hueInterval)
      clearTimeout(unmountTimer)
      if (fireworksRef.current) {
        fireworksRef.current.stop()
        fireworksRef.current.clear()
        fireworksRef.current = null
      }
    }
  }, [])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-5">
      <div ref={containerRef} />
    </div>
  )
}

export default NewYear

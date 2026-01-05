"use client"

import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

interface ScrambleHoverProps {
  text: string
  scrambleSpeed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: "start" | "end" | "center"
  useOriginalCharsOnly?: boolean
  characters?: string
  className?: string
  scrambledClassName?: string
}

interface ScrambleTextProps {
  text: string
  scrambleSpeed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: "start" | "end" | "center"
  characters?: string
  className?: string
  scrambledClassName?: string
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

export const ScrambleHover: React.FC<ScrambleHoverProps> = ({
  text,
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = SCRAMBLE_CHARS,
  className,
  scrambledClassName,
  sequential = false,
  revealDirection = "start",
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>())

  useEffect(() => {
    let interval: NodeJS.Timeout
    let currentIteration = 0

    const getNextIndex = () => {
      const textLength = text.length
      switch (revealDirection) {
        case "start":
          return revealedIndices.size
        case "end":
          return textLength - 1 - revealedIndices.size
        case "center":
          const middle = Math.floor(textLength / 2)
          const offset = Math.floor(revealedIndices.size / 2)
          const nextIndex = revealedIndices.size % 2 === 0 ? middle + offset : middle - offset - 1

          if (nextIndex >= 0 && nextIndex < textLength && !revealedIndices.has(nextIndex)) {
            return nextIndex
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedIndices.has(i)) return i
          }
          return 0
        default:
          return revealedIndices.size
      }
    }

    const shuffleText = (text: string) => {
      const availableChars = useOriginalCharsOnly
        ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
        : characters.split("")

      if (useOriginalCharsOnly) {
        const positions = text.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: revealedIndices.has(i),
        }))

        const nonSpaceChars = positions.filter((p) => !p.isSpace && !p.isRevealed).map((p) => p.char)

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]]
        }

        let charIndex = 0
        return positions
          .map((p) => {
            if (p.isSpace) return " "
            if (p.isRevealed) return text[p.index]
            return nonSpaceChars[charIndex++]
          })
          .join("")
      } else {
        return text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (revealedIndices.has(i)) return text[i]
            return availableChars[Math.floor(Math.random() * availableChars.length)]
          })
          .join("")
      }
    }

    if (isHovering) {
      setIsScrambling(true)
      interval = setInterval(() => {
        if (sequential) {
          if (revealedIndices.size < text.length) {
            const nextIndex = getNextIndex()
            const newRevealed = new Set(revealedIndices)
            newRevealed.add(nextIndex)
            setRevealedIndices(newRevealed)
            setDisplayText(shuffleText(text))
          } else {
            clearInterval(interval)
            setIsScrambling(false)
          }
        } else {
          setDisplayText(shuffleText(text))
          currentIteration++
          if (currentIteration >= maxIterations) {
            clearInterval(interval)
            setIsScrambling(false)
            setDisplayText(text)
          }
        }
      }, scrambleSpeed)
    } else {
      setDisplayText(text)
      setRevealedIndices(new Set())
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovering, text, characters, scrambleSpeed, useOriginalCharsOnly, sequential, revealDirection, maxIterations])

  return (
    <motion.span
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={cn("inline-block whitespace-pre-wrap", className)}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={cn(revealedIndices.has(index) || !isScrambling || !isHovering ? className : scrambledClassName)}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  )
}

// ScrambleText - triggers scramble animation when text prop changes
export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  scrambleSpeed = 30,
  maxIterations = 12,
  sequential = true,
  revealDirection = "start",
  characters = SCRAMBLE_CHARS,
  className,
  scrambledClassName,
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
  const previousText = useRef(text)
  const maxLength = useRef(text.length)

  useEffect(() => {
    // Only trigger scramble when text actually changes
    if (previousText.current === text) return
    
    previousText.current = text
    maxLength.current = Math.max(maxLength.current, text.length)
    
    let interval: NodeJS.Timeout
    setIsScrambling(true)
    setRevealedIndices(new Set())

    const getNextIndex = (revealed: Set<number>) => {
      const textLength = text.length
      switch (revealDirection) {
        case "start":
          return revealed.size
        case "end":
          return textLength - 1 - revealed.size
        case "center":
          const middle = Math.floor(textLength / 2)
          const offset = Math.floor(revealed.size / 2)
          const nextIndex = revealed.size % 2 === 0 ? middle + offset : middle - offset - 1
          if (nextIndex >= 0 && nextIndex < textLength && !revealed.has(nextIndex)) {
            return nextIndex
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealed.has(i)) return i
          }
          return 0
        default:
          return revealed.size
      }
    }

    const shuffleText = (targetText: string, revealed: Set<number>) => {
      const availableChars = characters.split("")
      return targetText
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (revealed.has(i)) return targetText[i]
          return availableChars[Math.floor(Math.random() * availableChars.length)]
        })
        .join("")
    }

    let currentRevealed = new Set<number>()
    
    interval = setInterval(() => {
      if (sequential) {
        if (currentRevealed.size < text.length) {
          const nextIndex = getNextIndex(currentRevealed)
          currentRevealed = new Set(currentRevealed)
          currentRevealed.add(nextIndex)
          setRevealedIndices(new Set(currentRevealed))
          setDisplayText(shuffleText(text, currentRevealed))
        } else {
          clearInterval(interval)
          setIsScrambling(false)
          setDisplayText(text)
        }
      } else {
        setDisplayText(shuffleText(text, currentRevealed))
      }
    }, scrambleSpeed)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [text, characters, scrambleSpeed, sequential, revealDirection, maxIterations])

  return (
    <motion.span
      className={cn("inline-block whitespace-pre-wrap", className)}
      layout
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              revealedIndices.has(index) || !isScrambling ? className : scrambledClassName
            )}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  )
}


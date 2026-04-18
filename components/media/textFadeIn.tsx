"use client"

import {
    motion,
    useInView,
    type HTMLMotionProps,
    type Transition,
    type UseInViewOptions,
} from "framer-motion"
import * as React from "react"

type WritingTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
    transition?: Transition
    inView?: boolean
    inViewMargin?: UseInViewOptions["margin"]
    inViewOnce?: boolean
    spacing?: number | string
    text?: string
    texts?: string[]
    holdDurationMs?: number
}

function shuffleIndices(count: number) {
    const result = Array.from({ length: count }, (_, index) => index)
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = result[i]
        result[i] = result[j]
        result[j] = temp
    }
    return result
}

const WritingText = React.forwardRef<HTMLSpanElement, WritingTextProps>(function WritingText({
    inView = false,
    inViewMargin = "0px",
    inViewOnce = true,
    spacing = 5,
    text,
    texts,
    holdDurationMs = 3000,
    transition = { type: "spring", bounce: 0, duration: 2, delay: 0.25 },
    ...props
}, ref) {
    const localRef = React.useRef<HTMLSpanElement>(null)
    React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement)

    const inViewResult = useInView(localRef, {
        once: inViewOnce,
        margin: inViewMargin,
    })
    const isInView = !inView || inViewResult

    const lines = React.useMemo(() => {
        if (texts && texts.length > 0) return texts
        if (text) return [text]
        return []
    }, [text, texts])

    const [lineOrder, setLineOrder] = React.useState<number[]>([])
    const [lineOrderIndex, setLineOrderIndex] = React.useState(0)
    const [isSentenceVisible, setIsSentenceVisible] = React.useState(true)

    React.useEffect(() => {
        if (lines.length === 0) {
            setLineOrder([])
            setLineOrderIndex(0)
            return
        }

        if (lines.length === 1) {
            setLineOrder([0])
            setLineOrderIndex(0)
            return
        }

        setLineOrder(shuffleIndices(lines.length))
        setLineOrderIndex(0)
    }, [lines])

    const currentLineIndex = lineOrder[lineOrderIndex] ?? 0
    const currentLine = lines[currentLineIndex] ?? ""
    const words = React.useMemo(() => currentLine.split(" "), [currentLine])

    const transitionDurationSeconds = typeof transition?.duration === "number" ? transition.duration : 0.6
    const wordStaggerSeconds = typeof transition?.delay === "number" ? transition.delay : 0.08
    const revealDurationMs = Math.max(
        0,
        ((Math.max(words.length - 1, 0) * wordStaggerSeconds) + transitionDurationSeconds) * 1000
    )
    const fadeOutDurationMs = 450

    React.useEffect(() => {
        if (!isInView || lines.length <= 1 || lineOrder.length === 0) return

        setIsSentenceVisible(true)

        const fadeOutTimer = window.setTimeout(() => {
            setIsSentenceVisible(false)
        }, revealDurationMs + holdDurationMs)

        const nextLineTimer = window.setTimeout(() => {
            setLineOrderIndex((current) => {
                const next = current + 1
                return next < lineOrder.length ? next : 0
            })
        }, revealDurationMs + holdDurationMs + fadeOutDurationMs)

        return () => {
            window.clearTimeout(fadeOutTimer)
            window.clearTimeout(nextLineTimer)
        }
    }, [fadeOutDurationMs, holdDurationMs, isInView, lineOrder, lineOrderIndex, revealDurationMs])

    return (
        <motion.span
            animate={isInView && isSentenceVisible ? { opacity: 1 } : { opacity: 0 }}
            data-slot="writing-text"
            ref={localRef}
            transition={isSentenceVisible ? {
                ...transition,
                delay: 0,
            } : { type: "tween", ease: "easeIn", duration: fadeOutDurationMs / 1000 }}
            {...props}
        >
            {words.map((word, index) => (
                <motion.span
                    animate={isInView ? { opacity: 1, y: 0 } : undefined}
                    className="inline-block will-change-transform will-change-opacity"
                    initial={{ opacity: 0, y: 10 }}
                    key={`${currentLineIndex}-${lineOrderIndex}-${index}`}
                    style={{ marginRight: spacing }}
                    transition={{
                        ...transition,
                        delay: index * wordStaggerSeconds,
                        y: {
                            delay: index * wordStaggerSeconds,
                            duration: transitionDurationSeconds,
                            ease: [0.16, 1, 0.3, 1],
                            type: "tween",
                        },
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    )
})

export { WritingText, type WritingTextProps }
export default WritingText

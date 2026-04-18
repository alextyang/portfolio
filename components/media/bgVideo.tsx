"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

type BackgroundVideoPlaylistProps = {
    sources: string[]
    className?: string
    poster?: string
    crossFadeMs?: number
    fadeInDelayMs?: number
    loopPlaylist?: boolean
    visible?: boolean
    visibleOnSubPage?: string
}

type PreparedVideo = {
    index: number
    queue: string[]
    slot: 0 | 1
    source: string
} | null

function shuffleSources(sources: string[], avoidFirstSource?: string) {
    const shuffledSources = [...sources]

    for (let index = shuffledSources.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const currentSource = shuffledSources[index]
        shuffledSources[index] = shuffledSources[randomIndex]
        shuffledSources[randomIndex] = currentSource
    }

    if (
        avoidFirstSource &&
        shuffledSources.length > 1 &&
        shuffledSources[0] === avoidFirstSource
    ) {
        const swapIndex = shuffledSources.findIndex((source) => source !== avoidFirstSource)
        if (swapIndex > 0) {
            const firstSource = shuffledSources[0]
            shuffledSources[0] = shuffledSources[swapIndex]
            shuffledSources[swapIndex] = firstSource
        }
    }

    return shuffledSources
}

function getVideoMimeType(source: string) {
    const lowerSource = source.toLowerCase()
    if (lowerSource.endsWith(".mp4")) return "video/mp4"
    if (lowerSource.endsWith(".mov")) return "video/quicktime"
    if (lowerSource.endsWith(".webm")) return "video/webm"
    return undefined
}

function getPreparedVideo(
    queue: string[],
    currentIndex: number,
    activeSlot: 0 | 1,
    allSources: string[],
    loopPlaylist: boolean
): PreparedVideo {
    if (queue.length <= 1) return null

    const nextIndex = currentIndex + 1
    const wrapsQueue = nextIndex >= queue.length
    if (wrapsQueue && !loopPlaylist) return null

    const nextQueue = wrapsQueue ? shuffleSources(allSources, queue[currentIndex]) : queue
    const resolvedIndex = wrapsQueue ? 0 : nextIndex
    const nextSource = nextQueue[resolvedIndex]

    if (!nextSource) return null

    return {
        index: resolvedIndex,
        queue: nextQueue,
        slot: activeSlot === 0 ? 1 : 0,
        source: nextSource,
    }
}

function BackgroundVideoPlaylist({
    sources,
    className,
    poster,
    crossFadeMs = 300,
    fadeInDelayMs = 0,
    loopPlaylist = false,
    visible = true,
    visibleOnSubPage,
}: BackgroundVideoPlaylistProps) {
    const searchParams = useSearchParams()
    const firstVideoRef = React.useRef<HTMLVideoElement>(null)
    const secondVideoRef = React.useRef<HTMLVideoElement>(null)
    const videoRefs = React.useMemo(
        () => [firstVideoRef, secondVideoRef] as const,
        []
    )
    const loadedSourcesRef = React.useRef<[string, string]>(["", ""])

    const [playbackQueue, setPlaybackQueue] = React.useState<string[]>([])
    const [currentQueueIndex, setCurrentQueueIndex] = React.useState(0)
    const [slotSources, setSlotSources] = React.useState<[string, string]>(["", ""])
    const [activeSlot, setActiveSlot] = React.useState<0 | 1>(0)
    const [readySlots, setReadySlots] = React.useState<[boolean, boolean]>([false, false])
    const [preparedVideo, setPreparedVideo] = React.useState<PreparedVideo>(null)
    const [shouldShowVideoLayer, setShouldShowVideoLayer] = React.useState(false)

    const normalizedSources = React.useMemo(
        () => sources.filter((source) => source.trim().length > 0),
        [sources]
    )

    const subPage = searchParams.get("p")
    const shouldBeVisible = visibleOnSubPage ? subPage === visibleOnSubPage && visible : visible

    React.useEffect(() => {
        if (!shouldBeVisible) {
            setShouldShowVideoLayer(false)
            return
        }

        if (fadeInDelayMs <= 0) {
            setShouldShowVideoLayer(true)
            return
        }

        const timeoutId = window.setTimeout(() => {
            setShouldShowVideoLayer(true)
        }, fadeInDelayMs)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [fadeInDelayMs, shouldBeVisible])

    React.useEffect(() => {
        if (normalizedSources.length === 0) {
            setPlaybackQueue([])
            setCurrentQueueIndex(0)
            setSlotSources(["", ""])
            setReadySlots([false, false])
            setActiveSlot(0)
            setPreparedVideo(null)
            setShouldShowVideoLayer(false)
            return
        }

        const nextQueue = shuffleSources(normalizedSources)
        setPlaybackQueue(nextQueue)
        setCurrentQueueIndex(0)
        setSlotSources([nextQueue[0] ?? "", ""])
        setReadySlots([false, false])
        setActiveSlot(0)
        setPreparedVideo(null)
    }, [normalizedSources])

    const activeSlotIsReady = readySlots[activeSlot]
    const shouldRenderVideoLayer = shouldShowVideoLayer && activeSlotIsReady

    React.useEffect(() => {
        const nextPreparedVideo = getPreparedVideo(
            playbackQueue,
            currentQueueIndex,
            activeSlot,
            normalizedSources,
            loopPlaylist
        )
        setPreparedVideo(nextPreparedVideo)

        if (!nextPreparedVideo) {
            setSlotSources((current) => [current[0], current[1]])
            return
        }

        setSlotSources((current) => {
            const nextSources: [string, string] = [...current] as [string, string]
            nextSources[nextPreparedVideo.slot] = nextPreparedVideo.source
            return nextSources
        })
        setReadySlots((current) => {
            const nextReadySlots: [boolean, boolean] = [...current] as [boolean, boolean]
            nextReadySlots[nextPreparedVideo.slot] = false
            return nextReadySlots
        })
    }, [activeSlot, currentQueueIndex, loopPlaylist, normalizedSources, playbackQueue])

    React.useEffect(() => {
        const cleanupCallbacks = videoRefs.map((videoRef, slotIndex) => {
            const video = videoRef.current
            const source = slotSources[slotIndex]
            if (!video || !source) return () => { }

            video.muted = true
            video.defaultMuted = true
            video.playsInline = true
            video.preload = "auto"
            video.setAttribute("muted", "")
            video.setAttribute("playsinline", "")
            video.setAttribute("webkit-playsinline", "")

            const markReady = () => {
                setReadySlots((current) => {
                    if (current[slotIndex as 0 | 1]) return current

                    const nextReadySlots: [boolean, boolean] = [...current] as [boolean, boolean]
                    nextReadySlots[slotIndex as 0 | 1] = true
                    return nextReadySlots
                })
            }

            const tryPlay = async () => {
                if (!shouldBeVisible) return
                if (slotIndex !== activeSlot) return

                try {
                    await video.play()
                } catch {
                    // Autoplay can fail in strict browser settings; keep element mounted.
                }
            }

            const onLoadedData = () => {
                markReady()
            }

            const onLoadedMetadata = () => {
                void tryPlay()
            }

            const onCanPlay = () => {
                void tryPlay()
            }

            video.addEventListener("loadeddata", onLoadedData, { once: true })
            video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true })
            video.addEventListener("canplay", onCanPlay, { once: true })
            if (slotIndex !== activeSlot) {
                video.pause()
            }
            if (loadedSourcesRef.current[slotIndex] !== source) {
                loadedSourcesRef.current[slotIndex] = source
                video.load()
            }
            void tryPlay()

            return () => {
                video.removeEventListener("loadeddata", onLoadedData)
                video.removeEventListener("loadedmetadata", onLoadedMetadata)
                video.removeEventListener("canplay", onCanPlay)
            }
        })

        return () => {
            cleanupCallbacks.forEach((cleanup) => cleanup())
        }
    }, [activeSlot, shouldBeVisible, slotSources, videoRefs])

    React.useEffect(() => {
        let pauseTimeoutId: number | null = null

        videoRefs.forEach((videoRef, slotIndex) => {
            const video = videoRef.current
            if (!video) return

            if (!shouldBeVisible) {
                return
            }

            if (slotIndex === activeSlot) {
                void video.play().catch(() => { })
            }
        })

        if (!shouldBeVisible) {
            pauseTimeoutId = window.setTimeout(() => {
                videoRefs.forEach((videoRef) => {
                    const video = videoRef.current
                    if (!video) return
                    video.pause()
                })
            }, crossFadeMs)
        }

        return () => {
            if (pauseTimeoutId !== null) {
                window.clearTimeout(pauseTimeoutId)
            }
        }
    }, [activeSlot, crossFadeMs, shouldBeVisible, videoRefs])

    const switchToPreparedVideo = React.useCallback(() => {
        if (!preparedVideo) return false
        if (!readySlots[preparedVideo.slot]) return false

        const previousActiveSlot = activeSlot
        const previousVideo = videoRefs[previousActiveSlot].current

        setPlaybackQueue(preparedVideo.queue)
        setCurrentQueueIndex(preparedVideo.index)
        setActiveSlot(preparedVideo.slot)
        setPreparedVideo(null)

        if (previousVideo) {
            previousVideo.pause()
        }

        return true
    }, [activeSlot, preparedVideo, readySlots, videoRefs])

    const handleEnded = React.useCallback(() => {
        if (!shouldBeVisible) return

        const didSwitch = switchToPreparedVideo()
        if (didSwitch) return

        const activeVideo = videoRefs[activeSlot].current
        if (activeVideo) {
            activeVideo.pause()
        }
    }, [activeSlot, shouldBeVisible, switchToPreparedVideo, videoRefs])

    const handleError = React.useCallback(() => {
        if (!shouldBeVisible) return

        const didSwitch = switchToPreparedVideo()
        if (didSwitch) return

        const activeVideo = videoRefs[activeSlot].current
        if (activeVideo) {
            activeVideo.pause()
        }
    }, [activeSlot, shouldBeVisible, switchToPreparedVideo, videoRefs])

    if (playbackQueue.length === 0) return null

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white ${className ?? ""}`}
        >
            <div
                className="absolute inset-0"
                style={{
                    opacity: shouldRenderVideoLayer ? 1 : 0,
                    transition: `opacity ${crossFadeMs}ms ease`,
                    willChange: "opacity",
                }}
            >
                {slotSources.map((source, slotIndex) => {
                    if (!source) return null

                    const isActiveSlot = activeSlot === slotIndex
                    const slotIsReady = readySlots[slotIndex]

                    return (
                        <video
                            key={`${slotIndex}-${source}`}
                            ref={videoRefs[slotIndex]}
                            className="absolute inset-0 h-full w-full object-cover"
                            muted
                            onEnded={isActiveSlot ? handleEnded : undefined}
                            onError={isActiveSlot ? handleError : undefined}
                            playsInline
                            poster={poster}
                            preload="auto"
                            style={{
                                opacity: isActiveSlot && slotIsReady ? 1 : 0,
                                transition: `opacity ${crossFadeMs}ms ease`,
                                willChange: "opacity",
                            }}
                        >
                            <source src={source} type={getVideoMimeType(source)} />
                        </video>
                    )
                })}
            </div>
        </div>
    )
}

export type { BackgroundVideoPlaylistProps }
export default BackgroundVideoPlaylist

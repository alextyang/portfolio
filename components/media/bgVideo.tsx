"use client"

import * as React from "react"

type BackgroundVideoPlaylistProps = {
    sources: string[]
    className?: string
    poster?: string
    crossFadeMs?: number
    visible?: boolean
}

function getVideoMimeType(source: string) {
    const lowerSource = source.toLowerCase()
    if (lowerSource.endsWith(".mp4")) return "video/mp4"
    if (lowerSource.endsWith(".mov")) return "video/quicktime"
    if (lowerSource.endsWith(".webm")) return "video/webm"
    return undefined
}

function BackgroundVideoPlaylist({
    sources,
    className,
    poster,
    crossFadeMs = 300,
    visible = true,
}: BackgroundVideoPlaylistProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isVisible, setIsVisible] = React.useState(false)

    const normalizedSources = React.useMemo(
        () => sources.filter((source) => source.trim().length > 0),
        [sources]
    )

    const activeSource = normalizedSources[currentIndex] ?? ""
    const activeSourceType = React.useMemo(() => getVideoMimeType(activeSource), [activeSource])

    React.useEffect(() => {
        if (normalizedSources.length === 0) return
        setCurrentIndex((current) => (current >= normalizedSources.length ? 0 : current))
    }, [normalizedSources.length])

    React.useEffect(() => {
        const video = videoRef.current
        if (!video || !activeSource) return

        // Reinforce autoplay requirements for Safari/iOS and strict policies.
        video.muted = true
        video.defaultMuted = true
        video.playsInline = true
        video.setAttribute("muted", "")
        video.setAttribute("playsinline", "")
        video.setAttribute("webkit-playsinline", "")

        setIsVisible(false)
        video.load()

        const onLoadedData = () => {
            setIsVisible(true)
        }

        const tryPlay = async () => {
            try {
                await video.play()
            } catch {
                // Autoplay can fail in strict browser settings; keep element mounted.
            }
        }

        const onCanPlay = () => {
            void tryPlay()
        }

        const onLoadedMetadata = () => {
            void tryPlay()
        }

        video.addEventListener("loadeddata", onLoadedData, { once: true })
        video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true })
        video.addEventListener("canplay", onCanPlay, { once: true })
        void tryPlay()

        return () => {
            video.removeEventListener("loadeddata", onLoadedData)
            video.removeEventListener("loadedmetadata", onLoadedMetadata)
            video.removeEventListener("canplay", onCanPlay)
        }
    }, [activeSource])

    const handleEnded = React.useCallback(() => {
        if (normalizedSources.length <= 1) {
            const video = videoRef.current
            if (video) {
                video.currentTime = 0
                void video.play().catch(() => { })
            }
            return
        }
        setCurrentIndex((current) => (current + 1) % normalizedSources.length)
    }, [normalizedSources.length])

    if (normalizedSources.length === 0) return null

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 -z-20 overflow-hidden ${className ?? ""}`}
        >
            <video
                ref={videoRef}
                autoPlay
                className="h-full w-full object-cover"
                muted
                onEnded={handleEnded}
                playsInline
                poster={poster}
                preload="auto"
                style={{
                    opacity: isVisible && visible ? 1 : 0,
                    transition: `opacity ${crossFadeMs}ms ease`,
                }}
            >
                <source src={activeSource} type={activeSourceType} />
            </video>
        </div>
    )
}

export type { BackgroundVideoPlaylistProps }
export default BackgroundVideoPlaylist

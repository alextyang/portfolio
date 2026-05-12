"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type GlassBackgroundProps = {
    containerId: string;
    className?: string;
    topOffsetPx?: number;
    visible?: boolean;
    visibleOnSubPage?: string;
    fadeOutDelayMs?: number;
};

export default function GlassBackground({
    containerId,
    className = "",
    topOffsetPx = 40,
    visible = true,
    visibleOnSubPage,
    fadeOutDelayMs = 0,
}: GlassBackgroundProps) {
    const searchParams = useSearchParams();
    const backgroundRef = useRef<HTMLDivElement>(null);
    const isTopFillModeRef = useRef(false);
    const subPage = searchParams.get("p");
    const isVisible = visibleOnSubPage ? subPage === visibleOnSubPage && visible : visible;
    const [isDisplayed, setIsDisplayed] = useState(isVisible);

    useEffect(() => {
        let timeoutId: number;

        if (isVisible) {
            timeoutId = window.setTimeout(() => {
                setIsDisplayed(true);
            }, 0);

            return () => {
                window.clearTimeout(timeoutId);
            };
        }

        timeoutId = window.setTimeout(() => {
            setIsDisplayed(false);
        }, fadeOutDelayMs <= 0 ? 0 : fadeOutDelayMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [fadeOutDelayMs, isVisible]);

    useEffect(() => {
        const updateBackgroundHeight = () => {
            const container = document.getElementById(containerId);

            if (!container || !backgroundRef.current) return;

            const backgroundRect = backgroundRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const widthGap = viewportWidth - backgroundRect.width;
            const enterTopFillGap = 8;
            const exitTopFillGap = 20;
            const fillsViewportWidth = isTopFillModeRef.current
                ? widthGap <= exitTopFillGap
                : widthGap <= enterTopFillGap;
            isTopFillModeRef.current = fillsViewportWidth;
            const containerTop = container.getBoundingClientRect().top + window.scrollY;
            const backgroundTop = fillsViewportWidth ? 0 : containerTop - topOffsetPx;
            const pageBottom = document.documentElement.scrollHeight;

            backgroundRef.current.style.top = fillsViewportWidth ? `${-containerTop}px` : `-${topOffsetPx}px`;
            backgroundRef.current.style.height = `${Math.max(pageBottom - backgroundTop, 0)}px`;
        };

        updateBackgroundHeight();
        window.addEventListener("resize", updateBackgroundHeight);

        const observer = new ResizeObserver(updateBackgroundHeight);
        observer.observe(document.body);

        return () => {
            window.removeEventListener("resize", updateBackgroundHeight);
            observer.disconnect();
        };
    }, [containerId, topOffsetPx]);

    return (
        <div
            ref={backgroundRef}
            className={`${className} transition-[top,height,opacity] duration-300 ease-out ${isDisplayed ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
    );
}

"use client";

import { useEffect, useState } from "react";


export function TimeSavedEstimate() {
    const [timeSaved, setTimeSaved] = useState<string>('');

    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const tick = () => setNow(new Date());
        const interval = setInterval(tick, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const minutesSavedPerEmail = 75;
        const emailsPerWeek = 16;
        const startDate = new Date('2025-04-15');

        const weeksElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
        const totalMinutesSaved = minutesSavedPerEmail * emailsPerWeek * weeksElapsed;
        const hours = Math.floor(totalMinutesSaved / 60);
        const minutes = Math.floor(totalMinutesSaved % 60);

        setTimeSaved(`${hours.toLocaleString()} hours ${minutes} minutes`);
    }, [now]);

    const dateString = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <span className="sans opacity-100 font-[350]! text-lg bg-gray-100 px-2 -mt-6.5! -mb-1.5! block w-fit">
            {`Est. `}<b>{timeSaved}</b>{` saved as of `}<b>{dateString}{` at ${timeString}`}</b>
        </span>
    )

}

export function HoursSavedSnippet() {
    const [hours, setHours] = useState<string>('');
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const tick = () => setNow(new Date());
        const interval = setInterval(tick, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const minutesSavedPerEmail = 75;
        const emailsPerWeek = 16;
        const startDate = new Date('2025-04-15');

        const weeksElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
        const totalMinutesSaved = minutesSavedPerEmail * emailsPerWeek * weeksElapsed;

        setHours(Math.floor(totalMinutesSaved / 60).toLocaleString());
    }, [now]);

    return <>{hours}</>;
}


export function ErrorsSavedEstimate() {
    const [now, setNow] = useState<Date>(new Date());

    const dateString = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            {`Estimated `} <b>{<IncidentsSavedSnippet />}</b>{` production incidents prevented as of `} <b>{dateString}</b>
        </>
    )

}

export function ErrorsSavedSnippet() {
    const [errorsSaved, setErrorsSaved] = useState<string>('');
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const errorsSavedPerWeek = 3.875;
        const startDate = new Date('2025-04-15');

        const weeksElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
        const totalErrorsSaved = Math.floor(errorsSavedPerWeek * weeksElapsed);

        setErrorsSaved(totalErrorsSaved.toLocaleString());
    }, [now]);

    return <>{errorsSaved}</>;
}

export function IncidentsSavedSnippet() {
    const [errorsSaved, setErrorsSaved] = useState<string>('');
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const errorsSavedPerWeek = 0.5825;
        const startDate = new Date('2025-04-15');

        const weeksElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
        const totalErrorsSaved = Math.floor(errorsSavedPerWeek * weeksElapsed);

        setErrorsSaved(totalErrorsSaved.toLocaleString());
    }, [now]);

    return <>{errorsSaved}</>;
}
"use client";

import { SegmentedControl } from "@mantine/core";
import React from "react";

export function SegmentedContent({ segments, labels }: { segments: React.ReactNode[], labels: string[] }) {
    const [activeIndex, setActiveIndex] = React.useState(0);

    return (
        <div className="w-full sans ">
            <SegmentedControl defaultValue={labels[0]} data={labels} withItemsBorders={false} onChange={(v) => {
                const index = labels.indexOf(v);
                if (index !== -1) setActiveIndex(index);
            }} classNames={{ 'root': 'p-0! overflow-visible!', 'label': 'font-light! opacity-80 !p-0.5 !mr-3', 'indicator': ' shadow-none! border-b-1 rounded-none! border-[var(--underline-color)]' }} size="sm" bg='none' />
            <div className="">
                {segments[activeIndex] ?? null}
            </div>
        </div>
    );
}  
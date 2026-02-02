"use client";

import { useEffect } from "react";

export function VideoSync({ leaderID, followerIDs }: { leaderID: string; followerIDs: string[] }) {
    useEffect(() => {
        const leader = document.getElementById(leaderID) as HTMLVideoElement | null;
        const followers = followerIDs.map((id) => document.getElementById(id) as HTMLVideoElement | null).filter((el): el is HTMLVideoElement => el !== null);

        if (!leader || followers.length === 0) return;

        const syncFollowers = () => {
            followers.forEach((follower) => {
                if (Math.abs(follower.currentTime - leader.currentTime) > 0.3) {
                    follower.currentTime = leader.currentTime;
                }
                if (leader.paused && !follower.paused) {
                    follower.pause();
                } else if (!leader.paused && follower.paused) {
                    follower.play();
                }
            });
        };

        leader.addEventListener('timeupdate', syncFollowers);
        leader.addEventListener('play', syncFollowers);
        leader.addEventListener('pause', syncFollowers);

        return () => {
            leader.removeEventListener('timeupdate', syncFollowers);
            leader.removeEventListener('play', syncFollowers);
            leader.removeEventListener('pause', syncFollowers);
        };
    }, [leaderID, followerIDs]);

    return null;
}
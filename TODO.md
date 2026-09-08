# Portfolio roadmap

## Local Git cleanup — completed 2026-09-08
- [x] Inspect object storage and working changes.
- [x] Back up and checksum-verify original .git on Portable Drive.
- [x] Expire unreachable reflog entries and garbage-collect/repack.
- [x] Verify all pre-existing working-file hashes, status, index, HEAD, and refs unchanged.
- [x] Run full Git integrity check successfully.
- [x] Record reduction from 2,018,568 KiB to 1,393,048 KiB: 610.86 MiB recovered.

## Recovery
Original Git metadata: `/Volumes/Portable Drive/Backups/portfolio-git-2026-09-08/.git`. No remote push or shared-history rewrite. These AGENTS.md and TODO.md files are the only new working-tree changes introduced by this task.

## GitHub archive and metadata removal — 2026-09-08
- [x] User authorized publishing local work and recovery history, then removing local Git metadata and its SSD backup.
- [ ] Archive current work on GitHub branch `archive/local-work-2026-09-08`.
- [ ] Preserve complete recovery history as a downloadable Git bundle in the GitHub storage archive release.
- [ ] Verify remote archives, then remove local .git and the SSD backup.
Working files remain in this directory; use a fresh clone to resume Git development afterward.

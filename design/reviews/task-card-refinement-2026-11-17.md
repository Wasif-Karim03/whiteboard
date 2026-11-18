# Restrained Today task card

Chosen by Codex under owner delegation, 17 November 2026.

The owner supplied a dark-mode Today screenshot and identified the teal left stripe as unwanted decoration. Removed the 4-pixel accent edge from `.wb-priority`; the card now has the same subtle border on all sides. Changed its “Your next step” label from accent text to secondary text. Existing spacing, title, due time, status, action, focus indicators and behavior remain.

The nearby source audit found no other decorative task-card edge using this treatment. Calendar edges identify courses with matching text labels; they remain semantic calendar information.

Proof: 508 Node tests pass; both legacy commands pass in the disposable copy; build and size checks pass. The combined check is recorded in `design/final/dist/verification.json` and root NOTES section 0. No new test was added for this reversible CSS-only adjustment.

Built app: 790390 bytes, SHA-256 `4066b1f4b6f106e2cf776b35c1b4e83c120c8b1eebc4e6953ff993687393ef93`.
Built board: 772285 bytes, SHA-256 `7364d7266941d4c0a8ccac1498bbbf5869d4cfb2073d33e6ce26482dff826e11`.
Static spec remains byte-identical at 1011283 bytes.

Source checks are not a rendered visual check. The supplied screenshot was reviewed; the rebuilt card has not been browser-verified. Existing file-access restrictions were respected and all formal owner acceptance rows remain Not run.

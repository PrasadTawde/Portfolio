/**
 * The site's one motion-easing curve, used by every hand-rolled transition
 * (intro veil, route wipe, section/hero reveals). Keep `--ease-out` in
 * globals.css equal to this value — CSS and TS can't share a literal, so
 * this is the canonical copy for JS/TSX and that's the canonical copy for
 * plain CSS (the `.anim-rise` keyframe).
 */
export const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

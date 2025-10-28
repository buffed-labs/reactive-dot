---
"@reactive-dot/react": patch
---

Added default `Suspense` boundary to `ReactiveDotProvider` to prevent possible infinite loops when consumers forget to add a root boundary.

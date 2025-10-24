---
"@reactive-dot/react": patch
---

Improved `usePromiseState`:

- Skip extra render when Promise is already fulfilled
- Set fallback value in render rather than part of side effect

---
theme: monomi
layout: default
---

# Dark or Light?

What theme should we use during this presentation?

<br />

```ts
const room = document.querySelector('.room');
const lightVotes = room.querySelectorAll('.raised-hand.light').length;
const darkVotes = room.querySelectorAll('.raised-hand.dark').length;

// Set the theme based on the preference
if (darkVotes > lightVotes) {
    setTheme('dark');
} else {
    setTheme('light');
}
```

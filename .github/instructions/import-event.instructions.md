---
applyTo: "data-entry/data.json"
---

I will send in chat one or more links, please fetch them one by one and read the content.
Each link is the homepage of a tech event and you should find the information needed to fill the data.json file for each event.

If you see that the link I sent you is not an event but a list of events, try to find the individual event pages and extract the information from there. Use the real event links, not the aggregator link.

## data.json structure

- The file must contain an array of events (objects)
- If it's empty, create an the array with a single event object, if it already has data, append the new event to the existing array.

### Event structure

Keep in mind that events will be parsed using this Zod schema so make sure to fill the fields accordingly:

```typescript
import { z } from "zod"

export const CreateEventSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  eventUrl: z.string().url().nullish(),
  date: z.string().date(),
  dateEnd: z.string().date().nullish(),
  cfpUrl: z.string().url().nullish(),
  mode: z.union([
    z.literal("in-person"),
    z.literal("hybrid"),
    z.literal("online"),
  ]),
  country: z.string().nullish(),
  city: z.string().nullish(),
  cfpClosingDate: z.string().date().nullish(),
  tags: z.array(z.string()),
})
```

### Tags

Keep tags between 0 and 5, if you find more than 5 tags, choose the most relevant ones.

Tags must be all lowercase.

Do not use "conference", "event" or similar terms that are not specific to the technology or topic being discussed.

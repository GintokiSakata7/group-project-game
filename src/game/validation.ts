import { z } from 'zod';
import type { GameEvent } from './types';

const EventSchema = z.object({
  id: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  character: z.string().min(1),
  characterRole: z.string().min(1),
  choices: z.array(z.object({ id: z.string().min(1), label: z.string().min(1), hint: z.string().min(1) })).min(2),
});

export function validateGameEvent(event: GameEvent): GameEvent {
  return EventSchema.parse(event) as GameEvent;
}

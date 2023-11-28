import { initTRPC } from '@trpc/server';
import { ControllerDataSchema } from './controller.js';

const t = initTRPC.create();

export const router = t.router({
  controller_data: t.procedure.input(ControllerDataSchema).query(({ input }) => {
    console.log(input);
    return input;
  })
});

export type RobotRouter = typeof router;

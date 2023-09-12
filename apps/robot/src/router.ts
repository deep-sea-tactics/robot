import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

const router = t.router({

});

export type RobotRouter = typeof router;

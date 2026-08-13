import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("vocabulary.generateExampleSentence", () => {
  it("rejects unsupported category input before calling the model", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    await expect(caller.vocabulary.generateExampleSentence({
      word: "clear",
      meaning: "easy to understand",
      partOfSpeech: "adjective",
      category: "Literary" as "Everyday",
    })).rejects.toThrow();
  });
});

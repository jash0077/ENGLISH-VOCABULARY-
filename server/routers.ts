import { COOKIE_NAME } from "@shared/const";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const sentenceInput = z.object({
  word: z.string().trim().min(1).max(80),
  meaning: z.string().trim().min(1).max(300),
  partOfSpeech: z.string().trim().min(1).max(40),
  category: z.enum(["Everyday", "Academic", "Business"]),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  vocabulary: router({
    generateExampleSentence: publicProcedure.input(sentenceInput).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You create concise, natural English learning examples. Return only the requested JSON. Use everyday clarity unless the category requires academic or business context. Never use slang, idioms that obscure meaning, or unsafe content.",
          },
          {
            role: "user",
            content: `Create one short example sentence for the vocabulary word \"${input.word}\". Meaning: ${input.meaning}. Part of speech: ${input.partOfSpeech}. Learning category: ${input.category}. The sentence must use the word naturally, be 8–20 words, and make the meaning clear. Also provide a brief learner tip.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "vocabulary_example",
            strict: true,
            schema: {
              type: "object",
              properties: {
                sentence: { type: "string", description: "One natural example sentence." },
                tip: { type: "string", description: "A brief usage tip for the learner." },
              },
              required: ["sentence", "tip"],
              additionalProperties: false,
            },
          },
        },
        maxTokens: 220,
      });

      const content = response.choices[0]?.message.content;
      if (typeof content !== "string") throw new Error("The sentence generator returned no text.");
      const parsed = JSON.parse(content) as { sentence?: unknown; tip?: unknown };
      if (typeof parsed.sentence !== "string" || typeof parsed.tip !== "string") throw new Error("The sentence generator returned an invalid response.");
      return { sentence: parsed.sentence.trim(), tip: parsed.tip.trim() };
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

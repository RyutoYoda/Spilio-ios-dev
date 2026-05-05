import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { transcribeAudio } from "./_core/voiceTranscription";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  diary: router({
    analyze: publicProcedure
      .input(z.object({ audioUrl: z.string() }))
      .mutation(async ({ input }) => {
        // Step 1: Transcribe audio to text
        const transcription = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: "en",
          prompt: "Transcribe this English diary entry about daily activities",
        });

        if ("error" in transcription) {
          throw new Error(`Transcription failed: ${transcription.error}`);
        }

        const transcript = transcription.text;

        // Step 2: Analyze with LLM for grammar, corrections, and scoring
        const analysisResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an English language teacher analyzing a student's spoken English diary entry. 
Analyze the text for grammar errors, unnatural expressions, and provide scores.
Return JSON with this exact structure:
{
  "corrections": [
    {
      "original": "the incorrect phrase",
      "corrected": "the correct phrase",
      "explanation": "brief explanation in Japanese"
    }
  ],
  "grammarScore": 0-100,
  "pronunciationScore": 0-100,
  "fluencyScore": 0-100,
  "overallScore": 0-100,
  "feedback": "brief encouraging feedback in Japanese"
}

Scoring guidelines:
- grammarScore: Based on grammatical accuracy (fewer errors = higher score)
- pronunciationScore: Estimate based on word choices and sentence structure clarity (since we only have text, estimate from how clear/standard the expressions are)
- fluencyScore: Based on sentence flow, natural word order, and expression variety
- overallScore: Weighted average of the above

Be encouraging but honest. If the text is very short, still provide scores but note it in feedback.
If there are no errors, return empty corrections array and high scores.`,
            },
            {
              role: "user",
              content: `Please analyze this English diary entry:\n\n"${transcript}"`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const analysisText = analysisResponse.choices[0].message.content as string;
        const analysis = JSON.parse(analysisText);

        return {
          transcript,
          corrections: analysis.corrections || [],
          grammarScore: analysis.grammarScore || 50,
          pronunciationScore: analysis.pronunciationScore || 50,
          fluencyScore: analysis.fluencyScore || 50,
          overallScore: analysis.overallScore || 50,
          feedback: analysis.feedback || "",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

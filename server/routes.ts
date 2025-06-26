import type { Express } from "express";
import { createServer } from "http";
import { db } from "./db";
import { quizzes, quiz_questions, question_options, quiz_participants, participant_answers, style_results, style_types, utm_analytics } from "../shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { seedDatabase } from "./seedData";

export function registerRoutes(app: Express) {
  // Initialize database with seed data
  app.get("/api/init", async (req, res) => {
    try {
      const quiz = await seedDatabase();
      res.json({ message: "Database initialized", quiz_id: quiz.id });
    } catch (error) {
      console.error("Error initializing database:", error);
      res.status(500).json({ error: "Erro ao inicializar banco de dados" });
    }
  });
  // Quiz routes - Get quiz by ID or default quiz
  app.get("/api/quiz/:id", async (req, res) => {
    try {
      let quizId = req.params.id;
      
      // If ID is just a number, get the most recent quiz (default behavior)
      if (quizId === "1" || !quizId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const defaultQuiz = await db.select().from(quizzes).orderBy(desc(quizzes.created_at)).limit(1);
        if (!defaultQuiz.length) {
          // Initialize database if no quiz exists
          const quiz = await seedDatabase();
          return res.json(quiz);
        }
        return res.json(defaultQuiz[0]);
      }
      
      const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
      
      if (!quiz.length) {
        return res.status(404).json({ error: "Quiz não encontrado" });
      }
      
      res.json(quiz[0]);
    } catch (error) {
      console.error("Erro ao buscar quiz:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Quiz questions routes - Get questions for quiz
  app.get("/api/quiz/:id/questions", async (req, res) => {
    try {
      let quizId = req.params.id;
      
      // If ID is just a number, get questions from the first quiz
      if (quizId === "1" || !quizId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const defaultQuiz = await db.select().from(quizzes).limit(1);
        if (!defaultQuiz.length) {
          return res.status(404).json({ error: "Quiz não encontrado" });
        }
        quizId = defaultQuiz[0].id;
      }
      
      const questions = await db
        .select()
        .from(quiz_questions)
        .where(eq(quiz_questions.quiz_id, quizId))
        .orderBy(quiz_questions.order_index);
      
      res.json(questions);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Question options routes
  app.get("/api/question/:id/options", async (req, res) => {
    try {
      const questionId = req.params.id;
      const options = await db
        .select()
        .from(question_options)
        .where(eq(question_options.question_id, questionId))
        .orderBy(question_options.order_index);
      
      res.json(options);
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get quiz questions with options (optimized endpoint)
  app.get("/api/quiz/:id/questions-with-options", async (req, res) => {
    try {
      let quizId = req.params.id;
      
      // If ID is just a number, get questions from the first quiz
      if (quizId === "1" || !quizId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const defaultQuiz = await db.select().from(quizzes).limit(1);
        if (!defaultQuiz.length) {
          return res.status(404).json({ error: "Quiz não encontrado" });
        }
        quizId = defaultQuiz[0].id;
      }
      
      const questions = await db
        .select({
          id: quiz_questions.id,
          title: quiz_questions.title,
          type: quiz_questions.type,
          order_index: quiz_questions.order_index,
          required_selections: quiz_questions.required_selections,
          active: quiz_questions.active
        })
        .from(quiz_questions)
        .where(eq(quiz_questions.quiz_id, quizId))
        .orderBy(quiz_questions.order_index);

      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await db
            .select()
            .from(question_options)
            .where(eq(question_options.question_id, question.id))
            .orderBy(question_options.order_index);
          
          return {
            ...question,
            options
          };
        })
      );
      
      res.json(questionsWithOptions);
    } catch (error) {
      console.error("Erro ao buscar questões com opções:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Submit quiz answers
  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { participantData, answers } = req.body;
      
      // Create participant
      const [participant] = await db
        .insert(quiz_participants)
        .values({
          quiz_id: participantData.quiz_id,
          name: participantData.name,
          email: participantData.email,
          utm_source: participantData.utm_source,
          utm_medium: participantData.utm_medium,
          utm_campaign: participantData.utm_campaign,
        })
        .returning();

      // Insert answers
      const answerInserts = answers.map((answer: any) => ({
        participant_id: participant.id,
        question_id: answer.question_id,
        option_id: answer.option_id,
        points: answer.points,
      }));

      await db.insert(participant_answers).values(answerInserts);

      // Calculate style results
      const styleResults = await calculateStyleResults(participant.id);
      
      res.json({ participant_id: participant.id, results: styleResults });
    } catch (error) {
      console.error("Erro ao submeter quiz:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get style types
  app.get("/api/styles", async (req, res) => {
    try {
      const styles = await db.select().from(style_types);
      res.json(styles);
    } catch (error) {
      console.error("Erro ao buscar estilos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/utm", async (req, res) => {
    try {
      const analytics = await db
        .select({
          utm_source: utm_analytics.utm_source,
          utm_medium: utm_analytics.utm_medium,
          utm_campaign: utm_analytics.utm_campaign,
          count: sql<number>`count(*)`,
        })
        .from(utm_analytics)
        .groupBy(utm_analytics.utm_source, utm_analytics.utm_medium, utm_analytics.utm_campaign)
        .orderBy(desc(sql`count(*)`));
      
      res.json(analytics);
    } catch (error) {
      console.error("Erro ao buscar analytics UTM:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function calculateStyleResults(participantId: string) {
  // Get all answers for this participant
  const answers = await db
    .select({
      option_id: participant_answers.option_id,
      points: participant_answers.points,
      style_code: question_options.style_code,
    })
    .from(participant_answers)
    .innerJoin(question_options, eq(participant_answers.option_id, question_options.id))
    .where(eq(participant_answers.participant_id, participantId));

  // Calculate points per style
  const stylePoints: Record<string, number> = {};
  
  answers.forEach(answer => {
    if (answer.style_code) {
      stylePoints[answer.style_code] = (stylePoints[answer.style_code] || 0) + (answer.points || 0);
    }
  });

  // Calculate total points
  const totalPoints = Object.values(stylePoints).reduce((sum, points) => sum + points, 0);

  // Create style results
  const results = [];
  let rank = 1;
  
  const sortedStyles = Object.entries(stylePoints)
    .sort(([, a], [, b]) => b - a);

  for (const [styleId, points] of sortedStyles) {
    const percentage = totalPoints > 0 ? (points / totalPoints) * 100 : 0;
    const isPrimary = rank === 1;

    const result = {
      participant_id: participantId,
      style_type_id: styleId,
      points,
      percentage: percentage.toFixed(2),
      rank,
      is_primary: isPrimary,
    };

    await db.insert(style_results).values(result);
    results.push(result);
    rank++;
  }

  return results;
}
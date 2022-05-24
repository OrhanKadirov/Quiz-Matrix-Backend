import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const PORT = process.env.PORT;
const app = express();
app.use(cors());

const quizSchema = new mongoose.Schema({
  category: String,
  question: String,
  correct_answer: String,
  incorrect_answers1: String,
  incorrect_answers2: String,
});

const Quiz = mongoose.model("Quiz", quizSchema, "quiz");

app.get("/quiz/api", async (req, res) => {
  try {
    const quizes = await Quiz.find();
    res.json(quizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(process.env.MONGO_CONECTION).then(() => {
  app.listen(PORT, () => {
    console.log(`Quiz API is listening on port http://localhost:${PORT}`);
  });
});

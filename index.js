import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const PORT = process.env.PORT;
const app = express();
app.use(cors());

const quizSchema = new mongoose.Schema({
  category: "Entertainment: Video Games",
  question: "Peter Molyneux was the founder of Bullfrog Productions.",
  correct_answer: "True",
  incorrect_answers: ["False"],
});

const Quiz = mongoose.model("Quiz", quizSchema, "quiz");

app.use("/", async (req, res) => {
  try {
    const quizes = await Quiz.find().exec();
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

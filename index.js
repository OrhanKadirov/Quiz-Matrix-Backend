import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

const userSchema = new mongoose.Schema({
  users: [{ username: String, password: String }],
});

const Quiz = mongoose.model("Quiz", quizSchema, "quiz");

const User = mongoose.model("User", userSchema, "user");

app.get("/quiz/api", async (req, res) => {
  try {
    const quizes = await Quiz.find();
    res.json(quizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/signup"),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      if (
        !username ||
        username.length < 5 ||
        !password ||
        password.length < 5
      ) {
        return res.status(400).json({ error: "inwalid input" });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      //Save data
      const user = new User({
        username,
        passwordHash,
      });
      return res.json({ msg: "Sign Up" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "server erorr" });
    }
  };

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || username.length < 5 || !password || password.length < 5) {
      return res.status(400).json({ error: "inwalid input" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(400).json({ error: "password does not match" });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: 60,
    });
    return res.json({ msg: "Sign In" });
  } catch (error) {
    return res.status(500).json({ error: "server erorr" });
  }
};

const getProfile = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ decoded });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ erroer: "Invalid token" });
  }

  return res.json({ msg: "Ich bin die profile route" });
};

app.post("/quiz/user", async (req, res) => {
  try {
    const user = await Quiz.find();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(process.env.MONGO_CONECTION).then(() => {
  app.listen(PORT, () => {
    console.log(`Quiz API is listening on port http://localhost:${PORT}`);
  });
});

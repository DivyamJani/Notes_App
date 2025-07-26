import express from "express";
import Note from "../models/Note.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json({ notes });
});

router.post("/", isAuthenticated, async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user._id });
  res.status(201).json({ note });
});

router.put("/:id", isAuthenticated, async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json({ note });
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(204).end();
});

export default router;

import { renameSync, mkdirSync, existsSync, unlinkSync } from "fs";
import Story from "../models/story.model.js";
import Auth from "../models/user.model.js";

export const getStorys = async (req, res) => {
  const { userId } = req;
  const { page = 1, limit = 10 } = req.query;

  try {
    const user = await Auth.findById(userId);

    const skip = (page - 1) * limit;

    const storys = await Story.find({
      isActive: true,
      $or: [
        { author: { $in: user.followers } },
        { author: { $in: user.following } },
        { author: userId },
      ],
    })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "author",
        select: "-password",
      })
      .populate({
        path: "viewers.user",
        select: "-password",
      })
      .populate({
        path: "likes",
        select: "-password",
      });

    const now = Date.now();
    for (let story of storys) {
      if (now > story.expiresAt) {
        story.isActive = false;
        await story.save();
      }
    }

    const totalStories = await Story.countDocuments({
      isActive: true,
      $or: [
        { author: { $in: user.followers } },
        { author: { $in: user.following } },
        { author: userId },
      ],
    });

    res.json({
      success: true,
      data: storys,
      pagination: {
        totalStories,
        currentPage: Number(page),
        totalPages: Math.ceil(totalStories / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Get Story Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const uploadFile = async (req, res) => {
  const { file } = req;
  try {
    const uploadDir = "uploads/storys";
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const date = new Date();

    const formattedDate =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}_` +
      `${String(date.getHours()).padStart(2, "0")}-${String(
        date.getMinutes()
      ).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}`;

    const fileName = `${uploadDir}/photo_${formattedDate}_${file.originalname}`;

    renameSync(file.path, fileName);

    return res.json({ url: fileName });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Delete Story Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addStory = async (req, res) => {
  const { userId } = req;
  const { mediaUrl, mediaType, labels } = req.body;
  try {
    if (!mediaUrl || !mediaType) {
      return res
        .status(400)
        .json({ error: "Media url and media type are required." });
    }

    if (!existsSync(mediaUrl)) {
      return res.status(404).json({ error: "Media url not found." });
    }

    await Story.create({
      author: userId,
      mediaType,
      mediaUrl,
      labels,
    });

    res.json({ message: "Story created succesfuly." });
  } catch (error) {
    if (error.name === "ValidationError") {
      console.log(error);

      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Delete Story Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addLike = async (req, res) => {
  const { userId } = req;
  const { storyId } = req.body;
  try {
    if (!storyId) {
      return res.status(400).json({ error: "Story id is required." });
    }

    const story = await Story.findById(storyId);

    const index = story.likes.indexOf(userId);

    if (index > -1) {
      story.likes.slice(index, 1);
      await story.save();
      return res.json({ message: "Your like was removed." });
    } else {
      story.likes.push(userId);
    }

    await story.save();
    res.json({ message: "Your like was added." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Delete Story Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addStoryView = async (req, res) => {
  const { userId } = req;
  const { storyId, reaction } = req.body;

  try {
    if (!storyId) {
      return res.status(400).json({ error: "Story ID is required." });
    }

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }

    const viewerIndex = story.viewers.findIndex(
      (view) => view.user.toString() === userId.toString()
    );

    if (viewerIndex === -1) {
      story.viewers.push({ user: userId, reaction });
    } else if (reaction) {
      story.viewers[viewerIndex].reaction = reaction;
    }

    await story.save();

    res.json({ message: "Successfully added/updated view." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Add Story View Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

import { Comment, Publications } from "../models/publications.model.js";
import { renameSync, mkdirSync, existsSync, unlinkSync } from "fs";

const checkImage = (filePath) => {
  const imageRegex = /\.(jpg|png|jpeg|gif|tiff|bmp|webp|ico|heif)$/i;
  return imageRegex.test(filePath);
};

export const getPublications = async (req, res) => {
  try {
    const data = await Publications.find()
      .populate({ path: "author", select: "-password" })
      .populate({ path: "sevedPople", select: "-password" })
      .populate({ path: "likes", select: "-password" })
      .populate({
        path: "author",
        select: "-password", // Ensure the author data is selected as needed
        populate: [
          {
            path: "followers",
            select: "-password -followers -following",
          },
          {
            path: "following",
            select: "-password -followers -following",
          },
        ],
      });

    res.json(data);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getPublicationComment = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { publicationId } = req.body;

  try {
    const skip = (page - 1) * limit;

    if (!publicationId) {
      return res.status(400).json({ error: "Publication id is reqiured!" });
    }

    const comments = await Comment.find({ publicationId })
      .populate({
        path: "sender",
        select: "-password",
        populate: {
          path: "followers",
          select: "-password -followers -following",
        },
        populate: {
          path: "following",
          select: "-password -followers -following",
        },
      })
      .populate({ path: "likes", select: "-password" })
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "-password",
          populate: {
            path: "followers",
            select: "-password -followers -following",
          },
          populate: {
            path: "following",
            select: "-password -followers -following",
          },
        },
        populate: {
          path: "likes",
          select: "-password",
        },
        populate: {
          path: "user",
          select: "-password",
          populate: {
            path: "followers",
            select: "-password -followers -following",
          },
          populate: {
            path: "following",
            select: "-password -followers -following",
          },
        },
      })
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const totalComments = await Comment.countDocuments();

    res.json({
      success: true,
      data: comments,
      pagination: {
        totalComments,
        currentPage: Number(page),
        totalPages: Math.ceil(totalComments / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadFile = (req, res) => {
  const files = req.files;
  try {
    const uploadDir = "uploads/publications";
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const fileNames = files.map((file) => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);

      const date = new Date();

      const formattedDate =
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}_` +
        `${String(date.getHours()).padStart(2, "0")}-${String(
          date.getMinutes()
        ).padStart(2, "0")}-${String(date.getSeconds()).padStart(
          2,
          "0"
        )}-${randomNum}`;

      const fileName = `${uploadDir}/${
        checkImage(file.originalname) ? `photo_` : "file_"
      }${formattedDate}_${file.originalname}`;

      renameSync(file.path, fileName);

      return { url: fileName };
    });

    res.json(fileNames);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addPublication = async (req, res) => {
  const { content, hideLike, isComment, location } = req.body;
  const { userId } = req;

  try {
    if (!content || content.length === 0) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    let errors = [];

    content.forEach((item) => {
      if (!existsSync(item.file)) {
        errors.push(`File not found: ${item.file}`);
      }
      if (item.fileType === "video" && !item.coverPhoto) {
        errors.push(`Cover photo is missing for video file: ${item.file}`);
      } else if (
        item.fileType === "video" &&
        item.coverPhoto &&
        !existsSync(item.coverPhoto)
      ) {
        errors.push(`Cover photo file not found: ${item.coverPhoto}`);
      }
    });

    if (errors.length > 0) {
      return res.status(404).json({ error: errors.join(", ") });
    }

    // Create the publication
    await Publications.create({
      author: userId,
      content,
      hideLike: hideLike !== undefined ? hideLike : true,
      isComment: isComment !== undefined ? isComment : true,
      location,
    });

    return res.json({
      success: true,
      message: "Publication created successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Publication Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addPublicationContent = async (req, res) => {
  const { userId } = req;
  const {
    publicationId,
    file,
    fileType,
    audio,
    label,
    comment,
    coverPhoto,
    isSound,
  } = req.body;
  try {
    if (!file || !fileType || !publicationId) {
      return res
        .status(400)
        .json({ error: "Publicatio id, file and file type are required" });
    }

    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found." });
    }

    if (publication.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "The publication can only be deleted the author" });
    }

    if (!existsSync(file)) {
      return res.status(404).json({ error: "This file not found." });
    }

    publication.content.push({
      file,
      fileType,
      audio,
      label,
      comment,
      coverPhoto,
      isSound,
    });

    await publication.save();

    return res.json({ message: "Content added succesfuly." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addComent = async (req, res) => {
  const { comment, like, publicationId } = req.body;
  const { userId: sender } = req;
  try {
    if (!comment || !publicationId) {
      return res
        .status(400)
        .json({ error: "Comment and publication id are required." });
    }

    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    await Comment.create({
      publicationId,
      sender,
      comment,
      like: like ? like : 0,
      answers: [],
    });

    res.json({ succses: true, message: "Your comment added succesfuly" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addLike = async (req, res) => {
  const {
    publicationId,
    isComment = false,
    isAnswer = false,
    commentId,
    answerId,
  } = req.body;
  const { userId } = req;

  try {
    if (!userId || !publicationId) {
      return res
        .status(400)
        .json({ error: "Publication ID and user ID are required." });
    }

    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    const comment = await Comment.findById(commentId);

    console.log(comment);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (isComment) {
      if (!commentId) {
        return res
          .status(400)
          .json({ error: "Comment ID is required for liking a comment." });
      }

      const likeIndex = comment.likes.indexOf(userId);
      if (likeIndex > -1) {
        comment.likes.splice(likeIndex, 1);
        await comment.save();
        return res.json({ success: true, message: "Your like was removed." });
      } else {
        comment.likes.push(userId);
      }
    } else if (isAnswer) {
      if (!commentId || !answerId) {
        return res
          .status(400)
          .json({ error: "Comment id and answer id required." });
      }
      const answer = comment.answers.id(answerId);

      const answerID = answer.likes.indexOf(userId);
      if (answerID > -1) {
        answer.likes.slice(answerID, 1);
        await comment.save();
        return res.json({ success: true, message: "Your like was removed." });
      } else {
        answer.likes.push(userId);
      }
    } else {
      const likeIndex = publication.likes.indexOf(userId);
      if (likeIndex > -1) {
        publication.likes.splice(likeIndex, 1);
        await publication.save();
        return res.json({ success: true, message: "Your like was removed." });
      } else {
        publication.likes.push(userId);
      }
    }

    await publication.save();
    await comment.save();

    res.json({ success: true, message: "Your like was added successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const writeAnswer = async (req, res) => {
  const { publicationId, commentId, comment, user } = req.body;
  const { userId } = req;

  try {
    if (!publicationId) {
      return res.status(400).json({ error: "Publication ID is required." });
    }

    if (!commentId) {
      return res.status(400).json({ error: "Comment ID is required." });
    }
    if (!comment) {
      return res.status(400).json({ error: "Comment content is required." });
    }

    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found." });
    }

    const findComment = await Comment.findById(commentId);

    if (!findComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    findComment.answers.push({
      author: userId,
      comment,
      user,
    });

    await findComment.save();

    res.json({ success: true, message: "Your answer was added successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const savePublication = async (req, res) => {
  const { publicationId } = req.body;
  const { userId } = req;
  try {
    if (!publicationId) {
      return res.status(400).json({ error: "Publication ID is required." });
    }

    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found." });
    }

    const index = publication.sevedPople.indexOf(userId);

    if (index > -1) {
      publication.sevedPople.splice(index, 1);
      res.json({ message: "Publication unsaved succesfuly" });
    } else {
      publication.sevedPople.push(userId);
      res.json({ message: "Publication saved succesfuly" });
    }
    await publication.save();
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deletePublication = async (req, res) => {
  const { publicationId } = req.params;
  const { userId } = req;
  try {
    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found." });
    }

    if (publication.author !== userId) {
      return res
        .status(403)
        .json({ error: "The publication can only be deleted by the author" });
    }

    await publication.deleteOne();

    return res
      .status(200)
      .json({ message: "Publication deleted successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteComment = async (req, res) => {
  const { publicationId, commentId } = req.params;
  const { userId } = req;
  try {
    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found." });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.sender.toString() === userId) {
      await Comment.findByIdAndDelete(commentId);
    } else {
      throw new Error("Only author deleted this comment");
    }

    return res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteAnser = async (req, res) => {
  const { publicationId, commentId, answerId } = req.params;
  const { userId } = req;
  try {
    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found." });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    const answer = comment.answers.id(answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found." });
    }

    if (answer.author.toString() === userId) {
      comment.answers.pull(answerId);
    }
    await comment.save();

    return res.status(200).json({ message: "Answer deleted successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deletePublicatioImage = async (req, res) => {
  const { publicationId, contentId } = req.params;
  const { userId } = req;

  try {
    if (!publicationId || !contentId) {
      return res
        .status(400)
        .json({ error: "Publication and Content ID are required." });
    }

    const publication = await Publications.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ error: "Publication not found." });
    }

    if (publication.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "The publication can only be deleted by the author." });
    }

    const content = publication.content.id(contentId);

    if (!content) {
      return res.status(404).json({ error: "Content not found." });
    }

    content.deleteOne();
    if (existsSync(content.file)) {
      unlinkSync(content.file);
    }

    await publication.save();

    return res.status(200).json({ message: "Content deleted successfully." });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    console.error("Delete Publication Error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};
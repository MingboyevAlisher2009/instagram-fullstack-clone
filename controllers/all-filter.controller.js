import Auth from "../models/user.model.js";

export const getUserWithContacts = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await Auth.findById(userId)
      .populate("following", "_id")
      .populate("followers", "_id");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const followingIds = user.following.map((f) => f._id);
    const followerIds = user.followers.map((f) => f._id);

    const excludeIds = [userId];

    const recommendedUsers = await Auth.find({
      _id: { $nin: excludeIds },
      $or: [
        { followers: { $in: followerIds } },
        { _id: { $in: followingIds } },
      ],
    })
      .limit(30)
      .populate("followers")
      .populate("following")
      .select("-password");

    const result = recommendedUsers.map((user) => ({
      ...user.toObject(),
      followers: user.followers.map((f) => ({
        _id: f._id,
        email: f.email,
        isClose: f.isClose,
        image: f.image,
        userName: f.userName,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      })),
      following: user.followers.map((f) => ({
        _id: f._id,
        email: f.email,
        isClose: f.isClose,
        image: f.image,
        userName: f.userName,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      })),
    }));

    return res.json(result);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Get User with Contacts Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const searchContacts = async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ error: "Please enter a username" });
  }

  try {
    const users = await Auth.find({ userName: userName });

    return res.json(users);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}


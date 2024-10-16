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

export const toggleFollowUser = async (req, res) => {
  const userId = req.userId;
  const { followUserId } = req.body;

  if (userId === followUserId) {
    return res.status(400).json({ error: "This information doesn't match." });
  }

  if (!followUserId) {
    return res.status(400).json({ error: "Please provide a user ID." });
  }

  try {
    const user = await Auth.findById(userId).select("-password");
    const followUser = await Auth.findById(followUserId).select("-password");

    if (!followUser) {
      return res.status(404).json({ error: "User to follow not found." });
    }

    const isFollowing = user.following.includes(followUserId);

    if (isFollowing) {
      user.following = user.following.filter(
        (id) => id.toString() !== followUserId
      );
      followUser.followers = followUser.followers.filter(
        (id) => id.toString() !== userId
      );

      await user.save();
      await followUser.save();

      return res.json({
        message: "You have unfollowed the user.",
      });
    } else {
      user.following.push(followUser);
      followUser.followers.push(user);

      await user.save();
      await followUser.save();

      return res.json({
        message: "You have follow the user.",
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    console.error("Profile Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
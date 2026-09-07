const express = require("express");
const RecentlyViewed = require("../models/Recentlyviewed");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const existingItem = await RecentlyViewed.findOne({
      userId,
      productId,
    });

    if (existingItem) {
      existingItem.viewedAt = new Date();
      await existingItem.save();

      return res.status(200).json(existingItem);
    }

    const newItem = new RecentlyViewed({
      userId,
      productId,
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.get("/:userid", async (req, res) => {
  try {
    const items = await RecentlyViewed.find({
      userId: req.params.userid,
    })
      .populate("productId")
      .sort({ viewedAt: -1 })
      .limit(20);

    res.status(200).json(items);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = router;

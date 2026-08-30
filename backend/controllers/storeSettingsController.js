// controllers/storeSettingsController.js

import StoreSettings from "../models/StoreSettings.js";


// GET SETTINGS

export const getStoreSettings = async (req, res) => {
  try {

    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = await StoreSettings.create({});
    }

    res.json({
      success: true,
      data: settings,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


// UPDATE SETTINGS

export const updateStoreSettings = async (
  req,
  res
) => {
  try {

    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = await StoreSettings.create({});
    }

    Object.assign(settings, req.body);

    settings.updatedBy = req.user._id;

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


// controllers/storeSettingsController.js


export const getPublicStoreSettings = async (
  req,
  res
) => {
  try {

    const settings =
      await StoreSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message:
          "Store settings not found",
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
let User = require("../../models/User");
let Assistant = require("../../models/Assistant");
let auth = require("../auth");
let router = require("express").Router();
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const Log = require("../../utilities/Log");

router.get("/", auth.appendUser, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        new UnauthorizedResponse("You are not authorized to get admins"),
        401
      );
    }
    const admins = await User.find({ role: "admin" });
    if (!admins) {
      return next(new BadRequestResponse("Unable to get admins"), 401);
    }
    return next(new OkResponse({ admins: admins }));
  } catch (error) {
    return next(new BadRequestResponse(error), 501);
  }
});

router.post("/add-admin", auth.appendUser, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        new UnauthorizedResponse("You are not authorized to add admins"),
        401
      );
    }
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return next(new BadRequestResponse("User already exists"), 401);
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await newUser.save();

    return next(new OkResponse({ message: "Admin added successfully" }));
  } catch (error) {
    return next(new BadRequestResponse(error), 501);
  }
});

router.post('/delete-admin', auth.appendUser, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        new UnauthorizedResponse("You are not authorized to delete admins"),
        401
      );
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new BadRequestResponse("User not found"), 401);
    }
    await User.deleteOne({ email });
    return next(new OkResponse({ message: "Admin deleted successfully" }));
  } catch (error) {
    return next(new BadRequestResponse(error), 501);
  }
})

router.post("/add-assistant", auth.appendUser, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        new UnauthorizedResponse("You are not authorized to add assistants"),
        401
      );
    }
    const { name, api_key } = req.body;

    const assistant = new Assistant({
      // _id :api_key,
      name: name,
      assistant_id: api_key,
    });

    await assistant.save();
    
    return next(new OkResponse({ message: "Assistant added successfully" }));
  } catch (error) {
    Log.error(error)
    return next(new BadRequestResponse(error), 501);
  }
});

router.get("/assistants", auth.appendUser, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        new UnauthorizedResponse("You are not authorized to get assistants"),
        401
      );
    }
    const assistants = await Assistant.find({});
    if (!assistants) {
      return next(new BadRequestResponse("Unable to get assistants"), 401);
    }
    return next(new OkResponse({ assistants: assistants }));
  } catch (error) {
    return next(new BadRequestResponse(error), 501);
  }
});

module.exports = router;

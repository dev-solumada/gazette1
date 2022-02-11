const express = require("express");
const routeExp = express.Router();
const mongoose = require("mongoose");
const md5 = require('md5');
const PdfDoneSchema = require("../models/PdfDone");
const UserSchema = require("../models/User");
const MONGOOSE_URL = "mongodb+srv://solumada:vbcFPNKhZk0vcpfI@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const MAIN_USER = "developpeur.solumada@gmail.com";
const MAIN_PASS = "S0!um2d2";
const PDF_LIMIT = 15;
var session = null;
let allpdf = "";
let allusers = "";
var fullname = "";
let Bdfiles = [];
var version = [];
var Bdusers = [];
//Mailing
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIN_USER,
    pass: MAIN_PASS,
  },
});

//Route
routeExp.route("/").get(async function (req, res) {
  session = req.session;
  if (session.userid) {
    res.redirect("/home");
  } else {
    mongoose
    .connect(MONGOOSE_URL, {
      useUnifiedTopology: true,
      UseNewUrlParser: true,
    })
    .then( async () => {
      // PdfDoneSchema.deleteMany({},()=>{
      //   console.log("All pdf  is removed");
      // })
      // UserSchema.deleteMany({},()=>{
      //   console.log("All user  is removed");
      // })
    })
    res.render("plateforme/login.html", { error: "", msgs: "null" });
  }
});
function randomCode() {
  var code = "";
  let v = "0123456789";
  for (let i = 0; i <= 5; i++) {
    let char = v.charAt(Math.random() * v.length - 1);
    code += char;
  }
  return code;
}

//Home
routeExp.route("/home").get(function (req, res) {
  session = req.session;
  if (session.userid) {
    mongoose
      .connect(
        MONGOOSE_URL,
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        allpdf = await PdfDoneSchema.find({treated_by: session.userid})
        .sort({_date: -1}).limit(PDF_LIMIT);
        Bdfiles = [];
        version = [];
        for (i = 0; i < allpdf.length; i++) {
          Bdfiles.push(allpdf[i].name);
          version.push(allpdf[i].version);
        }
        user = await UserSchema.findOne({ email: session.userid });
        res.render("home.html", {
          dones: allpdf,
          bdfls: Bdfiles,
          version: version,
          email: user.email,
          type: user.user_type,
        });
      });
  } else {
    res.redirect("/login");
  }
});

// login 
routeExp.route('/login').get(function(req, res) {
  return res.render("plateforme/login.html", { error: "", msgs: "null" });
})

// history
routeExp.route('/history/:userid').get(function(req, res) {
  session = req.session;
  if (session.userid) {
    mongoose
      .connect(
        MONGOOSE_URL,
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        allpdf = await PdfDoneSchema.find((req.params.userid !== 'all') ? {treated_by: req.params.userid} : {}).sort({_date: -1});
        users = await UserSchema.find();
        Bdfiles = [];
        version = [];
        for (i = 0; i < allpdf.length; i++) {
          Bdfiles.push(allpdf[i].name);
          version.push(allpdf[i].version);
        }
        user = await UserSchema.findOne({ email: session.userid });
        res.render("plateforme/finisheddoc.html", {
          dones: allpdf,
          bdfls: Bdfiles,
          version: version,
          email: user.email,
          type: user.user_type,
          users: users,
          active_user: req.params.userid,
        });
      });
  } else {
    res.redirect('/login');
  }
})
// list of users
routeExp.route("/list").get(function (req, res) {
  session = req.session;
  if (session.userid) {
    mongoose
      .connect(
        MONGOOSE_URL,
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        allpdf = await PdfDoneSchema.find({treated_by: session.userid}).sort({_date: -1});
        users = await UserSchema.find();
        done = await PdfDoneSchema.find();
        Bdfiles = [];
        version = [];
        for (i = 0; i < allpdf.length; i++) {
          Bdfiles.push(allpdf[i].name);
          version.push(allpdf[i].version);
        }
        user = await UserSchema.findOne({ email: session.userid });
        res.render("plateforme/list.html", {
          dones: done,
          users: users,
          bdfls: Bdfiles,
          version: version,
          email: user.email,
          type: user.user_type,
          main_user: MAIN_USER,
          msge: "null",
          msgs: "null",
          notif: req.flash('notif'),
        });
      });
  } else {
    res.redirect("/login");
  }
});


//Delete user
routeExp.route("/delUsers").post(function (req, res) {
    mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var users = req.body.delete.split(",");
      for (i=0;i<users.length;i++){
          await UserSchema.deleteOne({email:users[i]});
      }
    })
});

//Login post
routeExp.route("/login").post(function (req, res) {
  session = req.session;
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var login = await UserSchema.find({
        email: req.body.email,
        password: md5(req.body.password),
      });
      if (login.length != 0) {
        session.userid = req.body.email;
        res.redirect("/home");
      } else {
        res.render("plateforme/login.html", {
          error: "Email does not exist or password is wrong",
          msgs: "null",
        });
      }
    });
});

//Get post create
routeExp.route("/create").post(function (req, res) {
  session = req.session;
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      allusers = await UserSchema.find();
      Bdusers = [];
      for (i = 0; i < allusers.length; i++) {
        Bdusers.push(allusers[i].email);
      }
      if (Bdusers.indexOf(req.body.email) === -1) {
        var new_user = {
          first_name: req.body.firstname,
          last_name: req.body.lastname,
          email: req.body.email,
          password: md5(req.body.password),
          user_type: req.body.accounttype == 1 ? true : false,
        };
        await new UserSchema(new_user).save();
        req.flash('notif', 'User has been successfully added.')
        res.redirect("/list");
      } else {
        users = await UserSchema.find();
        done = await PdfDoneSchema.find();
        Bdfiles = [];
        version = [];
        for (i = 0; i < allpdf.length; i++) {
          Bdfiles.push(allpdf[i].name);
          version.push(allpdf[i].version);
        }
        user = await UserSchema.findOne({ email: session.userid });
        res.render("plateforme/list.html", {
          dones: done,
          users: users,
          bdfls: Bdfiles,
          version: version,
          email: user.email,
          type: user.user_type,
          main_user: MAIN_USER,
          msge: req.body.email + " is already exist",
          msgs: "null",
          notif: null,
        });
      }
    });
});
routeExp.route("/activation").get(function (req, res) {
  res.render("plateforme/activate.html", { err: "null" });
});
routeExp.route("/authentification").post(function (req, res) {
  session = req.session;
  if (session.code) {
    if (req.body.code == session.code) {
      mongoose
        .connect(
          MONGOOSE_URL,
          {
            useUnifiedTopology: true,
            UseNewUrlParser: true,
          }
        )
        .then(async () => {
          var new_user = {
            first_name: session.firstname,
            last_name: session.lastname,
            email: session.email,
            password: session.password,
          };
          await new UserSchema(new_user).save();
          res.render("plateforme/login.html", {
            msgs: session.email + " is successfully registered",
            error: "",
          });
          req.session.destroy();
          session = req.session;
        });
    } else {
      res.render("plateforme/activate.html", { err: "Invalid code" });
    }
  } else {
    if (req.body.code == session.confirm) {
      res.redirect("/newpassword");
    } else {
      res.render("plateforme/activate.html", { err: "Invalid code" });
    }
  }
});
//Forgot password
routeExp.route("/forgot").get(function (req, res) {
  res.render("plateforme/forgot.html", { err: "null" });
});
routeExp.route("/forgot").post(function (req, res) {
  session = req.session;
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      allusers = await UserSchema.find();
      Bdusers = [];
      for (i = 0; i < allusers.length; i++) {
        Bdusers.push(allusers[i].email);
      }
      if (Bdusers.indexOf(req.body.email) === -1) {
        res.render("plateforme/forgot.html", { err: "Email does not exist" });
      } else {
        var random = randomCode();
        session.emailconfirm = req.body.email;
        session.confirm = random;
        var mailOptions = {
          from: MAIN_USER,
          to: req.body.email,
          subject: "Verification code XML Gazette",
          html:
            "<center><h1>YOUR XML GAZETTE CODE AUTHENTIFICATION</h1>" +
            "<h3 style='width:250px;font-size:50px;padding:8px;background-color:#46449B; color:white'>" +
            random +
            "<h3></center>",
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
          } else {
            res.redirect("/activation");
          }
        });
        res.redirect("/activation");
      }
    });
});
//Define new password
routeExp.route("/newpassword").get(function (req, res) {
  res.render("plateforme/newpassword.html");
});
routeExp.route("/define").post(function (req, res) {
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      await UserSchema.findOneAndUpdate(
        { email: session.emailconfirm },
        { password: md5(req.body.password) }
      );
      res.render("plateforme/login.html", {
        msgs: session.emailconfirm + " is successfully updated",
        error: "",
      });
      req.session.destroy();
      session = req.session;
    });
});

//Logout
routeExp.route("/logout").get(function (req, res) {
  req.session.destroy();
  session = req.session;
  res.redirect("/");
});

routeExp.route("/download").post(function (req, res) {
  mongoose
    .connect(
      MONGOOSE_URL,
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var pdfDone = {
        name: req.body.filename,
        treated_by: session.userid,
        version: req.body.version,
        _date: Date.now()
      };
      await new PdfDoneSchema(pdfDone).save();
      res.redirect("/");
    });
});

module.exports = routeExp;

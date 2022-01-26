const express = require("express");
const routeExp = express.Router();
const mongoose = require("mongoose");
const PdfDoneSchema = require("../models/PdfDone");
const UserSchema = require("../models/User");
var session = null;
let allpdf = "";
let allusers = "";
var fullname ="";
let Bdfiles = [];
var version = [];
var Bdusers = [];
//Mailing
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ricardoramandimbisoa@gmail.com",
    pass: "ryane_jarello",
  },
});

//Route
routeExp.route("/").get(async function (req, res) {
  session = req.session;
  if (session.userid) {
    res.redirect("/home");
  } else {
    //     mongoose
    //     .connect("mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    //       useUnifiedTopology: true,
    //       UseNewUrlParser: true,
    //     })
    //     .then( async () => {
    //         PdfDoneSchema.deleteMany({},()=>{
    //   console.log("All pdf  is removed");
    // })
    // UserSchema.deleteMany({},()=>{
    //   console.log("All user  is removed");
    // })
    //     })
    res.render("plateforme/login.html", { error: "",msgs:"null"});
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
        "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
          useUnifiedTopology: true,
          UseNewUrlParser: true,
        }
      )
      .then(async () => {
        allpdf = await PdfDoneSchema.find();
        Bdfiles = [];
        version = [];
        for (i = 0; i < allpdf.length; i++) {
          Bdfiles.push(allpdf[i].name);
          version.push(allpdf[i].version);
        }
        fullname = await UserSchema.findOne({email : session.userid});
        res.render("home.html", {
          dones: allpdf,
          bdfls: Bdfiles,
          version: version,
          email:fullname.first_name + " " +fullname.last_name
        });
      });
  } else {
    res.render("plateforme/login.html", { error: "" ,msgs:"null"});
  }
});
//Login post
routeExp.route("/login").post(function (req, res) {
  session = req.session;
  mongoose
    .connect(
      "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var login = await UserSchema.find({
        email: req.body.email,
        password: req.body.password,
      });
      console.log(login);
      console.log(login.length);
      if (login.length != 0) {
        session.userid = req.body.email;
        res.redirect("/home");
      } else {
        res.render("plateforme/login.html", {
          error: "Email does not exist or password is wrong",
          msgs:"null"
        });
      }
    });
});
//Get page create
routeExp.route("/create").get(function (req, res) {
  res.render("plateforme/create.html", { msge: "null", msgs: "null" });
});
//Get post create
routeExp.route("/create").post(function (req, res) {
  session = req.session;
  var random = randomCode();
  mongoose
      .connect(
        "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
          session.code = random;
          session.firstname = req.body.firstname;
          session.lastname = req.body.lastname;
          session.email = req.body.email;
          session.password = req.body.password;
          var mailOptions = {
            from: "ricardoramandimbisoa@gmail.com",
            to: req.body.email,
            subject: "Verification code XML Gazette",
            html: "<center><h1>YOUR XML GAZETTE CODE AUTHENTIFICATION</h1>"+"<h3 style='width:250px;font-size:50px;padding:8px;background-color:#46449B; color:white'>"+random+"<h3></center>"
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
              res.redirect("/activation");
            }
          });
        }
        else{
          res.render("plateforme/create.html", {
            msge: req.body.email + " is already exist",
            msgs: "null",
          });
        }
      })

});
routeExp.route("/activation").get(function (req, res) {
  res.render("plateforme/activate.html",{err:"null"});
});
routeExp.route("/authentification").post(function (req, res) {
  session = req.session;
  if (session.code){
    if (req.body.code == session.code) {
      mongoose
        .connect(
          "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
              msgs: session.email+  " is successfully registered",
              error:""
            });
            req.session.destroy();
            session = req.session;
        });
    }
    else {
      res.render("plateforme/activate.html",{err:"Invalid code"});
    }
  }
  else{
      if (req.body.code == session.confirm){
          res.redirect('/newpassword');
      }
      else{
        res.render("plateforme/activate.html",{err:"Invalid code"});
      }
  }
  
});
//Forgot password
routeExp.route("/forgot").get(function (req, res) {
  res.render("plateforme/forgot.html",{err:"null"});
});
routeExp.route("/forgot").post(function (req, res) {
  session = req.session;
  mongoose
  .connect(
    "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
      res.render("plateforme/forgot.html",{err:"Email does not exist"});
    }
    else{
      var random = randomCode();
      session.emailconfirm = req.body.email;
      session.confirm = random;
      var mailOptions = {
        from: "ricardoramandimbisoa@gmail.com",
        to: req.body.email,
        subject: "Verification code XML Gazette",
        html: "<center><h1>YOUR XML GAZETTE CODE AUTHENTIFICATION</h1>"+"<h3 style='width:250px;font-size:50px;padding:8px;background-color:#46449B; color:white'>"+random+"<h3></center>"
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.redirect("/activation");
        }
      });
        res.redirect('/activation');
    }
    
  })
});
//Define new password
routeExp.route("/newpassword").get(function (req, res) {
  res.render("plateforme/newpassword.html");
});
routeExp.route("/define").post(function (req, res) {
  mongoose
  .connect(
    "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      UseNewUrlParser: true,
    }
  )
  .then(async () => {
      await UserSchema.findOneAndUpdate({email : session.emailconfirm},{ password: req.body.password});
      res.render("plateforme/login.html", {
        msgs: session.emailconfirm+  " is successfully updated",
        error:""
      });
      req.session.destroy();
      session = req.session;
  })
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
      "mongodb+srv://solumada:Password@cluster0.t0vx8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        UseNewUrlParser: true,
      }
    )
    .then(async () => {
      var pdfDone = {
        name: req.body.filename,
        treated_by: fullname.last_name,
        version: req.body.version,
      };
      if (Bdfiles.indexOf(req.body.filename) === -1) {
        await new PdfDoneSchema(pdfDone).save();
      } else {
        await PdfDoneSchema.findOneAndUpdate(
          { id: req.body.filename },
          { version: req.body.version }
        );
      }
      res.redirect("/");
    });
});

module.exports = routeExp;

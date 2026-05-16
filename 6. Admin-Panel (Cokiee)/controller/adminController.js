  const express = require('express');

  const admin = require('../model/adminSchema');

  module.exports.dashboardPage = (req, res) => {
    res.render('pages/dashboard', { activePage: 'dashboard' });
  };

  module.exports.formLayoutPage = (req, res) => {
    res.render('pages/form-layout', { activePage: 'form-layout' });
  };

 module.exports.userListPage = async (req, res) => {
  try {
    const users = await admin.find();

    res.render('pages/userList', {
      users, 
      activePage: 'users'
    });

  } catch (error) {
    console.log(error);
  }
};

  module.exports.addAdmin = async(req,res) =>{
      try {
          const {fullName,phoneNumber,email,password,role,plan,status,note} = req.body;

          const image = req.file ? req.file.filename : null;

          const newAdmin = new admin({fullName,phoneNumber,email,password,role,plan,status,note, Image : image});

          await newAdmin.save();

          console.log(newAdmin);

          res.redirect('/users');
      } catch (error) {
          console.log(error);
      }
  }

module.exports.editPage = async (req, res) => {
  try {
    const user = await admin.findById(req.params.id);

    res.render('pages/editUser', {
      user,
      activePage: 'users'
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password, role, plan, status, note } = req.body;

    let updateData = {
      fullName,
      phoneNumber,
      email,
      password,
      role,
      plan,
      status,
      note
    };

    if (req.file) {
      updateData.Image = req.file.filename;
    }

    await admin.findByIdAndUpdate(req.params.id, updateData);

    res.redirect('/users');
  } catch (error) {
    console.log(error);
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    await admin.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (error) {
    console.log(error);
  }
};


module.exports.loginUser = async(req,res)=>{
  try {
    const {email,password} = req.body;

    const user = await admin.findOne({email});

    if(!user){
      return res.render('pages/login',{
        error : "User not found !!"
      });
    }

    if(user.password !== password){
      return res.render('pages/login',{
        error : "Wrong Password..."
      });
    }

    res.cookie('userId', user._id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    
  }
}

async function createDefaultAdmin() {
  try {
    const existing = await admin.findOne({ email: "admin@gmail.com" });

    if (!existing) {
      await admin.create({
        fullName: "Admin",
        phoneNumber: "9999999999",
        email: "admin@gmail.com",
        password: "1234",
        role: "Admin",
        plan: "Premium",
        status: "Active",
        note: "Default admin"
      });

      console.log("Default Admin Created");
    } else {
      console.log("Admin already exists");
    }

  } catch (error) {
    console.log(error);
  }
}

createDefaultAdmin();

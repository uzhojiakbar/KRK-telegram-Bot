// const { users } = require("../helpers/mockData");
// const User = require("../models/User");

// const getDistricts = () => Object.keys(users);

// const getSchoolsByDistrict = (districtName) => {
//   return districtName in users ? Object.keys(users[districtName]) : [];
// };

// const getTeachersBySchool = (districtName, schoolName) => {
//   if (districtName in users && schoolName in users[districtName]) {
//     return Object.keys(users[districtName][schoolName]);
//   }
//   return [];
// };

// const getTeacherInfo = (districtName, schoolName, teacherName) => {
//   if (
//     districtName in users &&
//     schoolName in users[districtName] &&
//     teacherName in users[districtName][schoolName]
//   ) {
//     return users[districtName][schoolName][teacherName];
//   }
//   return null;
// };

// const saveUser = async (userData) => {
//   const user = new User(userData);
//   return await user.save();
// };

// const findUser = async (chatId) => {
//   return await User.findOne({ chatId });
// };

// module.exports = {
//   getDistricts,
//   getSchoolsByDistrict,
//   getTeachersBySchool,
//   getTeacherInfo,
//   saveUser,
//   findUser,
// };

const User = require("../models/User");

const saveUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    console.log("User data saved to MongoDB:", userData);
    return user;
  } catch (error) {
    console.error("Error saving user to MongoDB:", error.message);
    throw error;
  }
};

module.exports = { saveUser };

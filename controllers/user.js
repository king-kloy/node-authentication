module.exports = {
  signUp: async (req, res, next) => {
    console.log("UserController.signUp() is called");
  },
  signIn: async (req, res, next) => {
    console.log("UserController.signIn() is called");
  },
  secret: async (req, res, next) => {
    console.log("UserController.secret() is called");
  },
}
import pool from "../config/db.js";

export const searchUser = async (req, res) => {
  const { keywords } = req.body;
  const userId = req.user.id;
  //console.log(keywords);
  //console.log(userId);
  try {
    const queryLine =
      "SELECT id, username FROM users WHERE username LIKE ? AND id != ?";
    const [data] = await pool.query(queryLine, [`%${keywords}%`, userId]);
    //console.log(data);
    if(data.length===0){
      return res.status(200).json({
        message:"No such data found"
      })
    }
    return res.status(200).json({
      message:"Search successfull",
      friends:data

    })
  } catch (err) {
    console.log(err.message, "Failed to searach the friends");
  }
};

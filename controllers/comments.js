import { db } from "../connent.js";
import jwt from "jsonwebtoken";
import moment from "moment";
export const getComments = (req, res) => {
  const sql = `SELECT c.*, u.idusers AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.idusers = c.userId) 
                WHERE c.postId = ? ORDER BY  c.createdAt DESC`;

  db.query(sql, [req.query.postId], (err, data) => {
    // console.log(data);
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Chưa đăng nhập!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token không hợp lệ!");
    const sql =
      "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    db.query(sql, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Đã tạo comment!");
    });
  });
};

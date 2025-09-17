import {db} from "../connent.js";
import jwt  from "jsonwebtoken";

export const getLikes = (req,res) => {
    const sql =
      "SELECT userId FROM likes WHERE postsId = ?";

    db.query(sql, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(like=>like.userId));
    });
}

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Chưa đăng nhập!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token không hợp lệ!");
    const sql =
      "INSERT INTO likes (`userId`, `postsId`) VALUES (?)";

    const values = [
      userInfo.id,
      req.body.postId,
    ];

    db.query(sql, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Bài viết đã được thích!");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Chưa đăng nhập!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token không hợp lệ!");
    const sql =
      "DELETE FROM likes WHERE `userId` = ? AND `postsId` = ?";


    db.query(sql, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Đã dislike bài viết");
    });
  });
};
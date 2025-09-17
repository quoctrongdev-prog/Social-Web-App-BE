import { db } from "../connent.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const sql = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(sql, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Chưa đăng nhập!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token không hợp lệ!");
    const sql = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";
                  //Id này là mình, Id này là follow người khác
    const values = [userInfo.id, req.body.userId];
                                //Theo button theo dõi
    db.query(sql, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Đang theo dõi!");
    });
  });
};

export const deleteRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Chưa đăng nhập!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token không hợp lệ!");
    const sql = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(sql, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Hủy theo dõi");
    });
  });
};

import moment from "moment/moment.js";
import {db} from "../connent.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
    const userId = req.params.userId;
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Chưa đăng nhập!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=> {
        if(err) return res.status(403).json("Token không hợp lệ!")
            const sql = userId 
        ? `SELECT p.*, u.idusers AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.idusers = p.userId) 
         WHERE p.userId = ? 
         ORDER BY  p.createdAt DESC` 
        : `SELECT p.*, u.idusers AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.idusers = p.userId) 
        ORDER BY  p.createdAt DESC`;
        
            const values = userId ? [userId] : [userInfo.id]

            db.query(sql, values, (err,data)=>{
                // console.log(userInfo);
                if(err) return res.status(500).json(err);
                return res.status(200).json(data)
            })
            // console.log(userId);
            

    })
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Chưa đăng nhập!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=> {
        if(err) return res.status(403).json("Token không hợp lệ!")
            const sql = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]
            
            db.query(sql, [values], (err,data)=>{
                if(err) return res.status(500).json(err);
                return res.status(200).json("Đã tạo bài đăng")
            })

    })
}

 export const updatePost = (req, res) => {
    const token = req.cookies.accessToken;
        if(!token) return res.status(401).json("Chưa đăng nhập!")
        
        jwt.verify(token, "secretkey", (err, userInfo)=> {
            if(err) return res.status(403).json("Token không hợp lệ!")
                
                const sql = "UPDATE posts SET `desc`=?,`img`=? WHERE idposts = ? AND `userId`= ?";

                db.query(sql, [req.body.desc, req.body.img, req.params.id, userInfo.id], (err,data)=>{
                    if(err) return res.status(500).json(err);
                    if(data.affectedRows > 0) return res.status(200).json("Cập nhật thành công!")
                    return res.status(403).json("Bạn chỉ có thể chỉnh sửa bài viết của mình của mình!")
                })
        })
    }



export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Chưa đăng nhập!")
    
    jwt.verify(token, "secretkey", (err, userInfo)=> {
        if(err) return res.status(403).json("Token không hợp lệ!")
            //  console.log("User từ token:", userInfo); <-- In ra userInfo
    // console.log("ID bài viết cần xóa:", req.params.id); <-- In ra id bài viết
        const sql = "DELETE FROM posts WHERE `idposts`= ? AND `userId`= ?";
    
    // console.log(userInfo.id);
    
    
    db.query(sql, [req.params.id, userInfo.id], (err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.affectedRows>0) return res.status(200).json("Đã xóa bài đăng");
        return res.status(403).json("Bạn chỉ có thể xóa bài đăng của mình!");
    })

    })
}


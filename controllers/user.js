    import { db } from "../connent.js";
    import jwt from "jsonwebtoken";
    import moment from "moment";

    export const getUser = (req, res) => {
        const userId = req.params.id;
        const sql = "SELECT * FROM users WHERE idusers = ?";
        
        db.query(sql, [userId], (err, data) => {
            // console.log(data);
            if (err) return res.status(500).json(err);
            const {password, ...info} = data[0];
            return res.status(200).json(info);
            
            
            
        });
    }

    export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
        if(!token) return res.status(401).json("Chưa đăng nhập!")
        
        jwt.verify(token, "secretkey", (err, userInfo)=> {
            if(err) return res.status(403).json("Token không hợp lệ!")
                
                const sql = "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE idusers = ?";

                db.query(sql, [req.body.name, req.body.city, req.body.website, req.body.profilePic, req.body.coverPic, userInfo.id], (err,data)=>{
                    if(err) return res.status(500).json(err);
                    if(data.affectedRows > 0) return res.status(200).json("Cập nhật thành công!")
                    return res.status(403).json("Bạn chỉ có thể cập nhật tài khoản của mình!")
                })
        })
    }
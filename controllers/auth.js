import { db } from "../connent.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
  //Code xử lí logic đăng ký
  //Kiểm tra có người dùng đã tồn tại hay không
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Người dùng đã tồn tại!");
    //Nếu chưa tồn tại thì thêm người dùng mới
    //Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10);
    const hasedPassword = bcrypt.hashSync(req.body.password, salt);

    const qAddUser = "INSERT INTO users(`email`, `username`, `password`, `name`) VALUES (?)";
    const values = [
      req.body.email,
      req.body.username,
      hasedPassword,
      req.body.name,
    ];
    db.query(qAddUser, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Thêm người dùng thành công!");

    })
  });
  
};

export const login = (req, res) => {
  //Code xử lí logic đăng nhập
  const sql = "SELECT * FROM users WHERE username = ?"
  db.query(sql,[req.body.username], (err,data)=>{
    if (err) return res.status(500).json(err);
    if(data.length === 0) return res.status(404).json("Không tìm thấy tài khoản!")
    //Câu lệnh sql đặt tại username nên data chỉ có username nên là chỉ
    //so sánh mật khẩu và username thôi.                          //!!!
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
    //400 sai input (mật khẩu hoặc tài khoản)
    if(!checkPassword) return res.status(400).json("Sai mật khẩu hoặc tài khoản");
    //Khởi tạo token (jwt)
    const token = jwt.sign({id:data[0].idusers}, "secretkey");
    // console.log(data);
    
    const {password, ...others} = data[0]
    //Khởi tạo cookie tên là accessToken
    //httpOnly: true để không thể truy cập cookie từ javascript (phía client - FE)
    res.cookie("accessToken", token,{
      httpOnly: true,
    }).status(200).json(others);
  })
};

export const logout = (req, res) => {
  //Code xử lí logic đăng xuất
  res.clearCookie("accessToken", {
    //secure: true để cookie chỉ được gửi qua https
    //sameSite: "none" để cookie có thể được gửi khác domain 
    //react: 5271, nodejs: 8800
    secure:true,
    sameSite:"none",
  }).status(200).json("Đăng xuất thành công!");
};

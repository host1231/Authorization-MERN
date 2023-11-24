import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const postData = async () => {
    await axios
      .post("http://localhost:3002/auth/login", { ...form })
      .then((res) => {
        console.log(res);
        navigate("/user");
      })
      .catch((err) => console.log("Err", err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    postData();
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2 className="title">Авторизация</h2>
      <div className="row">
        <div className="input-field col s12">
          <input
            type="email"
            className="validate"
            name="email"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <input
            type="password"
            className="validate"
            name="password"
            onChange={handleChange}
          />
          <label htmlFor="password">Пароль</label>
        </div>
      </div>
      <div className="buttons">
        <button className="waves-effect waves-light btn">Войти</button>
        <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
      </div>
    </form>
  );
};

export default Login;

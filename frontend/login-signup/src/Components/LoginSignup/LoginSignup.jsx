
import './LoginSignup.css'
import user_icon from '../Assets/user_icon.png'
import email_icon from '../Assets/email_icon.png'
import password_icon from '../Assets/password_icon.png'
const LoginSignup = () => {
    return (
      <div className= 'container'>
        <div classname= 'header'>
          <div className='text'>Sign up</div>
          <div className= "underline"></div>
        </div>
        <div className= "inputs">
          <div className= "input">
            <img src={user_icon} alt= "" />
            <input type= "name" />
          </div>
          <div className= "input">
            <img src= {email_icon} alt= "" />
            <input type= "email" />
          </div>
          <div className= "input">
            <img src= {password_icon} alt= "" />
            <input type= "password" />
          </div>
        </div>
        <div className="forgot-password">Forgot Password?<span> Click here!</span></div>
        <div className="submit-containter">
          <div className="submit">Sign Up</div>
          <div className="submit">Login</div>
        </div>
      </div>
    )

}
export default LoginSignup
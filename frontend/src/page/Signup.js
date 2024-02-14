import React, { useState } from 'react'
import loginSignupImage from "../asset/login-animation.gif"
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from '../utility/ImageToBase64';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
    image: "",
  })

  const handleShowPassword = () => {
    setShowPassword(prev => !prev)
  }
  
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev)
  }

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setData((prev) => {
      return{
        ...prev,
        [name]: value
      }
    })
  }

  const handleUploadProfileImage = async(e) => {
    const data = await ImagetoBase64(e.target.files[0])

    setData((prev) => {
      return {
        ...prev,
        image: data
      }
    })
  }


  const handleSubmit = async(e) => {
    e.preventDefault()

    const {firstName, email, password, confirmpassword} = data

    if(firstName && email && password && confirmpassword){
      if(password === confirmpassword){
        const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/signup`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(data),
        })

        const dataRes = await fetchData.json()

        toast(dataRes.message)
        if(dataRes.alert){
          navigate("/login")
        }
      }else{
        alert("password and confirm password not matched")
      }
    }else{
      alert("Please enter required fields")
    }
  }

  return (
    <div className='p-3 md:p-4'>
        <div className='w-full max-w-sm bg-white m-auto flex flex-col p-4'>
            <div className='w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto'>
              <img src={data.image ? data.image : loginSignupImage} className='w-full h-full' alt="" />

              <label htmlFor="profileImage">
                <div className="absolute bottom-0 h-1/3 bg-slate-500 bg-opacity-50 w-full text-center">
                  <p className='text-sm p-1 text-white cursor-pointer'>Upload</p>
                </div>
                <input type="file" id='profileImage' accept='image/*' className='hidden' onChange={handleUploadProfileImage}/>
              </label>

            </div>

            <form className='w-full py-3 flex flex-col' action="" onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input type={"text"} name="firstName" id="firstName" className='mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within: outline-blue-300' value={data.firstName} onChange={handleOnChange}/>
                
                <label htmlFor="lastName">Last Name</label>
                <input type={"text"} name="lastName" id="lastName" className='mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within: outline-blue-300' value={data.lastName} onChange={handleOnChange}/>
                
                <label htmlFor="email">Email</label>
                <input type={"email"} name="email" id="email" className='mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within: outline-blue-300' value={data.email} onChange={handleOnChange}/>
                
                <label htmlFor="password">Password</label>
                <div className="flex px-2 py-1 mt-1 mb-2 bg-slate-200 rounded focus-within:outline focus-within: outline-blue-300">
                  <input type={showPassword ? "text" : "password"} name="password" id="password" className='w-full bg-slate-200 border-none outline-none' value={data.password} onChange={handleOnChange}/>
                  <span className='flex text-xl cursor-pointer' onClick={handleShowPassword}>{ showPassword ? <BiShow/> : <BiHide/> }</span>
                </div>
                
                <label htmlFor="confirmpassword">Confirm Password</label>
                <div className="flex px-2 py-1 mt-1 mb-2 bg-slate-200 rounded focus-within:outline focus-within: outline-blue-300">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmpassword" id="confirmpassword" className='w-full bg-slate-200 border-none outline-none' value={data.confirmpassword} onChange={handleOnChange}/>
                  <span className='flex text-xl cursor-pointer' onClick={handleShowConfirmPassword}>{ showConfirmPassword ? <BiShow/> : <BiHide/> }</span>
                </div>

                <button className='w-full max-w-[120px] m-auto text-white text-xl font-medium text-center py-1 rounded-full mt-4 bg-red-500 hover:bg-red-600 cursor-pointer'>Sign up</button>
            </form>

            <p className='text-sm mt-2'>Already have an account? <Link to={"/login"} className='text-red-500 underline'>Login</Link> </p>
        </div>
    </div>
  )
}

export default Signup
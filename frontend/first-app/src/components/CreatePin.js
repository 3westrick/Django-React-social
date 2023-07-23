import React,{useState, useEffect} from 'react'
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

function CreatePin() {
  let {user, token} = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [image_file, setImage_file] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(null)
  const [category, setCategory] = useState(null) 
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate()

  const [categories, setCategories] = useState([]) 
  async function get_categories(){
      let res = await fetch("http://127.0.0.1:8000/api/pins/categories/")
      let data = await res.json()
      setCategories(data)
  }

  useEffect(()=>{
      get_categories()
  }, [])

  function uploadImage(e){
    const {type} = e.target.files[0]

    if (type === 'image/png' ||
    type === 'image/svg' ||
    type === 'image/jpg'||
    type === 'image/jpeg' ||
    type === 'image/webp'
    ){
      setLoading(true)
      setWrongImageType(false)
      setImage_file(e.target.files[0])
      setImageAsset(URL.createObjectURL(e.target.files[0]))

      setLoading(false)

      
    }else{    
      setWrongImageType(false)
    }
  }
  async function save_pin(){
    
    if (title && about){
    let data = new FormData()
    data.append('image', image_file)
    data.append('title', title)
    data.append('about', about)
    data.append('category', category)
    data.append('url', url)
    let res = await fetch(`http://127.0.0.1:8000/api/pins/create/`,
  {
    method: 'POST',
    headers:{
      'Authorization' : token ? `Bearer ${String(token.access)}` : '' 
      },
      body: data
    })
    let data_back = await res.json()
    
    if (res.status == 201){
      console.log(111)
      navigate('/')
    }
    }else{
      setFields(true)
      setTimeout(()=>{
        setFields(false)
      },2000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields.</p>
      )} 
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner/>}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col justify-center items-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-xl'><AiOutlineCloudUpload/></p>
                    <p className='text-lg'>Click to upload</p>
                  </div>
                  <p className='mt-32 text-gray-400'>use high-quality JPG, SVG, PNG. Less than 20 MB</p>
                </div>
                <input
                type="file"
                className="w-0 h-0"
                name='image'
                style={   {
                  textIndent: '-999em',
                  outline: 'none',
                  position: 'absolute',
              }}
                onChange={uploadImage}/>
              </label>

            ): <div className='relative h-full'>
                <img src={imageAsset} className="h-full w-full"/>
                <button
                type='button'
                className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                onClick={()=> setImageAsset(null)}
                ><MdDelete/></button>
              </div>}
          </div>
        </div> 

        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
          type="text"
          value={title}
          onChange={(e)=> setTitle(e.target.value)}
          placeholder="Add your title"
          className='outline-none text-md border-b-2 border-gray-200 p-2' />

          <input
          type="text"
          value={about}
          onChange={(e)=> setAbout(e.target.value)}
          placeholder="Add your About"
          className='outline-none text-md border-b-2 border-gray-200 p-2' />

          <input
          type="text"
          value={url}
          onChange={(e)=> setUrl(e.target.value)}
          placeholder="Add a Link"
          className='outline-none text-md border-b-2 border-gray-200 p-2' />

          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold'>Choose Pin Category</p>
              <select onChange={(e)=> setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 bg-white border-gray-200 p-2 rounded-md cursor-pointer">
                  <option value="others" className='bg-white' >Select Category</option>
                  {
                  categories.map(cat=><option key={cat.id}
                    value={cat.id}
                    className='text-base border-0 outline-none capitalize bg-white text-black'>
                      {cat.title}
                    </option>)
                    }
              </select>
            </div>

            <div className='flex justify-end items-end mt-5'>
              <button type='button' onClick={save_pin} className="bg-red-500 text-white font-bold p-4 rounded-full w-28 outline-none">
                Create
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default CreatePin

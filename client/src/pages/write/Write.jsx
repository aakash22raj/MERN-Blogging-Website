import "./Write.css";
import { IoMdAdd } from "react-icons/io";
// import { img1 } from "../../assets";
import { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Write() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const {user} = useContext(Context); 

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newPost = {
            username: user.username,
            title,
            desc,
        };
        if(file){
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            newPost.photo = filename;
            try {
                await axios.post("/upload", data);
            } catch (error) {
                console.error("File upload error:", error);
            }
        }
        try {
            const res = await axios.post("/posts", newPost);
            window.location.replace("/post/" + res.data._id);
        } catch (error) {
            console.error("Post submission error:", error);
        }
    };

  return (
    <div className="write">
        {file && (
            <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
        )}

        <form className="writeForm" onSubmit={handleSubmit}>
            <div className="writeFormGroup">
                <label htmlFor="fileInput">
                    <i className="writeIcon"><IoMdAdd /></i>
                </label>
                <input 
                    type="file" 
                    id="fileInput" 
                    style={{display:"none"}} 
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <input 
                    type="text" 
                    placeholder="Title" 
                    className="writeInput" 
                    autoFocus={true} 
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="writeFormGroup">
                <textarea 
                    placeholder="Tell your story..."
                    type="text"
                    className="writeInput writeText"
                    onChange={(e) => setDesc(e.target.value)}
                ></textarea>
            </div>
            <button className="writeSubmit" type="submit">Publish</button>
        </form>
    </div>
  )
}

import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { AuthContext } from "../../context/AuthContext";

const Update = ({ setOpenUpdate, user }) => {
  // const {currentUser} = useContext(AuthContext);
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const upload = async (file) => {
    console.log("uploading file "+file)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  // const handleClick = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     // Create an array to store the promises for uploading cover and profile pictures
  //     const uploadPromises = [];
  
  //     // Check if a new cover picture is selected and add it to the promises
  //     if (cover) {
  //       uploadPromises.push(upload(cover));
  //     } else {
  //       uploadPromises.push(user.coverPic); // Use the existing cover picture URL
  //     }
  
  //     // Check if a new profile picture is selected and add it to the promises
  //     if (profile) {
  //       uploadPromises.push(upload(profile));
  //     } else {
  //       uploadPromises.push(user.profilePic); // Use the existing profile picture URL
  //     }
  
  //     // Use Promise.all to upload both pictures in parallel and await the results
  //     const [coverUrl, profileUrl] = await Promise.all(uploadPromises);
  
  //     // Update the user data with the new picture URLs and other text fields
  //     mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
  
  //     // Close the update modal and reset the file inputs
  //     setOpenUpdate(false);
  //     setCover(null);
  //     setProfile(null);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  
  const handleClick = async (e) => {
    e.preventDefault();
  
    //TODO: find a better way to get image URL
    
    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

   let info = JSON.parse(localStorage.getItem("user"));
   console.log("informations" ,JSON.stringify(info))
   info.profilePic = profileUrl;
   info.coverPic = coverUrl;
   console.log("informations" ,JSON.stringify(info))
   localStorage.setItem("user",JSON.stringify(info));
    
    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };



  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
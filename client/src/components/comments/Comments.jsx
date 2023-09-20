import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/AuthContext";
import { useQuery,useMutation,useQueryClient } from 'react-query'
import { makeRequest } from "../../axios";
import moment from "moment";


const Comments = ({postId}) => {
  const { currentUser } = useContext(AuthContext);

  const [desc,setDesc] = useState("");


  const { isLoading, error, data } = useQuery('comments', () =>
  makeRequest.get("/comments?postId="+postId).then((res)=>{
    return res.data;
  })
  )



// ------------------------

const queryClient = useQueryClient();

const mutation = useMutation(
  (newComment)=>{
   
return makeRequest.post("/comments",newComment)
}, {
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries(["comments"]);
  },
})


const handleClick =async (e)=>{
e.preventDefault();

mutation.mutate({desc,postId})
setDesc("");

}



 



  return (
    <div className="comments">
      <div className="write">
        {console.log("test currentUser"+currentUser.name +currentUser.email+currentUser.profilePic)}
      <img src={"../upload/" + currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" 
        value={desc}
        onChange={(e)=>setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ?"loading..."
        :data.map((comment) => (
        <div className="comment">
          {console.log("test comment:" +comment.profilePic)}
          <img src={"../upload/"+comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
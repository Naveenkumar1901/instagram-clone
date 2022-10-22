import React, { useState } from "react";
import "./posts.css";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as PlainLikeIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "./Firebase";
import LoadingButton from "@mui/lab/LoadingButton";
import {  TextField, Tooltip } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteObject, ref } from "firebase/storage";
const Posts = ({
  caption,
  createdAt,
  imgUrl,
  likes,
  user,
  comments,
  id,
  type,
}) => {
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const [commentValue, setCommentValue] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [loading, SetLoading] = useState(false);

  const handleLike = async (update, docId, likes) => {
    let newLikes;
    if (update) {
      newLikes = [...likes, currentUser.user.email];
    } else {
      newLikes = likes?.filter((value) => value !== currentUser.user.email);
    }

    const itemRef = doc(db, "post", docId);

    await updateDoc(itemRef, {
      likes: newLikes,
    });
  };

  const handleComment = async (docId) => {
    let newComments;
    if (commentValue.length) {
      SetLoading(true);
      newComments = [
        ...comments,
        { user: currentUser.user.email, comment: commentValue },
      ];
    }
    const addRef = doc(db, "post", docId);
    await updateDoc(addRef, {
      comments: newComments,
    });
    SetLoading(false);
    setCommentValue("");
  };

  const deletePost = async (id, fileUrl) => {
    try {
      await deleteDoc(doc(db, "post", id));
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="posts-container">
        <div className="each-post">
          <div className="post-header">
            <div className="post-header-seperate">
              <div className="user-avatar">{user?.at(0)}</div>
              <h1 className="header-username">{user.split("@")[0]}</h1>
            </div>
            {currentUser.user.email === user && (
              <Tooltip title="Delete Post">
                <div className="delete-post">
                  <AiOutlineDelete onClick={() => deletePost(id, imgUrl)} />
                </div>
              </Tooltip>
            )}
          </div>
          {type.includes("image") ? (
            <img className="post-image" src={imgUrl} alt="" />
          ) : (
            <video src={imgUrl} alt="" controls className="video-container" />
          )}
          <div className="like-section">
            <div className="like-icon">
              {likes?.includes(currentUser.user.email) ? (
                <HeartIcon
                  className="liked-icon"
                  onClick={() => handleLike(0, id, likes)}
                />
              ) : (
                <PlainLikeIcon
                  className="plain-liked-icon"
                  onClick={() => handleLike(1, id, likes)}
                />
              )}
            </div>
            <h1 className="like-count">
              <h2 className="count-text">{likes?.length} likes </h2>
            </h1>
          </div>

          <div className="caption">
            <h1 className="post-caption">
              <strong className="caption-username">{user.split("@")[0]}</strong>
              {caption?.length > 100 && !showFullCaption ? (
                <p style={{ display: "inline" }}>
                  {caption.substring(0, 50)}{" "}
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#8e8e8e",
                    }}
                    onClick={() => setShowFullCaption(true)}
                  >
                    ... more
                  </span>
                </p>
              ) : showFullCaption ? (
                <p style={{ display: "inline" }}>{caption}</p>
              ) : (
                caption
              )}
            </h1>
          </div>
          <h1 className="time-stamp">
            {createdAt && createdAt.seconds
              ? moment(new Date(createdAt.seconds * 1000)).format(
                  "MMM D, h:mm a"
                )
              : "JUST NOW"}
          </h1>
          {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            handleComment();
          }}
        > */}
          {comments.length ? (
            <p
              className="view-comments"
              onClick={() => setShowComments((prev) => !prev)}
            >
              {!showComments ? "view" : "hide"} all {comments.length} comments
            </p>
          ) : null}

          <div className="added-comments">
            {showComments ? (
              <span className="comments-received">
                {comments?.map((comment) => (
                  <p>
                    <strong className="comment-user">
                      {comment.user.split("@")[0]}
                    </strong>
                    <span className="comment-content">{comment.comment}</span>
                  </p>
                ))}
              </span>
            ) : null}
          </div>

          <div className="post-comment">
            <TextField
              type="text"
              className="comment-input"
              id="standard-multiline-static"
              multiline
              rows={1}
              placeholder="Add a comment..."
              variant="standard"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            />

            <LoadingButton
              loading={loading}
              className="comment-submit"
              loadingPosition="middle"
              onClick={() => handleComment(id)}
            >
              Post
            </LoadingButton>
          </div>
          {/* </form> */}
        </div>
      </div>
    </>
  );
};

export default Posts;

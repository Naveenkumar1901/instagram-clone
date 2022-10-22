import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import { db, storage } from "./Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 } from "uuid";
import "./posts.css";
import post from "./img/post.png";
import LoadingButton from "@mui/lab/LoadingButton";

const Popup = ({ addPostModalVisible, setAddPostModalVisible }) => {
  const [caption, setCaption] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, SetLoading] = useState(false);

  const uploadFile = () => {
    if (imageUpload == null) return;
    SetLoading(true);
    const user = JSON.parse(localStorage.getItem("currentuser"));
    console.log(imageUpload.type, "imageUpload");
    const imageRef = ref(storage, `${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        await addDoc(collection(db, "post"), {
          imgUrl: url,
          caption: caption,
          createdAt: serverTimestamp(),
          user: user.user.email,
          likes: [],
          comments: [],
          type: imageUpload.type,
        });
        SetLoading(false);
        setAddPostModalVisible(false);
        setImageUpload(null);
      });
    });
  };

  return (
    <Dialog
      className="popup-box"
      open={addPostModalVisible}
      onClose={() => setAddPostModalVisible(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle className="dialog-title">
        <p className="title-text">Create new post</p>
      </DialogTitle>
      <DialogContent className="content">
        <div className="dialog-content">
          <img className="post-pic" src={post} alt="" />
          <h1 className="pic-text">Add photos and videos here</h1>
          <Button className="file-upload" variant="contained" component="label">
            <input
              accept="image/*,video/*"
              multiple
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
          </Button>

          <div className="caption-box">
            <TextField
              className="caption-box"
              id="outlined-multiline-static"
              multiline
              rows={1}
              placeholder="Write a caption..."
              variant="standard"
              onChange={(event) => setCaption(event.target.value)}
            />
          </div>
          <LoadingButton loading={loading} onClick={uploadFile}>
            Upload
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;

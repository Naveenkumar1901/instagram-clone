import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import Posts from "./Posts";
import Status from "./Status";
import "./home.css";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./Firebase";
let snapMessages;

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentuser"));
    console.log("home error");
    if (!user) navigate("/login");
  }, [navigate]);

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    setLoading(true);
    snapMessages = onSnapshot(
      query(collection(db, "post"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setLoading(false);
        const data = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
        setPosts(data);
      }
    );

    return () => snapMessages();
  }, []);

  function scrollToTop() {
    scrollRef.current.scrollTop = 0;
  }

  return (
    <div className="home-page">
      {loading ? (
        <loading />
      ) : (
        <>
          <Header
            user={JSON.parse(localStorage.getItem("currentuser")).user}
            scrollToTop={scrollToTop}
          />
          <div className="scrollable-container" ref={scrollRef}>
            <Status />
            {posts?.map((post) => (
              <Posts
                caption={post.caption}
                createdAt={post.createdAt}
                imgUrl={post.imgUrl}
                user={post.user}
                likes={post.likes}
                comments={post.comments}
                id={post.id}
                type={post.type}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

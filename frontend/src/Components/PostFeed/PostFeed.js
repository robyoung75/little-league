import React, { useEffect, useState } from "react";
import "./PostFeed.css";
import { useStateValue } from "../../Context/stateProvider";
import {
  ThemedHeader,
  ThemedDiv,
  ThemedButton,
} from "../../utils/ThemedComponents";
import Avatar from "../Avatar/Avatar";

import post_1 from "../../assets/images/posts/post_1.jpg";
import post_2 from "../../assets/images/posts/post_2.jpg";
import post_3 from "../../assets/images/posts/post_3.jpg";
import { faRandom } from "@fortawesome/free-solid-svg-icons";
import { number } from "yup";

function PostFeed() {
  const [{ authTheme, posts, userData, authPosts, authUser }, dispatch] =
    useStateValue();
  const [testPost] = useState([
    { user: "userName", date: new Date().toDateString(), post: post_1, id: 1 },
    { user: "userName", date: new Date().toDateString(), post: post_2, id: 2 },
    { user: "userName", date: new Date().toDateString(), post: post_3, id: 3 },
  ]);

  useEffect(() => {
    dispatch({
      type: "SET_POSTS",
      posts: testPost,
    });
  }, [dispatch, testPost]);

  const PostImage = ({ post, user, date }) => {
    return (
      <ThemedDiv theme={authTheme} className="postImage">
        <ThemedHeader theme={authTheme} className="postImage__header">
          <div className="postImage__info">
            <div className="postFeed__avatar">
              <Avatar />
              <span>{user}</span>
            </div>
            <span>{date}</span>
          </div>
        </ThemedHeader>

        {post.map((item, index) => (
          <img src={item} key={index} alt="post" className="postImage__img" />
        ))}

        {authUser && (
          <div className="postImage__btnContainer">
            <div className="postImage__btn">
              <ThemedButton theme={authTheme}>Delete</ThemedButton>
            </div>
          </div>
        )}
      </ThemedDiv>
    );
  };
  return (
    <div className="postFeed">
      {authPosts
        ? authPosts.posts.map((post) => (
            <PostImage
              post={post.postImages.map((image) => image.secureURL)}
              key={post._id}
              user={post.user}
              date={post.date}
            />
          ))
        : null}
    </div>
  );
}

export default PostFeed;

import axios from "axios";
const baseURL = axios.create({ baseURL: "https://htpncnews.onrender.com/api" });

const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
const pexelsURL = axios.create({
  baseURL: "https://api.pexels.com/v1/photos/",
  headers: { Authorization: apiKey },
});

export function fetchArticles(queries) {
  return baseURL
    .get("/articles", { params: queries })
    .then((response) => response.data.articles);
}

export function fetchPhotoData(photoURL) {
  const regex = /(?<=photos\/)\d+/;
  const photo_id = photoURL.match(regex)[0];
  return pexelsURL.get(photo_id).then((response) => {
    return {
      alt: response.data.alt,
      photo_url: response.data.url,
      photographer: response.data.photographer,
      photographer_url: response.data.photographer_url,
    };
  });
}

export function fetchSingleArticle(article_id) {
  return baseURL
    .get("/articles/" + article_id)
    .then((response) => response.data.article);
}

export function fetchComments(article_id) {
  return baseURL
    .get("/articles/" + article_id + "/comments")
    .then((response) => response.data.comments);
}

export function fetchUserInfo(username) {
  return baseURL
    .get("/users/" + username)
    .then((response) => response.data.user);
}

export function patchVote(endpoint, id, positive) {
  const vote = positive ? 1 : -1;
  return baseURL
    .patch(`/${endpoint}/${id}`, { inc_votes: vote })
    .then((response) => response.data.comment)
    .catch((error) => Promise.reject(error));
}

export function postComment(article_id, author, body) {
  return baseURL
    .post(`/articles/${article_id}/comments`, { body, author })
    .catch((error) => {
      console.log(error);

      return Promise.reject(error);
    });
}

export function deleteComment(comment_id) {
  return baseURL.delete("/comments/" + comment_id);
}

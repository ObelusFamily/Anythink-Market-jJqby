import superagentPromise from "superagent-promise";
import _superagent from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000/api"
    : "https://api.anythink.market/api";

const encode = encodeURIComponent;
const responseBody = (res) => res.body;

let token = null;
const tokenPlugin = (req) => {
  if (token) {
    req.set("authorization", `Token ${token}`);
  }
};

const requests = {
  del: (url) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
};

const Auth = {
  current: () => requests.get("/user"),
  login: (email, password) =>
    requests.post("/users/login", { user: { email, password } }),
  register: (username, email, password) =>
    requests.post("/users", { user: { username, email, password } }),
  save: (user) => requests.put("/user", { user }),
};

const Tags = {
  getAll: () => requests.get("/tags"),
};

const applyPlaceholderImg = (item) => {
  if (!item.image) {
    item.image = "/placeholder.png";
  }
  return item;
};

const applyItemDefaults = (data) => {
  console.log(data);
  if (data.items) {
    data.items = data.items.map((item) => {
      return applyPlaceholderImg(item);
    });
  }
  if (data.item) {
    data.item = applyPlaceholderImg(data.item);
  }
  return data;
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = (item) => Object.assign({}, item, { slug: undefined });
const Items = {
  all: (page) =>
    requests.get(`/items?${limit(1000, page)}`).then(applyItemDefaults),
  bySeller: (seller, page) =>
    requests
      .get(`/items?seller=${encode(seller)}&${limit(500, page)}`)
      .then(applyItemDefaults),
  byTag: (tag, page) =>
    requests
      .get(`/items?tag=${encode(tag)}&${limit(1000, page)}`)
      .then(applyItemDefaults),
  del: (slug) => requests.del(`/items/${slug}`),
  favorite: (slug) => requests.post(`/items/${slug}/favorite`),
  favoritedBy: (seller, page) =>
    requests
      .get(`/items?favorited=${encode(seller)}&${limit(500, page)}`)
      .then(applyItemDefaults),
  feed: () =>
    requests.get("/items/feed?limit=10&offset=0").then(applyItemDefaults),
  get: (slug) => requests.get(`/items/${slug}`).then(applyItemDefaults),
  unfavorite: (slug) => requests.del(`/items/${slug}/favorite`),
  update: (item) =>
    requests.put(`/items/${item.slug}`, { item: omitSlug(item) }),
  create: (item) => requests.post("/items", { item }),
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/items/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/items/${slug}/comments/${commentId}`),
  forItem: (slug) => requests.get(`/items/${slug}/comments`),
};

const Profile = {
  follow: (username) => requests.post(`/profiles/${username}/follow`),
  get: (username) => requests.get(`/profiles/${username}`),
  unfollow: (username) => requests.del(`/profiles/${username}/follow`),
};

const agentObj = {
  Items,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token) => {
    token = _token;
  },
};

export default agentObj;

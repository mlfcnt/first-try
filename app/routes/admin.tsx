import { Link, useLoaderData, Outlet } from "remix";
import { deletePost, getPosts } from "~/post";
import adminStyles from "~/styles/admin.css";

export const links = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export const loader = async (req) => {
  console.log(req);
  const posts = await getPosts();
  return {
    posts,
    deletePost,
  };
};

export default function Admin() {
  const { posts, deletePost } = useLoaderData<any>();
  return (
    <div className="admin">
      <nav>
        <h1>Admin</h1>

        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
              <button onClick={() => deletePost(post.slug)}>🗑️</button>
            </li>
          ))}
          <li>
            <Link to="guiz">😺</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

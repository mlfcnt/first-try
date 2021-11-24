import { Link, useLoaderData } from "remix";
import { getPosts, Post } from "~/post";

export const loader = async () => {
  const posts = await getPosts();
  return {
    posts,
  };
};

export default function Posts() {
  const { posts } = useLoaderData<{ posts: Post[] }>();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

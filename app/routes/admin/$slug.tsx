import { useLoaderData, LoaderFunction, ActionFunction } from "remix";
import invariant from "tiny-invariant";
import { PostForm } from "~/components/PostForm";
import { getPost, Post } from "~/post";
import { handlePost } from "../../../lib/handlePost";

export const action: ActionFunction = async ({ request, params }) => {
  return handlePost(request, params);
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  const post = getPost(params.slug);
  return post;
};

function edit() {
  const post = useLoaderData<Post>();
  return <PostForm post={post} />;
}

export default edit;

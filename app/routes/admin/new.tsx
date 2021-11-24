import { PostForm } from "~/components/PostForm";
import { ActionFunction } from "remix";
import { handlePost } from "../../../lib/handlePost";

export const action: ActionFunction = async ({ request }) => {
  return handlePost(request);
};

export default function NewPost() {
  return <PostForm />;
}

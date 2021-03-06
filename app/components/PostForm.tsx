import {
  Form,
  useActionData,
  useTransition,
  ActionFunction,
  redirect,
} from "remix";
import invariant from "tiny-invariant";
import { createPost, Post } from "~/post";

type Props = {
  post?: Post;
};

export const action: ActionFunction = async ({ request }) => {
  console.log("HERE");
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  let errors: any = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export const PostForm = ({ post }: Props) => {
  const errors = useActionData();
  const transition = useTransition();
  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" defaultValue={post?.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug && <em>Slug is required</em>}
          <input type="text" name="slug" defaultValue={post?.slug} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea rows={20} name="markdown" defaultValue={post?.html} />
      </p>
      <p>
        <button type="submit">{`${post ? "Edit" : "Create"} post`}</button>
        {transition.submission && "Creating... / Editing..."}
      </p>
    </Form>
  );
};

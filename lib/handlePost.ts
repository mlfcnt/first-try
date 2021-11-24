import { redirect } from "remix";
import invariant from "tiny-invariant";
import { createPost, updatePost } from "~/post";

export const handlePost = async (request: any, params?: any) => {
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

  params
    ? await updatePost({
        title,
        slug,
        markdown,
      })
    : await createPost({
        title,
        markdown,
        slug,
      });

  return redirect("/admin");
};

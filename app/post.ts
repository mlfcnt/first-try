import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  html: string;
};

export type NewPost = Omit<Post, "html"> & { markdown: string };
export type EditPost = NewPost;

export type PostMarkdownAttributes = {
  title: string;
};

// relative to the server output not the source!
const postsPath = path.join(__dirname, "..", "posts");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts() {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter(file.toString());
      invariant(isValidPostAttributes(attributes), "Invalid post attributes");
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  const html = marked(body);
  return { slug, html, title: attributes.title };
}

export async function createPost(post: NewPost) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, post.slug + ".md"), md);
  return getPost(post.slug);
}

export async function updatePost(post: EditPost) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  deletePost(post.slug);
  await fs.writeFile(path.join(postsPath, post.slug + ".md"), md);
  return getPost(post.slug);
}

export async function deletePost(slug: string) {
  return fs.rm(path.join(postsPath, slug + ".md"));
}

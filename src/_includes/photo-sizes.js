// The resized WebP copies of a photo: the same ones the image transform makes
// for <img> tags (see eleventy.config.js). Used by /photos.json and /photos.xml.

import path from "node:path";
import Image from "@11ty/eleventy-img";

// "/assets/uploads/My photo.webp" → its sizes, smallest first. Each size's
// url is root-relative ("/img/…") without the site's /photos/ prefix; callers
// add it. outputDir is the build's output folder (eleventy.directories.output),
// so the copies land beside the transform plugin's, whatever --output says.
export async function photoSizes(src, outputDir = "_site") {
  const { webp } = await Image(`src${decodeURI(src)}`, {
    // Keep in step with eleventyImageTransformPlugin in eleventy.config.js, so
    // both write (and share) the same files.
    widths: [480, 960, 1600, 2400],
    formats: ["webp"],
    outputDir: path.join(outputDir, "img"),
    urlPath: "/img/",
  });
  return webp;
}

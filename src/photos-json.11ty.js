// /photos.json — every photo set, newest first, for the Photostream app
// (github.com/willchambers/photostream, served at /photos/photostream/).
// Served at https://willchambers.github.io/photos/photos.json; every URL in it
// is same-origin and root-relative, /photos/ prefix included.
//
// Each photo comes with the same resized WebP copies the image transform makes
// for <img> tags (see eleventy.config.js), so the app can use srcset and never
// has to download the full-size upload on a phone.

import path from "node:path";
import { photoSizes } from "./_includes/photo-sizes.js";

async function sizesFor(src, base, outputDir) {
  const webp = await photoSizes(src, outputDir);
  const url = (u) => base.replace(/\/$/, "") + u;
  const largest = webp[webp.length - 1];
  return {
    src: url(largest.url),
    width: largest.width,
    height: largest.height,
    srcset: webp.map((size) => `${url(size.url)} ${size.width}w`).join(", "),
  };
}

export default class {
  data() {
    return { permalink: "/photos.json", eleventyExcludeFromCollections: true };
  }

  async render({ collections, site, eleventy }) {
    const outputDir = eleventy.directories.output;
    const prefix = site.base.replace(/\/$/, "");
    const posts = [];

    for (const set of [...collections.photoSets].reverse()) {
      const photos = [];
      for (const photo of set.data.images || []) {
        try {
          photos.push({
            ...(await sizesFor(photo.image, site.base, outputDir)),
            original: prefix + photo.image,
            alt: photo.alt || "",
            caption: photo.caption || "",
          });
        } catch (err) {
          console.warn(`[photos.json] Skipped ${photo.image} in ${set.inputPath}: ${err.message}`);
        }
      }
      if (!photos.length) continue;

      posts.push({
        // The file name, date prefix included (fileSlug drops it). Photostream
        // names its posts the same way, so ids match across the two.
        id: path.basename(set.inputPath, ".md"),
        title: set.data.title,
        description: set.data.description || "",
        date: set.date.toISOString(),
        location: set.data.location || "",
        topics: set.data.topics || [],
        photos,
      });
    }

    return JSON.stringify({
      version: 1,
      title: site.title,
      home_page_url: `${site.url}${site.base}`,
      posts,
    });
  }
}

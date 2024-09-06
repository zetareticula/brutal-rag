import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { html as toReactElement } from 'satori-html';

// Load font data
const fontFile = await fetch(
  'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
);
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

// Set dimensions for the image
const height = 630;
const width = 1200;

const posts = await getCollection('blog');

export function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title, description: post.data.description },
  }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const title = props.title.trim() ?? 'Blogpost';
  const description = props.description ?? null;

  // HTML content with two-column layout: User prompt (left) and System response (right)
  const html = toReactElement(`
  <div style="display: flex; flex-direction: row; height: 100%; padding: 3rem; width: 100%">
    
    <!-- Left Column: User Prompt -->
    <div style="flex: 1; background-color: #f0f0f0; padding: 2rem; border-right: 2px solid #ccc;">
      <h2 style="font-size: 32px; font-weight: 700;">User Prompt</h2>
      <p style="font-size: 24px; color: #333;">User: to aide in the processing of simple resource allocation</p>
    </div>

    <!-- Right Column: System Response -->
    <div style="flex: 1; background-color: #ffffff; padding: 2rem;">
      <h2 style="font-size: 32px; font-weight: 700;">System Response</h2>
      <p style="font-size: 24px; color: #000;">
        Clever: Ask me Anything about Access to Clever Aging Resources with Large Language Foundational Models
      </p>
    </div>

  </div>
  `);

  // Generate the SVG using satori
  const svg = await satori(html, {
    fonts: [
      {
        name: 'Inter Latin',
        data: fontData,
        style: 'normal',
      },
    ],
    height,
    width,
  });

  // Set rendering options
  const opts: ResvgRenderOptions = {
    fitTo: {
      mode: 'width',
      value: width,
    },
  };

  // Render the SVG as PNG
  const resvg = new Resvg(svg, opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'content-type': 'image/png',
    },
  });
};





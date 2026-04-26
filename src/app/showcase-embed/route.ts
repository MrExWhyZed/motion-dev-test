import { NextResponse } from 'next/server';

/*
 * /showcase-embed — serves a fully self-contained HTML page that the
 * VideoShowcase iframe points at. Isolated from Lenis / parent GSAP / overflow:clip.
 *
 * Scroll progress is received via window.postMessage({ type: 'vs-scroll', progress })
 * from the parent page's VideoShowcase component and used to drive the mask scale.
 *
 * Animation mirrors the original macbook Showcase.jsx exactly:
 *   - Desktop: mask img starts at matrix(80,0,0,80,0,0) and scales down to 1.1
 *              as the user scrolls through the 200vh parent container.
 *   - Tablet/mobile (≤1024px): mask img stays at scale(1) — no animation.
 */

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
  }

  /* Sticky panel — locks at viewport top while parent page scrolls */
  #showcase {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #000;
  }

  /* Full-bleed background video */
  #showcase video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  /* Mask overlay centred over the video */
  #showcase .mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
  }

  /* The mask image — will-change keeps GPU compositing smooth */
  #showcase .mask img {
    height: 100%;
    display: block;
    will-change: transform;
  }
</style>
</head>
<body>

<section id="showcase">
  <video
    src="https://res.cloudinary.com/dsst5hzgf/video/upload/v1775637354/Linkedin_final_rfdz0t.mp4"
    loop muted autoplay playsinline>
  </video>
  <div class="mask">
    <img id="mask-img" src="/mask-logo.svg" alt="" />
  </div>
</section>

<script>
  var maskImg = document.getElementById('mask-img');
  var isTablet = window.matchMedia('(max-width: 1024px)').matches;

  if (isTablet) {
    // Mobile / tablet: show the logo unscaled, no animation
    maskImg.style.transform = 'scale(1)';
  } else {
    // Desktop: start fully zoomed in (logo covers entire frame = solid black)
    // mirrors the original: transform: matrix(80, 0, 0, 80, 0, 0)
    maskImg.style.transform = 'matrix(80,0,0,80,0,0)';

    // Receive scroll progress from VideoShowcase (parent page)
    // progress 0 = section enters viewport top
    // progress 1 = section fully scrolled past
    window.addEventListener('message', function (e) {
      if (!e.data || e.data.type !== 'vs-scroll') return;
      var p = Math.max(0, Math.min(1, e.data.progress));
      // Interpolate scale from 80 down to 1.1 — same end value as the
      // original GSAP tween: .to(".mask img", { transform: "scale(1.1)" })
      var scale = 80 - (80 - 1.1) * p;
      maskImg.style.transform = 'scale(' + scale + ')';
    });
  }
</script>

</body>
</html>`;

export async function GET() {
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

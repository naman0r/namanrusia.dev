import { Effect } from "postprocessing";
import { Uniform } from "three";

// Ordered 4x4 Bayer dither to a few levels per channel. The canvas already renders at a
// fraction of screen resolution, so each fragment here is one visible "pixel".
const fragment = /* glsl */ `
uniform float levels;

float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int i = x + y * 4;
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return float(m[i]) / 16.0 - 0.5;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = pow(max(inputColor.rgb, 0.0), vec3(1.0 / 2.2));
  // Leave the near-black page alone, otherwise the background would crawl with dither.
  if (max(c.r, max(c.g, c.b)) < 0.09) {
    outputColor = inputColor;
    return;
  }
  vec3 q = floor(c * levels + 0.5 + bayer4(gl_FragCoord.xy) * 0.85) / levels;
  outputColor = vec4(pow(clamp(q, 0.0, 1.0), vec3(2.2)), inputColor.a);
}
`;

export class DitherEffect extends Effect {
  constructor(levels = 7) {
    super("DitherEffect", fragment, { uniforms: new Map([["levels", new Uniform(levels)]]) });
  }
}

import type { SVGProps } from 'react';

/**
 * Mark only, no strapline (brand Asset 2).
 * Colour is driven entirely by --logo-letter / --logo-accent, which every ground
 * scope in globals.css sets. Never hard-code a fill here.
 * Intrinsic ratio 199.64 x 74.41; always pass an explicit width so there is no CLS.
 */
export function LogoMark({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 199.64 74.41"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <g>
      <g>
      <rect fill="var(--logo-letter)" y="0" width="16.16" height="74.41" rx="2.34" ry="2.34"/>
      <path fill="var(--logo-letter)" d="M59.42,14.99h46.67c1.49,0,2.34-.85,2.34-2.34V2.34c0-1.59-.85-2.34-2.34-2.34h-46.77c-21.58,0-29.77,7.76-29.77,28.06v18.29c0,20.3,8.19,28.06,29.77,28.06h46.77c1.49,0,2.34-.75,2.34-2.34v-10.31c0-1.49-.85-2.34-2.34-2.34h-46.67c-10.95,0-13.82-3.08-13.82-14.24v-1.27h.03v-14.14h-.03v-.53c0-11.16,2.87-14.24,13.82-14.24"/>
      <path fill="var(--logo-accent)" d="M107.08,32.48v9.46c0,1.59-.85,2.34-2.34,2.34l-43.61-.36c-.99,0-1.78-.81-1.78-1.8v-10.54c0-1,.82-1.81,1.82-1.8l43.58.35c1.49,0,2.34.74,2.34,2.34"/>
      <path fill="var(--logo-letter)" d="M194.54,0c1.49,0,2.34.74,2.34,2.34v10.31c0,1.49-.85,2.34-2.34,2.34h-53.26c-3.83,0-5.63,1.81-5.63,5.74v3.61c0,3.83,1.7,5.42,5.63,5.42h39.76c11.91,0,18.6,6.8,18.6,18.71v8.61c0,10.95-6.59,17.33-18.82,17.33h-58.89c-1.59,0-2.34-.74-2.34-2.34v-10.31c0-1.49.74-2.34,2.34-2.34h55.81c3.72,0,5.63-1.81,5.63-5.74v-4.36c0-3.83-1.59-5.42-5.53-5.42h-39.86c-11.91,0-18.5-6.8-18.5-18.71v-7.87C119.48,6.38,125.97,0,138.19,0h56.34Z"/>
      </g>
      </g>
    </svg>
  );
}

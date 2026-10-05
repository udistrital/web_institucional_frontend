import type { MDXComponents } from "mdx/types";

const components = {
  h1: (props) => <h1 className="mb-4 text-2xl font-extrabold text-[#8c1919]" {...props} />,
  h2: (props) => <h2 className="mb-3 mt-6 text-xl font-extrabold text-[#8c1919]" {...props} />,
  h3: (props) => <h3 className="mb-2 mt-5 text-lg font-extrabold text-[#8c1919]" {...props} />,
  p: (props) => <p className="mb-4" {...props} />,
  ul: (props) => <ul className="mb-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal space-y-2 pl-6" {...props} />,
  a: (props) => <a className="font-bold text-[#8c1919] underline decoration-[#fdb400] decoration-2 underline-offset-2" {...props} />,
  strong: (props) => <strong className="font-extrabold" {...props} />,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}

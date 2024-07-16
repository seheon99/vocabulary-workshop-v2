import path from "path";

function buildEslintCommand(filenames) {
  return `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;
}

export default {
  "*.{js,ts,tsx}": [buildEslintCommand],
};

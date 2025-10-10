import type * as Preset from "@docusaurus/preset-classic";
import type { Config, PluginConfig } from "@docusaurus/types";
import type { PluginOptions as LlmsTxtPluginOptions } from "@signalwire/docusaurus-plugin-llms-txt";
import { themes as prismThemes } from "prism-react-renderer";

const commonApiDocsConfig = {
  readme: "none",
  cleanOutputDir: true,
  indexFormat: "table",
  parametersFormat: "table",
  enumMembersFormat: "table",
  useCodeBlocks: true,
  textContentMappings: {
    "title.indexPage": "{projectName} {version}",
    "title.memberPage": "{name}",
  },
};

const config: Config = {
  title: "ReactiveDOT",
  tagline: "A reactive library for building Substrate front-ends",
  favicon: "img/favicon.ico",

  url: "https://reactivedot.dev",
  baseUrl: "/",

  organizationName: "buffed-labs",
  projectName: "reactive-dot",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "react",
          routeBasePath: "react",
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/buffed-labs/reactive-dot/tree/main/apps/docs",
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "vue",
        path: "vue",
        routeBasePath: "vue",
        sidebarPath: "./sidebars.ts",
        editUrl:
          "https://github.com/buffed-labs/reactive-dot/tree/main/apps/docs",
        remarkPlugins: [
          [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
        ],
      },
    ],
    coreApi("react"),
    [
      "docusaurus-plugin-typedoc",
      {
        id: "api-react",
        entryPoints: ["../../packages/react/src/index.ts"],
        tsconfig: "../../packages/react/tsconfig.json",
        out: "react/api/react",
        ...commonApiDocsConfig,
      },
    ],
    utilsApi("react"),
    coreApi("vue"),
    [
      "docusaurus-plugin-typedoc",
      {
        id: "api-vue",
        entryPoints: ["../../packages/vue/src/index.ts"],
        tsconfig: "../../packages/vue/tsconfig.json",
        out: "vue/api/vue",
        ...commonApiDocsConfig,
      },
    ],
    utilsApi("vue"),
    [
      "@signalwire/docusaurus-plugin-llms-txt",
      {
        depth: 2,
        content: { enableLlmsFullTxt: true },
      } satisfies LlmsTxtPluginOptions,
    ],
  ],

  themeConfig: {
    image: "img/social-card.png",
    navbar: {
      title: "ReactiveDOT",
      logo: {
        alt: "ReactiveDOT logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          label: "React",
        },
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          docsPluginId: "vue",
          label: "Vue",
        },
        {
          href: "https://github.com/buffed-labs/reactive-dot",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Made with a literal 💻 by <a href="https://tien.zone/" target="_blanck">Tiến</a>`,
    },
    prism: {
      additionalLanguages: ["bash"],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

function coreApi(base: string) {
  return [
    "docusaurus-plugin-typedoc",
    {
      id: `api-core-${base}`,
      entryPoints: [
        "../../packages/core/src/index.ts",
        "../../packages/core/src/providers/light-client/index.ts",
        "../../packages/core/src/wallets/index.ts",
      ],
      tsconfig: "../../packages/core/tsconfig.json",
      out: `${base}/api/core`,
      ...commonApiDocsConfig,
    },
  ] satisfies PluginConfig;
}

function utilsApi(base: string) {
  return [
    "docusaurus-plugin-typedoc",
    {
      id: `api-utils-${base}`,
      entryPoints: ["../../packages/utils/src/index.ts"],
      tsconfig: "../../packages/utils/tsconfig.json",
      out: `${base}/api/utils`,
      ...commonApiDocsConfig,
    },
  ] satisfies PluginConfig;
}

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: "ChessTerm for 久棋",
    meta: [
      { charset: "utf-8" },
      {
        hid: "viewport",
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
      {
        hid: "description",
        name: "description",
        content: "久棋专用在线云棋盘",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Global CSS
   */
  css: ["~/assets/scss/app.scss"],
  /*
   ** Progress Bar
   */
  loading: {
    color: "#27a2fc",
    failedColor: "#e8286b",
    height: "3px",
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ["~/plugins/callApi", "~/plugins/axiosAccessor"],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxt/typescript-build", "@nuxtjs/color-mode"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt-community/proxy-module
    "@nuxtjs/proxy",
  ],
  /*
   ** BootstrapVue module configuration
   ** See https://bootstrap-vue.org/docs#nuxtjs-module
   */
  bootstrapVue: {
    css: false,
    bvCSS: false,
    icons: true,
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    prefix: "/api/",
    proxy: true,
    credentials: true,
    retry: {
      retries: 2,
    },
  },
  /*
   ** Proxy module configuration
   ** See https://github.com/nuxt-community/proxy-module#options
   */
  proxy: {
    "/api": {
      target: process.env.API_URL,
      pathRewrite: { "^/api/": "" },
    },
  },
  /*
   ** Color mode module configuration
   ** See https://github.com/nuxt-community/color-mode-module#configuration
   */
  colorMode: {
    preference: "system",
    fallback: "light",
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}

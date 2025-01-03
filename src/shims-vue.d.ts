/*!
=========================================================
* © 2025 Ronan LE MEILLAT for Les Ailes du Mont-Blanc
=========================================================
This website use:
- Vite, Vue3, FontAwesome 6, TailwindCss 3
- And many others
*/
declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}

declare module '*.svg' {
  // It's really a string, precisely a resolved path pointing to the image file
  const filePath: string;

  export default filePath;
}
export const availableLanguages = ["fr-FR" , "en-US" , "es-ES" ] as const
export const svgs = import.meta.glob('../assets/lang/*.svg', { eager: true })

// 程式碼寫在這裡

import Alpine from 'alpinejs'
window.Alpine = Alpine

import { changeSection } from './section'
Alpine.data("cs", changeSection)

Alpine.start()
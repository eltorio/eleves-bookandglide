<!--
=========================================================
* © 2023 Ronan LE MEILLAT for Les Ailes du Mont-Blanc
=========================================================
This website use:
- Vite, Vue3, FontAwesome 6, TailwindCss 3
- And many others
-->
<template>
  <div
    v-if="csv.length === 0"
    class="p-12 bg-gray-100 border border-gray-300 text-gray-800"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <input
      type="file"
      multiple
      name="fields[assetsFieldHandle][]"
      id="assetsFieldHandle"
      class="w-px h-px opacity-0 overflow-hidden absolute"
      @change="onChange"
      ref="file"
      accept=".pdf,.jpg,.jpeg,.png"
    />

    <label for="assetsFieldHandle" class="block cursor-pointer">
      <div>
        {{ $t("drop_file") }}
        <span class="underline">{{ $t("clic_here") }}</span>
        {{ $t("convert_xls") }}
      </div>
    </label>
    <ul class="mt-4" v-if="filelist.length" v-cloak>
      <li class="text-sm p-1" v-for="file in filelist">
        {{ file.name
        }}<button
          class="ml-2"
          type="button"
          @click="remove(filelist.indexOf(file))"
          title="Remove file"
        >
          {{ $t('remove') }}
        </button>
      </li>
    </ul>
  </div>
  <div>
    <div class="w-full h-20 overflow-scroll">{{ csv }}</div>
    <span id="resultFile">&nbsp;</span>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { getStudents } from "@/BookAndGlide";
import { useI18n } from "vue-i18n";

const {t} = useI18n()
const file = ref<HTMLInputElement>(null as any);
const filelist = ref<File[]>([]);
const csv = ref<string>("");

function readFile(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      if (fr !== null && fr.result !== null) {
        resolve(fr.result as ArrayBuffer);
      } else {
        reject;
      }
    };
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
}

function onChange() {
  if (
    file.value !== null &&
    typeof file.value !== "undefined" &&
    file.value.files !== null
  ) {
    filelist.value = [...file.value.files];
    readFile(filelist.value[0]).then((data) => {
      if (data !== null) {
        csv.value = getStudents(data);
        const spanPlaceHolder = document.getElementById("resultFile");
        if (spanPlaceHolder !== null) {
          replaceNodeWithDownloadLink(spanPlaceHolder, csv.value, "eleves.csv");
        }
      }
    });
  }
}

function replaceNodeWithDownloadLink(
  element: HTMLElement,
  fileContent: string,
  filename: string
) {
  const a = document.createElement("a");
  const iLink = document.createElement("i");
  iLink.className = "text-ambblue-700 text-3xl fas fa-download";
  a.appendChild(iLink);
  a.title = t('download');
  a.href = "data:octet/stream;charset=utf-8," + encodeURIComponent(fileContent);
  a.download = filename;
  element.parentNode!.replaceChild(a, element);
}

function remove(i: number) {
  filelist.value.splice(i, 1);
}
function dragover(event: DragEvent) {
  event.preventDefault();
  // Add some visual fluff to show the user can drop its files
  if (
    !(event.currentTarget! as HTMLElement).classList.contains("bg-ambblue-500")
  ) {
    (event.currentTarget! as HTMLElement)!.classList.remove("bg-gray-100");
    (event.currentTarget! as HTMLElement)!.classList.add("bg-ambblue-500");
    (event.currentTarget! as HTMLElement)!.classList.add("text-white");
  }
}
function dragleave(event: DragEvent) {
  // Clean up
  (event.currentTarget! as HTMLElement)!.classList.add("bg-gray-100");
  (event.currentTarget! as HTMLElement)!.classList.add("text-gray-800");
  (event.currentTarget! as HTMLElement)!.classList.remove("bg-ambblue-500");
  (event.currentTarget! as HTMLElement)!.classList.remove("text-white");
}
function drop(event: DragEvent) {
  event.preventDefault();
  file.value.files = event.dataTransfer!.files;
  onChange(); // Trigger the onChange event manually
  // Clean up
  (event.currentTarget! as HTMLElement)!.classList.add("bg-gray-100");
  (event.currentTarget! as HTMLElement)!.classList.add("text-gray-800");
  (event.currentTarget! as HTMLElement)!.classList.remove("bg-ambblue-500");
  (event.currentTarget! as HTMLElement)!.classList.remove("text-white");
}
</script>
<style>
[v-cloak] {
  display: none;
}
</style>

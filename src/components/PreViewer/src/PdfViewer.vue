<template>
  <div>
    <h2>PDF Preview</h2>
    <canvas ref="pdfCanvas"></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as pdfjsLib from 'pdfjs - dist/build/pdf.js';
import axios from 'axios';
export default defineComponent({
  name: 'PdfPreview',
  setup() {
    const pdfCanvas = ref<HTMLCanvasElement | null>(null);
    const pdfUrl = 'http://localhost:8000/pdf/your_pdf_file_name.pdf';  // 替换为实际的PDF文件名
    onMounted(() => {
      axios.get(pdfUrl, { responseType: 'arraybuffer' }).then((response) => {
        const arrayBuffer = response.data;
        pdfjsLib.getDocument(arrayBuffer).promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const canvas = pdfCanvas.value;
            if (canvas) {
              const context = canvas.getContext('2d');
              const viewport = page.getViewport({ scale: 1.0 });
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              page.render(renderContext);
            }
          });
        });
      });
    });
    return {
      pdfCanvas
    };
  }
});
</script>
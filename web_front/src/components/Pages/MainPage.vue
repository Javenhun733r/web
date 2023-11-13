<template>
  <div class="video-converter">
    <h1>Відео Конвертер</h1>
    <div class="file-upload">
      <input type="file" @change="onFileChange" accept="video/*" />
    </div>
    <div class="resolution-select">
      <label for="resolution">Оберіть розширення:</label>
      <select v-model="selectedResolution" id="resolution">
        <option value="1920x1080">1920x1080</option>
        <option value="1366x768">1366×768</option>
        <option value="1440x900">1440×900</option>
        <option value="1280x720">1280×720</option>
        <option value="1280x1024">1280×1024</option>
      </select>
    </div>
    <button @click="convertVideo">Конвертувати</button>
    <button @click="clearHistory">Очистити історію</button>

    <ul>
      <li v-for="task in displayedTasks" :key="task.id" class="task-item">
        {{ task.title }} {{ task.resolution }}
        <button v-if="!task.result && task.status !== 'Error' && task.status !== 'Stop'" @click="cancelTask(task.id)">
          Відмінити
        </button>
        <a v-if="task.result" :href="getDownloadUrl(task.id)" download>
          <button>Завантажити відео</button>
        </a>
        <b v-if="task.status === 'Error' || task.status === 'Stop'">Скасовано</b>
        <div v-if="task.progress !== 100 && task.status === 'In Progress'" class="progress-info">
          <progress v-if="task.progress !== 100 && task.status === 'In Progress'" :value="task.progress" max="100"></progress>
          Прогрес конвертації: {{ task.progress }}%
        </div>
      </li>
    </ul>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Попередня сторінка</button>
      <span>Сторінка {{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Наступна сторінка</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedResolution: "1920x1080",
      videoFile: null,
      userTasks: [],
      progressInterval: 0,
      taskInProgress: false,
      itemsPerPage: 5,
      currentPage: 1,
    };
  },
  computed: {
    displayedTasks() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.userTasks.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.userTasks.length / this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    async fetchUserVideos() {
      try {
        const response = await axios.get("http://localhost:8080/user-videos", {
          headers: {Authorization: localStorage.getItem("jwt")},
        });

        this.userTasks = response.data;
        this.sortFilesById();
      } catch (error) {
        console.error("Помилка під час отримання списку відео користувача: ", error);
      }
    },
    cancelTask(taskId) {
      axios
          .post(`http://localhost:8080/cancel_task/${taskId}`)
          .then((response) => {
            console.log(response.data.message);
            this.fetchUserVideos();
          })
          .catch((error) => {
            console.error("Помилка під час відміни завдання: ", error);
          });
    },
    onFileChange(event) {
      this.videoFile = event.target.files[0];
      this.getVideoSize(this.videoFile);
    },


    getVideoSize(file) {
      if (file) {
        const sizeInBytes = file.size;
        const sizeInMegabytes = sizeInBytes / (1024 * 1024);
        console.log(`Розмір відео: ${sizeInMegabytes} MB`);

        if (sizeInMegabytes > 80) {
          alert("Відео завелике. Максимальний розмір - 80 МБ.");
          this.videoFile = null;
          location.reload();
        }
      }
    },
    clearHistory() {
      axios
          .post("http://localhost:8080/clear-history", {
            jwt: localStorage.getItem("jwt"),
          })
          .then(() => {
            console.log("Історія успішно очищена");
            this.fetchUserVideos();
          })
          .catch((error) => {
            console.error("Помилка під час очищення історії: ", error);
          });
    },
    getDownloadUrl(id) {
      return `http://localhost:8080/download_video?id=${id}`;
    },
    sortFilesById() {
      this.userTasks.sort((a, b) => b.id - a.id);
    },

    convertVideo() {

      const formData = new FormData();
      formData.append("jwt", localStorage.getItem("jwt"));
      formData.append("video", this.videoFile);
      formData.append("resolution", this.selectedResolution);
      axios
          .post("http://localhost:8080/create-task", formData, {})
          .then((response) => {
            if (response.status === 226) {
              alert('Забагато тасків, почекайте трошки')
            } else {
              console.log(
                  "Відео успішно відправлене та оброблене на сервері. Статус: " +
                  response.status
              );

            }
          })
          .catch((error) => {
            console.error(
                "Помилка під час відправлення відео на сервер: ",
                error
            );
          });
    },
  },
  created() {
    this.fetchUserVideos();

    this.progressInterval = setInterval(() => {
      this.fetchUserVideos();
    }, 1000);
  },
  unmounted() {

    clearInterval(this.progressInterval);
  },
};
</script>
<style scoped>
.video-converter {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.file-upload {
  margin-bottom: 20px;
}

.resolution-select {
  margin-bottom: 20px;
}

button {
  background-color: #12141a;
  color: #fff;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #485865;
}

ul {
  list-style-type: none;
  padding: 0;
}

.task-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
}

.progress-info {
  font-weight: bold;
}

progress {
  width: 100%;
  margin-top: 10px;
}

.pagination {
  margin-top: 20px;
}
</style>
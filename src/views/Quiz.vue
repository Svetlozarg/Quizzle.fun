  <template>
  <main>
    <!-- Loading Animation -->
    <div v-if="loading" style="padding-top: 5rem">
      <div class="loading-box">
        <div class="sk-folding-cube">
          <div class="sk-cube1 sk-cube"></div>
          <div class="sk-cube2 sk-cube"></div>
          <div class="sk-cube4 sk-cube"></div>
          <div class="sk-cube3 sk-cube"></div>
        </div>
      </div>
    </div>

    <div v-if="!loading">
      <div class="container" :class="hasEnded ? 'hidden' : ''">
        <!-- Game Screen -->
        <div
          v-if="
            typeof easyQuiz !== 'undefined' &&
            typeof easyQuiz.results !== 'undefined'
          "
        >
          <div v-for="(quiz, parent_index) in easyQuiz.results" :key="quiz.id">
            <div
              class="justify-content flex-column"
              v-if="parent_index == questionIndex && !hasEnded"
            >
              <div class="hud">
                <div class="hud-item">
                  <p class="hud-prefix progressText">
                    Question {{ parent_index + 1 }}/{{
                      easyQuiz.results.length
                    }}
                  </p>
                  <div class="progress-bar">
                    <div
                      id="progressbar"
                      class="progress-bar-full"
                      :style="{ width: progress + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="hud-item">
                  <p class="hud-prefix">Lives</p>
                  <div class="hud-content">
                    <h1 class="hud-main-text" v-bind="lives">{{ lives }}</h1>
                    <p class="hud-add-score" :class="!takeLive ? 'hidden' : ''">
                      - 1
                    </p>
                  </div>
                </div>
                <div class="hud-item">
                  <p class="hud-prefix">Score</p>
                  <div class="hud-content">
                    <h1 class="hud-main-text" v-bind="score">{{ score }}</h1>
                    <p class="hud-add-score" :class="!addScore ? 'hidden' : ''">
                      + 1
                    </p>
                  </div>
                </div>
              </div>
              <h2 class="question">
                {{ question }}
              </h2>
              <div
                class="choice-container"
                v-for="(answer, index) in answers"
                :key="answer.id"
                :class="state ? check(answer, parent_index) : ''"
                :style="state ? 'pointer-events: none;' : ''"
                @click="selectState(), nextQuestion(answer, parent_index)"
              >
                <p class="choice-prefix" v-if="index == 0">A</p>
                <p class="choice-prefix" v-if="index == 1">B</p>
                <p class="choice-prefix" v-if="index == 2">C</p>
                <p class="choice-prefix" v-if="index == 3">D</p>
                <p class="choice-text">
                  {{ answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- End Screen -->
      <div class="end-container" v-if="hasEnded">
        <div class="content">
          <img class="image" src="../assets/logo.png" alt="" />
          <h2 class="end-title">Name Of The Player</h2>
          <h3 class="end-score">Your score is: {{ score }}</h3>
          <div class="btn-box">
            <button class="button offset" @click="reload()">Play Again</button>
            <router-link to="/rank">
              <button class="button offset2">Rank</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import firebase from "firebase";
import store from "../store";
import router from "../router";
import fetchEasyQuiz from "../lib/EASY_API";

export default {
  setup() {
    const easyQuiz = ref({});
    let answers = ref({});
    let questionIndex = ref(0);
    let score = ref(0);
    let lives = ref(3);
    let progress = ref(2);
    let state = ref();
    let addScore = ref();
    let takeLive = ref();
    let question = ref("");
    let hasEnded = ref();
    let loading = ref(true);
    let bestScore = 0;
    let quizToken = "";

    onMounted(() => {
      quizToken = localStorage.getItem("quizToken");
      // console.log(quizToken);
      let debouceTimeout;
      clearTimeout(debouceTimeout);

      debouceTimeout = setTimeout(() => {
        loading.value = false;
      }, 1500);

      if (!store.state.isSigned) {
        router.push("/");
      }
      getEasyQuiz();
      firebase
        .database()
        .ref("/users/" + store.state.user.user.displayName)
        .once("value")
        .then((snapshot) => {
          let scoresObj = snapshot.val();
          let scoresArray = Object.entries(scoresObj);
          let array = [];
          scoresArray.forEach((element) => array.push(element[1].score));
          array.sort((a, b) => b - a);
          let scores = array.slice(0, 1);
          bestScore = scores[0];
        });
    });

    function reload() {
      window.location.reload();
    }

    async function getEasyQuiz() {
      easyQuiz.value = await fetchEasyQuiz(quizToken);
      question.value = easyQuiz.value.results[0].question
        .replace(/&#34;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&SHY;/g, "-")
        .replace(/&HELLIP;/g, "...")
        .replace(/&RSQUO;/g, "'")
        .replace(/&LDQUO;/g, "'")
        .replace(/&RDQUO;/g, "`");
      const randomIndex = Math.floor(Math.random() * 4) + 1;
      let answersObj = [];

      for (let item of easyQuiz.value.results[0].incorrect_answers) {
        answersObj.push(
          item
            .replace(/&#34;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&SHY;/g, "-")
            .replace(/&HELLIP;/g, "...")
            .replace(/&RSQUO;/g, "'")
            .replace(/&LDQUO;/g, "'")
            .replace(/&RDQUO;/g, "`")
        );
      }

      answersObj.splice(
        randomIndex - 1,
        0,
        easyQuiz.value.results[0].correct_answer
      );
      answers.value = answersObj;
    }

    function selectState() {
      state.value = true;
    }

    function check(answer, parent_index) {
      if (answer === easyQuiz.value.results[parent_index].correct_answer) {
        return "correct";
      } else {
        return "incorrect";
      }
    }

    function nextQuestion(answer, parent_index) {
      hasEnded.value = false;
      addScore.value = false;
      takeLive.value = false;

      if (answer === easyQuiz.value.results[parent_index].correct_answer) {
        addScore.value = true;
      }

      let debouceTimeout;

      clearTimeout(debouceTimeout);

      debouceTimeout = setTimeout(() => {
        if (parent_index > 48) {
          hasEnded.value = true;
          return;
        }

        question.value = easyQuiz.value.results[parent_index + 1].question
          .replace(/&#34;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&SHY;/g, "-")
          .replace(/&HELLIP;/g, "...")
          .replace(/&RSQUO;/g, "'")
          .replace(/&LDQUO;/g, "'")
          .replace(/&RDQUO;/g, "`");
        if (answer === easyQuiz.value.results[parent_index].correct_answer) {
          score.value++;
          addScore.value = false;
        } else {
          lives.value--;
          takeLive.value = false;
        }
        state.value = false;
        questionIndex.value++;
        progress.value += 2;
        const randomIndex = Math.floor(Math.random() * 4) + 1;
        let answersObj = [];
        for (let item of easyQuiz.value.results[parent_index + 1]
          .incorrect_answers) {
          answersObj.push(
            item
              .replace(/&#34;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&quot;/g, '"')
              .replace(/&SHY;/g, "-")
              .replace(/&HELLIP;/g, "...")
              .replace(/&RSQUO;/g, "'")
              .replace(/&LDQUO;/g, "'")
              .replace(/&RDQUO;/g, "`")
          );
        }
        answersObj.splice(
          randomIndex - 1,
          0,
          easyQuiz.value.results[parent_index + 1].correct_answer
        );
        answers.value = answersObj;
        if (lives.value == 0) {
          hasEnded.value = true;
          let date = new Date();
          firebase
            .database()
            .ref("users/" + store.state.user.user.displayName + "/" + date)
            .set({
              score: score.value,
            })
            .catch((error) => {
              console.log(error.message);
            });

          // Put score in leaderboard
          if (score.value > bestScore) {
            firebase
              .database()
              .ref("leaderboard/" + store.state.user.user.displayName)
              .set({
                name: store.state.user.user.displayName,
                score: score.value,
              })
              .catch((error) => {
                console.log(error.message);
              });
          }
          return;
        }
      }, 1300);
    }

    return {
      easyQuiz,
      answers,
      check,
      questionIndex,
      nextQuestion,
      score,
      lives,
      progress,
      state,
      selectState,
      addScore,
      takeLive,
      question,
      hasEnded,
      loading,
      reload,
    };
  },
};
</script>

<style scoped>
@import "../assets/styles.css";
</style>
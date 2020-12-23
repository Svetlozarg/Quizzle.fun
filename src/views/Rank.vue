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

    <div class="rank-wrapper">
      <h2 class="rank-title">Leaderboard 2020</h2>
      <div class="rank-header">
        <div class="rank-box">RANK</div>
        <div class="rank-box">NAME</div>
        <div class="rank-box">SCORE</div>
      </div>

      <div
        class="leaderbord"
        v-for="(rank, index) in leaderboard"
        :key="rank.id"
      >
        <!-- First Place -->
        <div class="rank-item" style="background: #ffd700" v-if="index == 0">
          <div class="item margin">
            <img
              src="https://d125fmws0bore1.cloudfront.net/assets/pages/leaderboard/medal-gold-c49052bfa07f36621f16dbe77f7fc36cbafd72ff088ea970256ff998be05687b.svg"
              alt=""
              class="medal"
            />
          </div>
          <div class="item">{{ rank.name }}</div>
          <div class="item">{{ rank.score }}</div>
        </div>
        <!-- Second Place -->
        <div class="rank-item" style="background: #c0c0c0" v-if="index == 1">
          <div class="item margin">
            <img
              src="https://d125fmws0bore1.cloudfront.net/assets/pages/leaderboard/medal-silver-d099c5dd916c167c3ba4716c8968a819f317daaef1901c8e8bae6c6932852faa.svg"
              alt=""
              class="medal"
            />
          </div>
          <div class="item">{{ rank.name }}</div>
          <div class="item">{{ rank.score }}</div>
        </div>
        <!-- Third Place -->
        <div class="rank-item" style="background: #cd7f32" v-if="index == 2">
          <div class="item margin">
            <img
              src="https://d125fmws0bore1.cloudfront.net/assets/pages/leaderboard/medal-bronze-d0f15d413800257442c8d4b2d5239cfe28c9fd9594f863ab1fad5258f8d1d5eb.svg"
              alt=""
              class="medal"
            />
          </div>
          <div class="item">{{ rank.name }}</div>
          <div class="item">{{ rank.score }}</div>
        </div>
        <!-- Rank Place -->
        <div class="rank-item" v-if="index > 2">
          <div class="item rank-number">{{ index + 1 }}</div>
          <div class="item">{{ rank.name }}</div>
          <div class="item">{{ rank.score }}</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import firebase from "firebase";

export default {
  setup() {
    let leaderboard = ref();
    let loading = ref(true);

    onMounted(() => {
      let debouceTimeout;
      clearTimeout(debouceTimeout);

      debouceTimeout = setTimeout(() => {
        loading.value = false;
      }, 1500);

      firebase
        .database()
        .ref("/leaderboard/")
        .once("value")
        .then((snapshot) => {
          let scoresObj = snapshot.val();
          let scoresArray = Object.entries(scoresObj);
          let array = [];
          scoresArray.forEach((element) => array.push(element[1]));
          array.sort((a, b) => (a.score < b.score ? 1 : -1));
          leaderboard.value = array;
        });
    });

    return {
      leaderboard,
      loading,
    };
  },
};
</script>

<style scoped>
html {
  font-family: sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
.margin {
  margin-right: 10px;
}
.rank-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 80rem;
  margin: 0 auto;
}
.rank-header {
  display: flex;
  flex-direction: row;
  width: 60vw;
  justify-content: space-around;
}
.rank-box {
  padding: 5rem 10rem 2rem 10rem;
  font-size: 1.2rem;
  color: #7d97ad;
}
.rank-title {
  font-size: 3rem;
  padding: 5rem 0 1rem 0;
  font-weight: 600;
  letter-spacing: 10px;
}
.leaderbord {
  border: 1px solid #d3d7d9;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.3);
}
.rank-item {
  display: flex;
  flex-direction: row;
  border: 1px solid #dddfe0;
  padding: 2rem 0;
  width: 60vw;
  justify-content: space-around;
}
.item {
  font-size: 1.5rem;
  padding: 0 10rem;
  position: relative;
}
.rank-number {
  font-size: 2rem;
  font-weight: 400;
}
.medal {
  position: absolute;
  top: -120%;
  left: 45%;
  width: 50px;
}
@media only screen and (max-width: 1000px) {
  .margin {
    margin-right: 12px;
  }
  .rank-title {
    letter-spacing: 8px;
    margin: 0 auto;
    text-align: center;
  }
  .rank-box {
    padding: 5rem 4rem 2rem 4rem !important;
    font-size: 1.2rem;
    color: #7d97ad;
  }
  .rank-item {
    width: 95vw !important;
    width: -moz-fit-content;
    width: fit-content;
  }
  .item {
    padding: 0 3.5rem;
  }
  .medal {
    position: absolute;
    top: -120%;
    left: 45%;
    width: 50px;
  }
}
/* Loading */
.loading-box {
  width: 100vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sk-folding-cube {
  margin: 20px auto;
  width: 150px;
  height: 150px;
  position: relative;
  -webkit-transform: rotateZ(45deg);
  transform: rotateZ(45deg);
}

.sk-folding-cube .sk-cube {
  float: left;
  width: 50%;
  height: 50%;
  position: relative;
  -webkit-transform: scale(1.1);
  -ms-transform: scale(1.1);
  transform: scale(1.1);
}
.sk-folding-cube .sk-cube:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #333;
  -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
  animation: sk-foldCubeAngle 2.4s infinite linear both;
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
}
.sk-folding-cube .sk-cube2 {
  -webkit-transform: scale(1.1) rotateZ(90deg);
  transform: scale(1.1) rotateZ(90deg);
}
.sk-folding-cube .sk-cube3 {
  -webkit-transform: scale(1.1) rotateZ(180deg);
  transform: scale(1.1) rotateZ(180deg);
}
.sk-folding-cube .sk-cube4 {
  -webkit-transform: scale(1.1) rotateZ(270deg);
  transform: scale(1.1) rotateZ(270deg);
}
.sk-folding-cube .sk-cube2:before {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.sk-folding-cube .sk-cube3:before {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.sk-folding-cube .sk-cube4:before {
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
}
@-webkit-keyframes sk-foldCubeAngle {
  0%,
  10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}

@keyframes sk-foldCubeAngle {
  0%,
  10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}
</style>
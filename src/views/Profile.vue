<template>
  <main v-if="isSigned">
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
      <div class="profile-wrapper">
        <h2 class="profile-title">Your profile</h2>
        <img class="profile-image" :src="user.photoURL" alt="" />
        <h3 class="profile-name">{{ user.displayName }}</h3>
        <h4 class="profile-email">{{ user.email }}</h4>
      </div>

      <div class="score-wrapper">
        <div class="leaderboard">
          <div class="h1">
            <img class="trophy" src="../assets/trophy.png" alt="" />
            <h1 class="h1-title">Top 5 Best Scores</h1>
          </div>
          <ol>
            <li v-for="(score, index) in scores" :key="score.id">
              <mark v-if="index == 0">Current Best Score</mark>
              <mark v-if="index == 1">2nd Best Score</mark>
              <mark v-if="index == 2">3rd Best Score</mark>
              <mark v-if="index == 3">4th Best Score</mark>
              <mark v-if="index == 4">5th Best Score</mark>
              <small>{{ score }}</small>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import store from "../store";
import router from "../router";
import firebase from "firebase";

export default {
  setup() {
    let user = ref();
    let isSigned = ref(false);
    let loading = ref(true);
    let scores = ref([]);

    onMounted(() => {
      let debouceTimeout;
      clearTimeout(debouceTimeout);

      debouceTimeout = setTimeout(() => {
        loading.value = false;
      }, 1500);

      if (store.state.isSigned) {
        user.value = store.state.user.user;
        isSigned.value = store.state.isSigned;
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
            scores.value = array.slice(0, 5);
          });
      } else {
        router.push("/");
      }
    });

    return {
      user,
      isSigned,
      loading,
      scores,
    };
  },
};
</script>

<style scoped>
.profile-wrapper {
  margin: 0 auto;
  text-align: center;
  padding: 6rem 0;
}
.profile-title {
  font-size: 3.5rem;
  padding-bottom: 1rem;
}
.profile-image {
  border-radius: 50%;
  margin: 2rem 0 4rem 0;
}
.profile-name {
  font-size: 1.8rem;
}
.profile-email {
  font-size: 1.2rem;
  padding: 1rem 0;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
ol {
  list-style-type: none;
}
.leaderboard {
  margin: 0 auto;
  text-align: center;
  width: 350px;
  height: 308px;
  background: linear-gradient(to bottom, #3a404d, #181c26);
  border-radius: 10px;
  box-shadow: 0 7px 30px rgba(62, 9, 11, 0.3);
}
.leaderboard .h1 {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #e1e1e1;
  padding: 1.5rem 1rem;
}
.leaderboard .h1 svg {
  width: 25px;
  height: 26px;
  position: relative;
  top: 3px;
  margin-right: 6px;
  vertical-align: baseline;
}
.leaderboard ol {
  counter-reset: leaderboard;
}
.leaderboard ol li {
  position: relative;
  z-index: 1;
  font-size: 14px;
  counter-increment: leaderboard;
  padding: 18px 10px 18px 50px;
  cursor: pointer;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1, 1);
}
.leaderboard ol li::before {
  content: counter(leaderboard);
  position: absolute;
  z-index: 2;
  top: 15px;
  left: 15px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  color: #c24448;
  background: #fff;
  border-radius: 20px;
  text-align: center;
}
.leaderboard ol li mark {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 18px 10px 18px 50px;
  margin: 0;
  background: none;
  color: #fff;
}
.leaderboard ol li mark::before,
.leaderboard ol li mark::after {
  content: "";
  position: absolute;
  z-index: 1;
  bottom: -11px;
  left: -9px;
  border-top: 10px solid #c24448;
  border-left: 10px solid transparent;
  transition: all 0.1s ease-in-out;
  opacity: 0;
}
.leaderboard ol li mark::after {
  left: auto;
  right: -9px;
  border-left: none;
  border-right: 10px solid transparent;
}
.leaderboard ol li small {
  position: relative;
  z-index: 2;
  display: block;
  text-align: right;
  font-size: 1.5rem;
}
.leaderboard ol li::after {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fa6855;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
  opacity: 0;
}
.leaderboard ol li:nth-child(1) {
  background: #fa6855;
}
.leaderboard ol li:nth-child(1)::after {
  background: #fa6855;
}
.leaderboard ol li:nth-child(2) {
  background: #e0574f;
}
.leaderboard ol li:nth-child(2)::after {
  background: #e0574f;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.08);
}
.leaderboard ol li:nth-child(2) mark::before,
.leaderboard ol li:nth-child(2) mark::after {
  border-top: 6px solid #ba4741;
  bottom: -7px;
}
.leaderboard ol li:nth-child(3) {
  background: #d7514d;
}
.leaderboard ol li:nth-child(3)::after {
  background: #d7514d;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.11);
}
.leaderboard ol li:nth-child(3) mark::before,
.leaderboard ol li:nth-child(3) mark::after {
  border-top: 2px solid #b0433f;
  bottom: -3px;
}
.leaderboard ol li:nth-child(4) {
  background: #cd4b4b;
}
.leaderboard ol li:nth-child(4)::after {
  background: #cd4b4b;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.15);
}
.leaderboard ol li:nth-child(4) mark::before,
.leaderboard ol li:nth-child(4) mark::after {
  top: -7px;
  bottom: auto;
  border-top: none;
  border-bottom: 6px solid #a63d3d;
}
.leaderboard ol li:nth-child(5) {
  background: #c24448;
  border-radius: 0 0 10px 10px;
}
.leaderboard ol li:nth-child(5)::after {
  background: #c24448;
  box-shadow: 0 -2.5px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0 0 10px 10px;
}
.leaderboard ol li:nth-child(5) mark::before,
.leaderboard ol li:nth-child(5) mark::after {
  top: -9px;
  bottom: auto;
  border-top: none;
  border-bottom: 8px solid #993639;
}
.leaderboard ol li:hover {
  z-index: 2;
  overflow: visible;
}
.leaderboard ol li:hover::after {
  opacity: 1;
  transform: scaleX(1.06) scaleY(1.03);
}
.leaderboard ol li:hover mark::before,
.leaderboard ol li:hover mark::after {
  opacity: 1;
  transition: all 0.35s ease-in-out;
}
.the-most {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 50vw;
  max-width: 200px;
  padding: 10px;
}
.the-most img {
  max-width: 100%;
}
.trophy {
  width: 30px;
}
.h1-title {
  padding-left: 2rem;
  color: white;
  font-size: 1.8rem;
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
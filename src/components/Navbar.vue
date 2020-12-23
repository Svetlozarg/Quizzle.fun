<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a class="navbar-brand" href="#"
      ><img class="icon" src="../assets/icon.png" alt=""
    /></a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarColor01"
      aria-controls="navbarColor01"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor01">
      <ul class="navbar-nav mr-auto ml-auto" @click="checkActive()">
        <li
          class="nav-item"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          :class="home ? 'active' : ''"
        >
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li
          class="nav-item"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          :class="quiz ? 'active' : ''"
          v-if="isSigned"
        >
          <router-link class="nav-link" to="/quiz">Quiz</router-link>
        </li>
        <li
          class="nav-item"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          :class="rank ? 'active' : ''"
        >
          <router-link class="nav-link" to="/rank">Rank List</router-link>
        </li>
        <li
          class="nav-item"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          :class="about ? 'active' : ''"
        >
          <router-link class="nav-link" to="/about">About</router-link>
        </li>
      </ul>
    </div>

    <form
      class="profile-box form-inline my-2 my-lg-0"
      v-if="isSigned"
      @click="checkActive()"
    >
      <h3 class="profile-title">{{ user.displayName }}</h3>
      <router-link to="/profile"
        ><img class="profile" src="../assets/profile.png"
      /></router-link>
      <img class="logout" src="../assets/logout.png" @click="signOut" />
    </form>
  </nav>
</template>

<script>
import { ref, onMounted } from "vue";
import firebase from "firebase";
import store from "../store";

export default {
  setup() {
    let home = ref();
    let quiz = ref();
    let rank = ref();
    let about = ref();
    let profile = ref();

    let token = ref();
    let user = ref();
    let isSigned = ref(false);

    onMounted(() => {
      checkActive();

      if (store.state.isSigned) {
        user.value = store.state.user.user;
        isSigned.value = store.state.isSigned;
      }
    });

    function checkActive() {
      home.value = false;
      quiz.value = false;
      rank.value = false;
      about.value = false;

      if (window.location.pathname == "/") {
        home.value = true;
      } else if (window.location.pathname == "/quiz") {
        quiz.value = true;
      } else if (window.location.pathname == "/rank") {
        rank.value = true;
      } else if (window.location.pathname == "/about") {
        about.value = true;
      } else if (window.location.pathname == "/profile") {
        profile.value = true;
      }
    }

    function signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          token.value = {};
          user.value = {};
          isSigned.value = false;
          store.commit("clearUser");
          sessionStorage.clear();
          window.localStorage.clear();
          location.reload();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    return {
      home,
      quiz,
      rank,
      about,
      checkActive,
      token,
      user,
      isSigned,
      signOut,
      profile,
    };
  },
};
</script>

<style scoped>
nav {
  padding: 0.5rem 6rem;
}
.navbar-brand {
  font-size: 3rem;
}
.navbar-collapse {
  text-align: center;
}
.icon {
  width: 180px;
}
.nav-item {
  padding: 0 2rem;
}
.nav-link {
  font-size: 1.5rem;
}
.profile-title {
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem 0rem 0 0;
}
.profile {
  width: 30px;
  margin: 0 2rem 0 2rem;
  cursor: pointer;
}
.logout {
  width: 30px;
  cursor: pointer;
}
@media only screen and (max-width: 600px) {
  .profile-box {
    text-align: center;
    margin: 0 auto;
  }
  .icon {
    width: 150px;
  }
}
</style>
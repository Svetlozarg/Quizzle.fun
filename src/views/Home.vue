<template>
  <main>
    <div class="wrapper">
      <img class="image" src="../assets/logo.png" alt="" />
      <div class="content">
        <h2 class="heading">Play, learn, be the smartest!</h2>
        <p class="desc">
          <span>Trivia Quiz</span> is a quiz game with multiple questions on
          different topics that improves your overall knowledge. <br />
          <span>Concer the top</span> places and be the smartest and the best of
          all! <br />
          <span>Created by</span> Svetlozar Georgiev
        </p>

        <p class="btn-title" v-if="!isSigned">Sign in to play</p>
        <img
          class="login-button"
          src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
          alt=""
          @click="logInWithGoogle"
          v-if="!isSigned"
        />

        <div class="btn-box" v-if="isSigned">
          <router-link to="/quiz">
            <button class="offset">Quiz</button>
          </router-link>
          <router-link to="/rank">
            <button class="offset2">Rank</button>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import firebase from "firebase";
import store from "../store";
import fetchToken from "../lib/TOKEN_API";

export default {
  setup() {
    let token = ref();
    let user = ref();
    let isSigned = ref(false);
    let quizToken = ref("");

    onMounted(() => {
      if (store.state.isSigned) {
        user.value = store.state.user.user;
        isSigned.value = store.state.isSigned;
      }
    });

    function logInWithGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();
      isSigned.value = false;

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          token.value = result.credential.accessToken;
          user.value = result.user;
          isSigned.value = true;
          let quizTokenObj = await fetchToken();
          quizToken.value = quizTokenObj.token;
          localStorage.setItem("quizToken", quizToken.value);
          console.log(quizToken.value);
          location.reload();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    return {
      token,
      user,
      logInWithGoogle,
      isSigned,
      quizToken,
    };
  },
};
</script>

<style scoped>
.wrapper {
  margin: 0 auto;
  text-align: center;
  padding: 5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  flex-direction: column;
  overflow: hidden;
}
.heading {
  font-size: 2rem;
  padding: 2rem 0 2rem 0;
}
.content {
  max-width: 80vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  flex-direction: column;
}
.desc {
  font-size: 1.6rem;
}
.image {
  width: 600px;
}
span {
  font-weight: bold;
  font-size: 1.8rem;
}
.login-button {
  width: 200px;
  margin: 1rem 0;
  cursor: pointer;
}
.btn-title {
  font-size: 1.6rem;
  font-weight: 400;
  padding-top: 1rem;
}
.btn-box {
  display: flex;
  padding: 2rem 0;
}
button {
  color: var(--color);
  transition: 0.25s;
}
button:hover,
button:focus {
  border-color: var(--hover);
  color: white;
  border-radius: 5px;
}
button {
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
  margin: 2rem 5rem;
  padding: 1.4rem 3rem;
  font-size: 1.8rem;
}
.offset {
  --color: #28a746a1;
  --hover: #1ec545cc;
}
.offset {
  box-shadow: 0.3em 0.3em 0 0 var(--color), inset 0.3em 0.3em 0 0 var(--color);
}
.offset:hover,
.offset:focus {
  box-shadow: 0 0 0 0 var(--hover), inset 6em 3.5em 0 0 var(--hover);
}
.offset2 {
  --color: #dc354694;
  --hover: #ee1f34d5;
}
.offset2 {
  box-shadow: 0.3em 0.3em 0 0 var(--color), inset 0.3em 0.3em 0 0 var(--color);
}
.offset2:hover,
.offset2:focus {
  box-shadow: 0 0 0 0 var(--hover), inset 6em 3.5em 0 0 var(--hover);
}
@media only screen and (max-width: 600px) {
  .image {
    width: 350px;
  }
  button:hover,
  button:focus {
    border-color: var(--hover);
    color: #28a746a1;
    border-radius: 0px;
  }
  .offset {
    --color: #28a746a1;
    --hover: none;
  }
  .offset {
    box-shadow: 0.3em 0.3em 0 0 var(--color), inset 0.3em 0.3em 0 0 var(--color);
  }
  .offset:hover,
  .offset:focus {
    box-shadow: 0.3em 0.3em 0 0 var(--color), inset 0.3em 0.3em 0 0 var(--color);
  }
  .offset2 {
    --color: #dc354694;
    --hover: none;
  }
  .offset2 {
    box-shadow: 0.3em 0.3em 0 0 var(--color), inset 0.3em 0.3em 0 0 var(--color);
  }
  .offset2:hover,
  .offset2:focus {
    box-shadow: 0.3em 0.3em 0 0 var(--color), inset 0.3em 0.3em 0 0 var(--color);
  }
}
</style>
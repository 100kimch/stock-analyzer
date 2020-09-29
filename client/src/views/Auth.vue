<template>
  <v-container>
    <h1>Auth Data Received</h1>
    <p>Close this tab and proceed.</p>
  </v-container>
</template>

<script>
import axios from "axios";
import Querystring from "querystring";

export default {
  name: "Auth",
  async mounted() {
    try {
      /* eslint-disable camelcase */
      /* eslint-disable @typescript-eslint/camelcase */
      const param = Querystring.stringify({
        grant_type: "authorization_code",
        client_id: process.env.VUE_APP_CLIENT_ID,
        redirect_uri: "http://localhost/" + "auth",
        code: this.$route.query.code,
      });
      console.log("param: ", param);
      const resToken = await axios.post(
        `https://kauth.kakao.com/oauth/token`,
        param
      );
      console.debug("res: ", resToken);
      const resInfo = await axios.post(
        `${process.env.VUE_APP_SERVER_URL}members`,
        {
          token: resToken.data.access_token,
        }
      );

      localStorage.setItem("timetable-user-code", resInfo.data.access_token);
      window.close();
    } catch (e) {
      console.error("error: ", e);
    }

    //     .then((res) => {
    //       console.debug("res: ", res);
    //       localStorage.setItem("timetable-user-code", res.data.access_token);
    //       window.close();
    //     })
    //     .catch((err) => {
    //       console.error("error: ", err);
    //     });
    // })
    // .catch((err) => {
    //   console.log(err);
    //   console.error("error: ", err);
    // });
    // axios
    //   .post(`https://kauth.kakao.com/oauth/token`, param)
    //   .then((res) => {
    //     console.debug("res: ", res);
    //     axios
    //       .post(`${process.env.VUE_APP_SERVER_URL}members`, {
    //         token: res.data.access_token,
    //       })
    //       .then((res) => {
    //         console.debug("res: ", res);
    //         localStorage.setItem("timetable-user-code", res.data.access_token);
    //         window.close();
    //       })
    //       .catch((err) => {
    //         console.error("error: ", err);
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     console.error("error: ", err);
    //   });
  },
};
</script>

<style lang="scss" scoped></style>

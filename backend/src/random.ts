import { client } from ".";

client.auth.login.post({ username: "ff", password: "gg" }).then((v) => {
  console.log(v.data);
});

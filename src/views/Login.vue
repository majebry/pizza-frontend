<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Login</div>

          <div class="card-body">
            <b-alert variant="danger" :show="errorMessage">Make sure your credentials are valid</b-alert>
            <form @submit.prevent="submit">
            <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="form.username"
                  placeholder="Your Best Email"
                />
                <p
                  v-if="form.errors.has('username')"
                  class="text-danger"
                >{{ form.errors.first('username') }}</p>
              </div>

              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  v-model="form.password"
                  placeholder="Your Secret Password"
                />
                <p
                  v-if="form.errors.has('password')"
                  class="text-danger"
                >{{ form.errors.first('password') }}</p>
              </div>

              <div class="form-group">
                <input type="submit" class="btn btn-primary btn-lg" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "form-backend-validation";

export default {
  data() {
    return {
      form: new Form({
        username: "",
        password: ""
      }),
      errorMessage: false
    };
  },
  methods: {
    submit() {
      this.$store
        .dispatch("login", this.form)
        .then(() => {
          this.$router.push({ path: "orders" });
        })
        .catch(() => {
          this.errorMessage = true
        });
    }
  }
};
</script>


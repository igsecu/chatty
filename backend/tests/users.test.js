const request = require("supertest");
const app = require("../index");
const db = require("../src/database/db");

const User = require("../src/models/User");

beforeAll(async () => {
  try {
    await db.sync({});
    await User.sync({ force: true });
  } catch (error) {
    console.log(error.message);
  }
}, 30000);

afterAll((done) => {
  db.close();
  done();
});

describe("POST /api/users/account route -> parameter validations", () => {
  it("it should return 400 status code -> email parameter is missing", async () => {
    const user = {
      username: "username",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> email must be a string", async () => {
    const user = {
      email: 1234,
      password: "Password14!",
      username: "username",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> email does not have a @", async () => {
    const user = {
      email: "user1email.com",
      password: "Password14!",
      username: "username",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> email format is not valid", async () => {
    const user = {
      email: "user1@emailcom",
      password: "Password14!",
      username: "username",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> email second part has a symbol", async () => {
    const user = {
      email: "user1@email.#com",
      password: "Password14!",
      username: "username",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> email second part has a number", async () => {
    const user = {
      email: "user1@email.1com",
      password: "Password14!",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password must be a string", async () => {
    const user = {
      password: 1234,
      email: "user1@email.com",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password is missing", async () => {
    const user = {
      email: "user1@email.com",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password must be at least 8 characters long", async () => {
    const user = {
      password: "1234",
      email: "user1@email.com",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password must have one capital letter", async () => {
    const user = {
      password: "password",
      email: "user1@email.com",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password must have one number", async () => {
    const user = {
      password: "Password",
      email: "user1@email.com",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password must have one symbol", async () => {
    const user = {
      password: "Password14",
      email: "user1@email.com",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password must have one small letter", async () => {
    const user = {
      password: "PASSWORD14!",
      email: "user1@email.com",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return a 400 status code -> password confirmation parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
  it("it should return a 400 status code -> password and password confirmation not match", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
      password2: "Password14@",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
});

let account1_id, account2_id, account3_id, token;

describe("POST /api/account route -> create new user", () => {
  it("it should return 201 status code -> create new account successfully", async () => {
    const user = {
      email: "user1@gmail.com",
      password: "Password14!",
      password2: "Password14!",
    };

    const response = await request(app).post("/api/users/register").send(user);

    expect(response.status).toBe(201);
    account1_id = response.body.data.id;
  });
  it("it should return 201 status code -> create new account successfully", async () => {
    const user = {
      email: "user2@gmail.com",
      password: "Password14!",
      password2: "Password14!",
    };

    const response = await request(app).post("/api/users/register").send(user);

    expect(response.status).toBe(201);
    account2_id = response.body.data.id;
  });
  it("it should return 201 status code -> create new account successfully", async () => {
    const user = {
      email: "user3@gmail.com",
      password: "Password14!",
      password2: "Password14!",
    };

    const response = await request(app).post("/api/users/register").send(user);

    expect(response.status).toBe(201);
    account3_id = response.body.data.id;
  });
});

describe("POST /api/account route -> check if email exists", () => {
  it("it should return a 400 status code -> email exists", async () => {
    const user = {
      email: "USER1@gmail.com",
      password: "Password14!",
      password2: "Password14!",
    };

    const response = await request(app).post("/api/users/register").send(user);
    expect(response.status).toBe(400);
  });
});

let cookie;

describe("POST /api/users/login route -> login process", () => {
  it("it should return 400 status code -> email is missing", async () => {
    const response = await request(app).post("/api/users/login").send();
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> password is missing", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com" });
    expect(response.status).toBe(400);
    console.log(response.body);
  });
  it("it should return 400 status code -> email not exists", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user4@gmail.com", password: "Password14" });
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> incorrect password", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "Password14" });
    expect(response.status).toBe(400);
  });
  it("it should return 200 status code -> login successful", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "Password14!" });
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
    //console.log(response.headers["set-cookie"]);
  });
  it("it should return 400 status code -> user logged in", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "Password14!" })
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    //console.log(response.headers["set-cookie"]);
  });
});

describe("POST /api/users/logout route -> logout process", () => {
  it("it should return 200 status code -> logout success", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(401);
  });
});

describe("PUT /api/users/account route -> update account", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).put("/api/users/account");
    expect(response.status).toBe(401);
  });
  it("it should return 200 status code -> login successful", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "Password14!" });
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
    //console.log(response.headers["set-cookie"]);
  });
  it("it should return 400 status code -> query parameter is missing", async () => {
    const response = await request(app)
      .put("/api/users/account")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
  });
  it("it should return 200 status code -> username updated", async () => {
    const response = await request(app)
      .put("/api/users/account?username=New Username")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
  });
  it("it should return 200 status code -> state updated", async () => {
    const response = await request(app)
      .put("/api/users/account?username=Username&state=New State!")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    console.log(response.body);
  });
  it("it should return 200 status code -> logout success", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
  });
});

describe("PUT /api/users/image route -> update user image", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).put("/api/users/image");
    expect(response.status).toBe(401);
  });
  it("it should return 200 status code -> login successful", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "Password14!" });
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
    //console.log(response.headers["set-cookie"]);
  });
  it("it should return 400 status code -> image file is missing", async () => {
    const response = await request(app)
      .put(`/api/users/image`)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> file type not allowed", async () => {
    const response = await request(app)
      .put(`/api/users/image`)
      .set("Cookie", cookie)
      .attach("image", `${__dirname}/files/file.txt`);
    expect(response.status).toBe(400);
  });
  it("it should return 400 status code -> file size not support", async () => {
    const response = await request(app)
      .put(`/api/users/image`)
      .set("Cookie", cookie)
      .attach("image", `${__dirname}/files/heavyimage.jpg`);
    expect(response.status).toBe(400);
  });
  /*  it("it should return 200 status code -> account image updated successfully", async () => {
    const response = await request(app)
      .put(`/api/users/image`)
      .set("Cookie", cookie)
      .attach("image", `${__dirname}/files/avatar1.png`);
    expect(response.status).toBe(200);
  }); */
  /*   it("it should return 200 status code -> account image updated successfully", async () => {
    const response = await request(app)
      .put(`/api/users/image`)
      .set("Cookie", cookie)
      .attach("image", `${__dirname}/files/avatar2.png`);
    expect(response.status).toBe(200);
    console.log(response.body);
  });*/
  it("it should return 200 status code -> logout success", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
  });
});

describe("DELETE /api/users/image route -> delete user image", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).delete("/api/users/image");
    expect(response.status).toBe(401);
  });
  it("it should return 200 status code -> login successful", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "Password14!" });
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
    //console.log(response.headers["set-cookie"]);
  });
  it("it should return 400 status code -> no image", async () => {
    const response = await request(app)
      .delete("/api/users/image")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
  });
  /*   it("it should return 200 status code -> account image updated successfully", async () => {
    const response = await request(app)
      .put(`/api/users/image`)
      .set("Cookie", cookie)
      .attach("image", `${__dirname}/files/avatar2.png`);
    expect(response.status).toBe(200);
  });
  it("it should return 200 status code -> delete image success", async () => {
    const response = await request(app)
      .delete("/api/users/image")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    console.log(response.body);
  }); */
  it("it should return 200 status code -> logout success", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    cookie = response.headers["set-cookie"];
  });
});
/*
describe("DELETE /api/users/account route -> delete user account", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).delete("/api/users/account");
    expect(response.status).toBe(401);
  });
  it("it should return 200 status code -> login successfull", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user2@gmail.com", password: "Password14!" });
    expect(response.status).toBe(200);
    token = response.body.token;
  });
  /*  it("it should return 200 status code -> account image updated successfully", async () => {
    const response = await request(app)
      .put(`/api/users/image`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", `${__dirusername}/files/avatar2.png`);
    expect(response.status).toBe(200);
  }); 
  it("it should return 200 status code -> account deleted", async () => {
    const response = await request(app)
      .delete("/api/users/account")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
}); */

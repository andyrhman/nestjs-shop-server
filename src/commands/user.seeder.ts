import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { UserService } from "src/user/user.service";
import * as argon2 from 'argon2';
import { fakerID_ID as faker } from "@faker-js/faker";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const userService = app.get(UserService);

    const password = await argon2.hash("123123");

    // * Creating 30 users by using for loop.
    // ? You could also use map here's the link https://www.phind.com/search?cache=fp0nc4vds36gdwixhj9mhtmc
    for (let i = 0; i < 30; i++) {
        await userService.create({
            fullName: faker.person.fullName(),
            username: faker.internet.userName().toLowerCase(),
            email: faker.internet.email().toLowerCase(),
            password,
            is_verified: true
        });
    }

    process.exit()
}
bootstrap();

// ! YOU NEED TO RUN THIS SEEDER INSIDE DOCKER CONTAINER OR IT WON'T WORK!
// * docker exec -it <container id use (docker ps) to check> bash
// * modify package.json script setting
// * npm run seed:ambassadors 
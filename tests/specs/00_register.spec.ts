import { test, expect } from "@playwright/test";
import { registerPage } from "../../pages/RegisterPage";

test.describe("Register Page Tests", () => {
    let register: registerPage;
    const email = `demo1${Date.now()}@gmail.com`;
    test.beforeEach(async ({ page }) => {
        register = new registerPage(page);
        await register.openRegisterPage();
    });

    test("Register001 - Register with mandatory fields", async () => {


        await register.registerAccount({
            firstName: "demo",
            lastName: "nopcommerce",
            email,
            password: "123456",
            confirmPassword: "123456"
        });
    });

    // test("Register002 - should register successfully with valid data", async () => {
    //     const email = `demo2${Date.now()}@gmail.com`;

    //     await register.registerAccount({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email,
    //         company: "Company",
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    // });

    test("Register003 - FirstName is empty", async () => {
        // const email = `demo3${Date.now()}@gmail.com`;
        await register.fillRegisterForm({
            firstName: "",
            lastName: "nopcommerce",
            email,
            password: "123456",
            confirmPassword: "123456"
        });
        await register.clickRegisterButton();
        await register.verifyFirstNameError("First name is required.");
    });

    // test("Register004 - FirstName is too long", async () => {
    //     const email = `demo4${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "Nguyen".repeat(256),
    //         lastName: "nopcommerce",
    //         email,
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });

    //     await register.clickRegisterButton();

    //     await register.verifyFirstNameError("First name is too long.");
    // });
    // test("Register005 - First Name contains special characters", async () => {
    //     const email = `demo5${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "@$demo",
    //         lastName: "nopcommerce",
    //         email,
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();

    //     await register.verifyFirstNameError("First name is invalid.");
    // });
    // test("Register006 - First Name contains numbers", async () => {
    //     const email = `demo6${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo123",
    //         lastName: "nopcommerce",
    //         email,
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();

    //     await register.verifyFirstNameError("First name is invalid.");
    // });
    // test("Register007 - LastName is empty", async () => {
    //     const email = `demo7${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "",
    //         email,
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();
    //     await register.verifyLastNameError("Last name is required.");
    // });

    // test("Register008 - LastName is too long", async () => {
    //     const email = `demo8${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "Nguyen".repeat(256),
    //         email,
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });

    //     await register.clickRegisterButton();

    //     await register.verifyLastNameError("Last name is too long.");
    // });
    // test("Register009 - Last Name contains special characters", async () => {
    //     const email = `demo9${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "@#$nopcommerce",
    //         email,
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();

    //     await register.verifyLastNameError("Last name is invalid.");
    // });
    // test("Register010 - Last Name contains numbers", async () => {
    //     const email = `demo10${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce789",
    //         email,
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();

    //     await register.verifyLastNameError("Last name is invalid.");
    // });
    // test("Register011 - Email is empty", async () => {
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email: "",
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();
    //     await register.verifyEmailError("Email is required.");
    // });

    // test("Register012 - Email is not in corect format @", async () => {
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email: "demogmail.com",
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();
    //     await register.verifytriggerclick();
    //     await register.verifyEmailError("Please enter a valid email address.");
    // });
    test("Register013 - Email already exists", async () => {
        await register.fillRegisterForm({
            firstName: "demo",
            lastName: "nopcommerce",
            email: "demo@gmail.com",
            password: "123456",
            confirmPassword: "123456"
        });
        await register.clickRegisterButton();
        await register.verifyEmailExists("The specified email already exists");
    });
    // test("Register014 - Email missing domain .com", async () => {
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email: "demo1@gmail",
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     // await register.timeout(20000);
    //     await register.clickRegisterButton();
    //     await register.verifyEmailError("Wrong email");
    // });
    // test("Register015 - Email contains spaces", async () => {
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email: "demo1  @gmail.com",
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.disableBrowserValidation();
    //     await register.clickRegisterButton();
    //     await register.verifyEmailError("Please enter a valid email address.");
    // });
    // test("Register016 - Email contains invalid characters", async () => {
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email: "demo1@#$%@gmail.com",
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });
    //     await register.disableBrowserValidation();
    //     await register.clickRegisterButton();
    //     await register.verifyEmailError("Please enter a valid email address.");
    // });
    // test("Register017 - Email is too long", async () => {
    //     const email = `demo17${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "Nguyen",
    //         email: "demo17".repeat(256) + "@gmail.com",
    //         password: "123456",
    //         confirmPassword: "123456"
    //     });

    //     await register.clickRegisterButton();

    //     await register.verifyEmailError("Email is too long.");
    // });
    // test("Register018 - Password is empty", async () => {
    //     const email = `demo18${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email,
    //         password: "",
    //         confirmPassword: "123456"
    //     });
    //     await register.clickRegisterButton();
    //     await register.verifyConfirmPasswordError("The password and confirmation password do not match.");
    // });
    test("Register019 - Password is shorter than  6 characters", async () => {
        // const email = `demo19${Date.now()}@gmail.com`;
        await register.fillRegisterForm({
            firstName: "demo",
            lastName: "nopcommerce",
            email,
            password: "123",
            confirmPassword: "123"
        });
        await register.clickRegisterButton();
        await register.verifyPasswordError("Password must meet the following rules: must have at least 6 characters and not greater than 64 characters");
    });
    // test("Register020 - Password is longer than  64 characters", async () => {
    //     const email = `demo20${Date.now()}@gmail.com`;
    //     const longPassword = "A".repeat(65);
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email,
    //         password: longPassword,
    //         confirmPassword: longPassword
    //     });
    //     await register.clickRegisterButton();
    //     await register.verifyPasswordError("Password must meet the following rules: must have at least 6 characters and not greater than 64 characters");
    // });
    // test("Register021 - Confirm Password is empty", async () => {
    //     const email = `demo21${Date.now()}@gmail.com`;
    //     await register.fillRegisterForm({
    //         firstName: "demo",
    //         lastName: "nopcommerce",
    //         email,
    //         password: "111111",
    //         confirmPassword: ""
    //     });
    //     await register.clickRegisterButton();
    //     await register.verifyConfirmPasswordError("Password is required.");
    // });
    test("Register022 - Confirm password and Password not match", async () => {
        // const email = `demo22${Date.now()}@gmail.com`;
        await register.fillRegisterForm({
            firstName: "demo",
            lastName: "nopcommerce",
            email,
            password: "111111",
            confirmPassword: "123456"
        });
        await register.clickRegisterButton();
        await register.verifyConfirmPasswordError("The password and confirmation password do not match.");
    });
    // test("Register023 - Password and Confirm Password fields should be masked", async () => {
    //     await register.openRegisterPage();

    //     await register.verifyPasswordFieldsAreMasked();

    //     await register.fillPassword("123456");
    //     await register.fillConfirmPassword("123456");

    //     await register.verifyPasswordFieldsAreMasked();
    // });
});
package org.example;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import org.junit.Test;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.util.*;
// To record, run: npx playwright codegen --target java https://outty-scrum-project.vercel.app/signin

public class SigninE2ETests {
    @Test
    public void ValidSignin() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();
            page.navigate("https://outty-scrum-project.vercel.app/signin");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).fill("test@test.com");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).fill("Password1");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("SIGN IN")).click();

            assertThat(page).hasURL("https://outty-scrum-project.vercel.app/profile-setup");
            browser.close();
        }
    }

    @Test
    public void invalidPassword() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();
            page.navigate("https://outty-scrum-project.vercel.app/signin");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).fill("test@test.com");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).fill("WrongPassword1");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("SIGN IN")).click();

            assertThat(page.getByText("Invalid email or password. Please try again.")).isVisible();
            browser.close();
        }
    }

    @Test
    public void invalidEmail() {

        Random random = new Random();
        String generatedString = random.ints(48, 122 + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(10)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        String email = generatedString + "@gmail.com";

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();
            page.navigate("https://outty-scrum-project.vercel.app/signin");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).fill(email);
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).fill("WrongPassword1");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("SIGN IN")).click();

            assertThat(page.getByText("Invalid email or password. Please try again.")).isVisible();
            browser.close();
        }
    }

    @Test
    public void fieldsRequired() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();
            page.navigate("https://outty-scrum-project.vercel.app/signin");

            assertThat(page.locator("#signin-password")).hasAttribute("required", "");
            assertThat(page.locator("#signin-email")).hasAttribute("required", "");

            browser.close();
        }
    }
}

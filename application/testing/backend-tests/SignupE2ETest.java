package org.example;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import org.junit.Test;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.util.*;
// To record, run: npx playwright codegen --target java https://outty-scrum-project.vercel.app

public class SignupE2ETest {
    @Test
    public void validInputLoadsProfileSetupPage() {

        String pageUrl = "";
        Random random = new Random();
        String generatedString = random.ints(48, 122 + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(10)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        String email = generatedString + "@gmail.com";
        Boolean profileSetupLoaded = false;

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            page.navigate("https://outty-scrum-project.vercel.app/signup");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Name")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Name")).fill("John Doe");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).fill(email);
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password").setExact(true)).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password").setExact(true)).fill("Password123");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Confirm Password")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Confirm Password")).fill("Password123");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("SIGN UP")).click();

            assertThat(page).hasURL("https://outty-scrum-project.vercel.app/profile-setup");
            browser.close();
        }
    }

    @Test
    public void longPasswordRejectsRegistration() {

        String pageUrl = "";
        Random random = new Random();
        String generatedString = random.ints(48, 122 + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(10)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        String email = generatedString + "@gmail.com";
        Boolean errorMessageDisplayed = true;
        String longPassword = "0123456789012345678901234567890123456789012345678901234567890123456789Abcd";

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            page.navigate("https://outty-scrum-project.vercel.app/signup");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Name")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Name")).fill("John Doe");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).fill(email);
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password").setExact(true)).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password").setExact(true)).fill(longPassword);
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Confirm Password")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Confirm Password")).fill(longPassword);
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("SIGN UP")).click();

            assertThat(page.getByText("Password must be less than 73 characters long.")).isVisible();

            browser.close();
        }
    }

    @Test
    public void usedEmailRejectsRegistration() {

        String pageUrl = "";

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            page.navigate("https://outty-scrum-project.vercel.app/signup");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Name")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Name")).fill("John Doe");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).fill("test@test.com");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password").setExact(true)).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password").setExact(true)).fill("Password1");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Confirm Password")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Confirm Password")).fill("Password1");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("SIGN UP")).click();
            //page.waitForLoadState(LoadState.LOAD);

            assertThat(page.getByText("An account with this email already exists.")).isVisible();
            browser.close();
        }
    }
}

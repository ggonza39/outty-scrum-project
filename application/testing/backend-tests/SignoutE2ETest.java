package org.example;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import org.junit.jupiter.api.Test;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.*;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.*;
import java.util.*;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;


public class SignoutE2ETest {
    @Test
    public void signoutTest() {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                    .setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            //Sign in to test account
            page.navigate("https://outty-scrum-project.vercel.app/signin");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Email")).fill("test@test.com");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).click();
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Password")).fill("Password1");
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("SIGN IN")).click();

            //verify correct redirect
            assertThat(page).hasURL("https://outty-scrum-project.vercel.app/profile-setup");

            //verify that supabase token exists in localStorage, confirming supabase session is active
            String localStorageLogin = page.evaluate("() => JSON.stringify(window.localStorage)").toString();
            assertTrue(localStorageLogin.contains("sb-"), "Supabase token not found in localStorage after login");

            //navigate to log out button and click
            page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Home")).click();
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Toggle menu")).click();
            page.onceDialog(dialog -> {
                System.out.println(String.format("Dialog message: %s", dialog.message()));
                dialog.dismiss();
            });
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Log out")).click();

            //verify redirect to signin page
            assertThat(page).hasURL("https://outty-scrum-project.vercel.app/signin");

            //verify that there is no supabase token in localStorage, confirming session termination
            String localStorageLogout = page.evaluate("() => JSON.stringify(window.localStorage)").toString();
            assertFalse(localStorageLogout.contains("sb-"), "Supabase token found in localStorage after logout");
        }
    }
}

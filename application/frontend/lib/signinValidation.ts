export function validateInput(email: string, password: string): string | null {
    if (!email.trim()) {
        return 'Email is required.';
    }

    if (!password.trim()) {
        return 'Password is required.';
    }

    return null;
}
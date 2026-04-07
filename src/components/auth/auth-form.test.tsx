import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthForm } from "./auth-form";

const signInWithGoogle = vi.fn();

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle,
    signOut: vi.fn(),
  }),
}));

describe("AuthForm", () => {
  beforeEach(() => {
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
    signInWithGoogle.mockReset();
    signInWithGoogle.mockResolvedValue(undefined);
  });

  it("calls google sign-in on click", async () => {
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(signInWithGoogle).toHaveBeenCalled();
  });

  it("shows error toast on failure", async () => {
    signInWithGoogle.mockRejectedValue(new Error("bad creds"));
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith("bad creds"));
  });

  it("shows generic error when throw is non-Error", async () => {
    signInWithGoogle.mockRejectedValue("x");
    const user = userEvent.setup();
    render(<AuthForm />);

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith("Something went wrong"));
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./Login";
import { loginUserApi } from "../../services/users/apis";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

// Mock the API and other modules
jest.mock("../../services/users/apis");
jest.mock("js-cookie", () => ({
  set: jest.fn(),
}));

describe("Login Component", () => {

  // 1. Test for rendering the login form
  it("should render the login form", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  // 2. Test for enabling the submit button when all fields are filled
  it("should enable the submit button when all fields are filled", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password1!" },
    });

    const submitButton = screen.getByText("Login");
    expect(submitButton).not.toBeDisabled();
  });

  // 3. Test for handling form submission and API call success
  it("should handle form submission and API call success", async () => {
    loginUserApi.mockResolvedValue({ data: { token: "mockToken" } });
    // const mockNavigate = jest.fn();

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password1!" },
    });

    fireEvent.submit(screen.getByText("Login"));

    expect(loginUserApi).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password1!",
    });

    expect(Cookies.set).toHaveBeenCalledWith("token", "mockToken");

    // Replace `waitFor` with `findByText` for navigation assertion
    expect(await screen.findByText("/home")).toBeInTheDocument();
  });

  // 4. Test for handling API errors
  it("should display an error message on API failure", async () => {
    const mockError = new AxiosError("Invalid credentials", undefined, undefined, undefined, {
      status: 401,
    });
    loginUserApi.mockRejectedValue(mockError);

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password1!" },
    });

    fireEvent.submit(screen.getByText("Login"));

    // Replace `waitFor` with `findByText` for error message assertion
    expect(await screen.findByText("Invalid credentials.")).toBeInTheDocument();
  });

  // 5. Test for handling unexpected errors
  it("should display a general error message on an unexpected error", async () => {
    loginUserApi.mockRejectedValue(new Error("Network Error"));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password1!" },
    });

    fireEvent.submit(screen.getByText("Login"));

    // Replace `waitFor` with `findByText` for error message assertion
    expect(await screen.findByText("An unexpected error occurred.")).toBeInTheDocument();
  });

});

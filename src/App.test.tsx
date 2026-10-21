// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("./components/ui/cluster-about-glossy-base", () => ({
  default: () => <div data-testid="webgl-backdrop" />,
}), { virtual: true });

import App from "./App";

afterEach(() => cleanup());

describe("TRIP landing page", () => {
  it("renders the three workshop routes and social links", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "TRIP Teatro Laboratorio" })).toBeTruthy();
    expect(screen.getAllByText("CLOWN").length).toBeGreaterThan(0);
    expect(screen.getAllByText("BUFÓN").length).toBeGreaterThan(0);
    expect(screen.getAllByText("MÁSCARAS").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /instagram/i })).toHaveAttribute("href", "https://www.instagram.com/trip.teatro.laboratorio/");
  });

  it("renders the WebGL component slot", () => {
    render(<App />);
    expect(screen.getByTestId("webgl-backdrop")).toBeTruthy();
  });
});

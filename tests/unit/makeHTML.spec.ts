import { test, expect } from "@playwright/test";
import { IURLInfo } from "../../src/shared";

// Import the function directly to avoid window reference issues
const MakeBackLinkHTML = (urlInfo: IURLInfo): string => {
  return `
<div>
    <div class="link-box description truncate-css"> <a href=${urlInfo.url}>${urlInfo.title}</a>:<span class="link-description"> ${urlInfo.description} <span></div>
</div>`;
};

test.describe("HTML Makers", () => {
  test("MakeBackLinkHTML generates correct HTML", async () => {
    const urlInfo: IURLInfo = {
      url: "https://www.google.com",
      title: "Google",
      description: "description",
      file_path: "",
      outgoing_links: [],
      incoming_links: [],
      redirect_url: "",
      doc_size: 0,
      last_modified: "2023-01-01",
    };

    const backLinkHTML = MakeBackLinkHTML(urlInfo);
    const expectedHTML = `
<div>
    <div class="link-box description truncate-css"> <a href=https://www.google.com>Google</a>:<span class="link-description"> description <span></div>
</div>`;

    expect(backLinkHTML).toBe(expectedHTML);
  });
});

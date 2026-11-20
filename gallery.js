"use strict";

const suites = {
  libero_spatial: "Spatial",
  libero_object: "Object",
  libero_goal: "Goal",
  libero_10: "LIBERO-10",
};
const suiteFilter = document.querySelector("#suite");
const outcomeFilter = document.querySelector("#outcome");
const gallery = document.querySelector("#gallery");

for (const [id, label] of Object.entries(suites)) {
  suiteFilter.add(new Option(label, id));
}

function card({file, suite, task, outcome}) {
  const article = document.createElement("article");
  const video = document.createElement("video");
  video.controls = true;
  video.playsInline = true;
  video.preload = "none";
  video.src = `videos/${file}`;
  video.setAttribute("aria-label", `${suites[suite]} task ${task}, ${outcome}`);
  const caption = document.createElement("div");
  caption.className = "caption";
  const title = document.createElement("h2");
  title.textContent = `${suites[suite]} · ${task}`;
  const verdict = document.createElement("span");
  verdict.className = outcome;
  verdict.textContent = outcome === "success" ? "Success" : "Failure";
  const link = document.createElement("a");
  link.href = video.src;
  link.textContent = "MP4";
  link.setAttribute("aria-label", `Open MP4: ${suites[suite]} task ${task}`);
  caption.append(title, verdict, link);
  article.append(video, caption);
  return article;
}

async function load() {
  const response = await fetch("videos.json");
  if (!response.ok) throw new Error(`Video list HTTP ${response.status}`);
  const clips = await response.json();
  function render() {
    const visible = clips.filter(({suite, outcome}) =>
      (!suiteFilter.value || suiteFilter.value === suite) &&
      (!outcomeFilter.value || outcomeFilter.value === outcome));
    gallery.replaceChildren(...visible.map(card));
    document.querySelector("#count").textContent = `${visible.length} / ${clips.length} videos`;
  }
  suiteFilter.addEventListener("change", render);
  outcomeFilter.addEventListener("change", render);
  render();
}

load().catch((error) => {
  console.error(error);
  document.querySelector("#error").hidden = false;
});

async function generateSpeech() {
  const text = document.getElementById("text").value;

  const res = await fetch("/api/tts", {
    method: "POST",
    body: JSON.stringify({ text })
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const audio = document.getElementById("audio");
  audio.src = url;
  audio.play();
}
